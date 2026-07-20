import { Hono } from 'hono';
import type { Env } from './types';
import { resolveIdentity } from './auth';
import { listCars, getCar, adminListCars, adminGetCar, createCar, updateCar, deleteCar, addCarPhotoRow, deleteCarPhoto } from './cars';
import { applyDealer, approveDealer, listDealers, getDealer, setDealerStatus, updateDealer, deleteDealer } from './dealers';
import { createOrder, listOrders, setOrderStatus } from './orders';
import { verifyLineSignature } from './line/signature';
import { handleEvents, notifyAdminsNewDealer, notifyAdminsNewOrder } from './line/webhook';
import { rebuildRichMenu } from './line/richmenu';

const app = new Hono<{ Bindings: Env }>();

// LIFF 入口（LINE 內）：/app?p=<page> 導到對應頁（query 比「LIFF endpoint 額外路徑」穩）；
// ?status= 進該狀態車源列表、?goto= 走會員流程；否則預設車源列表。
// 公開官網的 / 不再進這裡 —— 由檔尾的反向代理交給 Cloudflare Pages（Astro）。
const liffEntry = (c: any) => {
  const pages: Record<string, string> = { 'admin-bind': '/app/admin-bind.html', apply: '/app/apply.html', list: '/app/list.html', home: '/app/home.html', detail: '/app/detail.html' };
  const p = c.req.query('p');
  if (p && pages[p]) return c.redirect(pages[p]);
  const status = c.req.query('status');
  if (status) return c.redirect('/app/list.html?status=' + encodeURIComponent(status));
  const goto = c.req.query('goto');
  if (goto) return c.redirect('/app/list.html?goto=' + encodeURIComponent(goto));
  return c.redirect('/app/list.html');
};
app.get('/app', liffEntry);
app.get('/app/', liffEntry);
app.get('/api/health', (c) => c.json({ ok: true }));
app.get('/api/config', (c) => c.json({ devMode: c.env.DEV_MODE === '1', liffId: c.env.LIFF_CHANNEL_ID || null, adminConfigured: !!c.env.ADMIN_TOKEN }));

// 目前身分（前端可用來決定畫面）
app.get('/api/dealers/me', async (c) => {
  const id = await resolveIdentity(c.req.header('Authorization'), c.env);
  return c.json({ role: id.role, userId: id.userId ?? null });
});

// 車源列表 ─ 批發價只對已驗證車商（role==='dealer'）回傳
app.get('/api/cars', async (c) => {
  const id = await resolveIdentity(c.req.header('Authorization'), c.env);
  return c.json(await listCars(c.env, id.role === 'dealer'));
});

// 車源詳情 ─ 同樣 gating
app.get('/api/cars/:id', async (c) => {
  const id = await resolveIdentity(c.req.header('Authorization'), c.env);
  const car = await getCar(c.env, c.req.param('id'), id.role === 'dealer');
  return car ? c.json(car) : c.json({ error: 'not_found' }, 404);
});

// 車商申請
app.post('/api/dealers/apply', async (c) => {
  const id = await resolveIdentity(c.req.header('Authorization'), c.env);
  const body = await c.req.json().catch(() => ({}));
  const result = await applyDealer(c.env, body, id.userId);
  c.executionCtx.waitUntil(notifyAdminsNewDealer(c.env, body, (result as any).id)); // 非阻塞：通知已綁定的管理員（卡片可直接審核）
  return c.json(result);
});

// 車商申請：上傳名片 / 營登照片到 R2（需在 LINE 內取得身分）
app.post('/api/dealers/upload-card', async (c) => {
  const id = await resolveIdentity(c.req.header('Authorization'), c.env);
  if (!id.userId) return c.json({ error: 'login_required' }, 401);
  const body = await c.req.parseBody();
  const file = body['file'];
  if (!(file instanceof File)) return c.json({ error: 'no_file' }, 400);
  if (!file.type.startsWith('image/')) return c.json({ error: 'not_image' }, 400);
  if (file.size > 10 * 1024 * 1024) return c.json({ error: 'too_large' }, 400);
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'jpg';
  const key = `cards/${crypto.randomUUID()}.${ext}`;
  await c.env.PHOTOS.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  return c.json({ url: `/photos/${key}` });
});

// 下訂鎖車（限已驗證車商）
app.post('/api/orders/lock', async (c) => {
  const id = await resolveIdentity(c.req.header('Authorization'), c.env);
  if (id.role !== 'dealer' || !id.dealerId) return c.json({ error: 'not_dealer' }, 403);
  const body = await c.req.json().catch(() => ({}));
  if (!body?.carId) return c.json({ error: 'no_car' }, 400);
  const r = await createOrder(c.env, body.carId, id.dealerId);
  if ((r as any).error) return c.json(r, 400);
  c.executionCtx.waitUntil(notifyAdminsNewOrder(c.env, (r as any).id)); // 非阻塞：通知管理員可確認接單
  return c.json(r);
});

// 管理員通知綁定（LINE 內 LIFF）：用 access token 自動取得 UID + 頁面輸入一次密碼即綁定（密碼不進聊天）
app.get('/api/admin/bind-status', async (c) => {
  const id = await resolveIdentity(c.req.header('Authorization'), c.env);
  if (!id.userId) return c.json({ inLine: false, bound: false, configured: !!c.env.ADMIN_TOKEN });
  const row = await c.env.DB.prepare('SELECT 1 FROM admins WHERE line_user_id = ?').bind(id.userId).first();
  return c.json({ inLine: true, bound: !!row, configured: !!c.env.ADMIN_TOKEN });
});
app.post('/api/admin/bind', async (c) => {
  const id = await resolveIdentity(c.req.header('Authorization'), c.env);
  if (!id.userId) return c.json({ error: 'login_required' }, 401);
  const body = await c.req.json().catch(() => ({}));
  if (!c.env.ADMIN_TOKEN || body?.token !== c.env.ADMIN_TOKEN) return c.json({ error: 'bad_token' }, 403);
  await c.env.DB.prepare('INSERT OR IGNORE INTO admins (line_user_id) VALUES (?)').bind(id.userId).run();
  return c.json({ ok: true });
});
app.post('/api/admin/unbind', async (c) => {
  const id = await resolveIdentity(c.req.header('Authorization'), c.env);
  if (!id.userId) return c.json({ error: 'login_required' }, 401);
  await c.env.DB.prepare('DELETE FROM admins WHERE line_user_id = ?').bind(id.userId).run();
  return c.json({ ok: true });
});

// 後台管理權限：X-Admin-Token 必須等於 secret；未設定一律拒絕（fail-closed）
const adminOk = (c: any) => {
  const t = c.env.ADMIN_TOKEN;
  return !!t && c.req.header('X-Admin-Token') === t;
};

// 後台：列出車商（?status=pending|verified|suspended，省略=全部）
app.get('/api/admin/dealers', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  return c.json(await listDealers(c.env, c.req.query('status') || undefined, c.req.query('q') || undefined));
});

// 後台：審核通過（L3 verified）
app.post('/api/admin/dealers/:id/approve', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  return c.json(await approveDealer(c.env, c.req.param('id')));
});

// 後台：婉拒 / 停權（status → suspended，看不到批發價）
app.post('/api/admin/dealers/:id/reject', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  return c.json(await setDealerStatus(c.env, c.req.param('id'), 'suspended'));
});

// 後台：編輯車商資料
app.post('/api/admin/dealers/:id/update', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  const body = await c.req.json().catch(() => ({}));
  return c.json(await updateDealer(c.env, c.req.param('id'), body));
});

// 後台：刪除車商
app.post('/api/admin/dealers/:id/delete', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  return c.json(await deleteDealer(c.env, c.req.param('id')));
});

// 後台：新申請通知綁定狀態（給後台 UI 顯示提示用）
app.get('/api/admin/notify-status', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  const row = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM admins').first<any>();
  return c.json({ bound: (row?.n || 0) > 0, count: row?.n || 0 });
});

// 後台：單一車商完整資料（含收車類型 / 備註 / 名片照片）
app.get('/api/admin/dealers/:id', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  const d = await getDealer(c.env, c.req.param('id'));
  return d ? c.json(d) : c.json({ error: 'not_found' }, 404);
});

// 後台：重建 LINE 圖文選單（套用新版圖 + 各格連結，設為預設）
app.post('/api/admin/richmenu/rebuild', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  return c.json(await rebuildRichMenu(c.env));
});

// 後台：訂單（下訂鎖車）列表
app.get('/api/admin/orders', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  return c.json(await listOrders(c.env, c.req.query('status') || undefined));
});

// 後台：推進訂單狀態（鎖車中→已確認→已收訂金→已交車 / 取消）
app.post('/api/admin/orders/:id/status', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  const body = await c.req.json().catch(() => ({}));
  const allowed = ['locked', 'confirmed', 'deposit_paid', 'completed', 'cancelled'];
  if (!allowed.includes(body?.status)) return c.json({ error: 'bad_status' }, 400);
  return c.json(await setOrderStatus(c.env, c.req.param('id'), body.status));
});

// ───────── 後台：車源管理 ─────────
app.get('/api/admin/cars', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  return c.json(await adminListCars(c.env, c.req.query('status') || undefined, c.req.query('q') || undefined));
});
app.get('/api/admin/cars/:id', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  const car = await adminGetCar(c.env, c.req.param('id'));
  return car ? c.json(car) : c.json({ error: 'not_found' }, 404);
});
app.post('/api/admin/cars', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  const body = await c.req.json().catch(() => ({}));
  const r = await createCar(c.env, body);
  return (r as any).error ? c.json(r, 400) : c.json(r);
});
app.post('/api/admin/cars/:id/update', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  const body = await c.req.json().catch(() => ({}));
  return c.json(await updateCar(c.env, c.req.param('id'), body));
});
app.post('/api/admin/cars/:id/delete', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  return c.json(await deleteCar(c.env, c.req.param('id')));
});

// 後台：上傳車輛照片到 R2
app.post('/api/admin/cars/:id/photos', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  const id = c.req.param('id');
  const body = await c.req.parseBody();
  const file = body['file'];
  if (!(file instanceof File)) return c.json({ error: 'no_file' }, 400);
  if (!file.type.startsWith('image/')) return c.json({ error: 'not_image' }, 400);
  if (file.size > 10 * 1024 * 1024) return c.json({ error: 'too_large' }, 400);
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'jpg';
  const key = `cars/${id}/${crypto.randomUUID()}.${ext}`;
  await c.env.PHOTOS.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
  return c.json(await addCarPhotoRow(c.env, id, `/photos/${key}`, typeof body['caption'] === 'string' ? body['caption'] : undefined));
});
app.post('/api/admin/cars/:id/photos/:photoId/delete', async (c) => {
  if (!adminOk(c)) return c.json({ error: 'unauthorized' }, 401);
  return c.json(await deleteCarPhoto(c.env, c.req.param('id'), c.req.param('photoId')));
});

// 公開：從 R2 提供車輛照片
app.get('/photos/*', async (c) => {
  const key = c.req.path.replace(/^\/photos\//, '');
  if (!key) return c.notFound();
  const obj = await c.env.PHOTOS.get(key);
  if (!obj) return c.notFound();
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  return new Response(obj.body, { headers });
});

// LINE webhook ─ 簽章驗證 + 事件處理（加好友→歡迎訊息）
app.post('/line/webhook', async (c) => {
  const raw = await c.req.text();
  const ok = await verifyLineSignature(raw, c.req.header('x-line-signature'), c.env.LINE_CHANNEL_SECRET || '');
  if (!ok) return c.text('signature mismatch', 401);
  const body = JSON.parse(raw || '{}');
  await handleEvents(body.events || [], c.env);
  return c.json({ ok: true });
});

// LINE 設定狀態：檢查憑證是否就緒（設定時方便除錯）
app.get('/api/line/status', (c) => c.json({
  hasToken: !!c.env.LINE_CHANNEL_ACCESS_TOKEN,
  hasSecret: !!c.env.LINE_CHANNEL_SECRET,
  liffId: c.env.LIFF_CHANNEL_ID || null,
  webhookUrl: (c.env.SITE_URL || 'https://chengzhu-cars.kuo-tinghow.workers.dev') + '/line/webhook',
}));

// 舊版後台網址相容：admin 頁已從根目錄搬到 /app/（public/app/，網址 /admin.html → /app/admin.html）。
// 沿用舊書籤的後台連結若不處理會被下方反向代理丟給 Astro → 404、進不去後台。這裡 301 導到新路徑。
const ADMIN_ALIASES: Record<string, string> = {
  '/admin.html': '/app/admin.html',
  '/admin-cars.html': '/app/admin-cars.html',
  '/admin-orders.html': '/app/admin-orders.html',
  '/admin-bind.html': '/app/admin-bind.html',
};
for (const [from, to] of Object.entries(ADMIN_ALIASES)) {
  app.get(from, (c) => c.redirect(to, 301));
}

// ───────── 公開官網反向代理 ─────────
// /app/*（LIFF）與 /assets/* 由 [assets] 直接提供、/api・/photos・/line 由上方路由處理；
// 其餘路徑（/、/cars、/about、/dealer、/_astro/* …）反向代理到 Astro 的 Cloudflare Pages。
const RESERVED = ['/api', '/app', '/photos', '/line', '/assets'];
app.all('*', async (c) => {
  const url = new URL(c.req.url);
  // 保留前綴若到這裡代表沒對應資源/路由 —— 回 404，不要外流到 Pages
  if (RESERVED.some((p) => url.pathname === p || url.pathname.startsWith(p + '/'))) {
    return c.notFound();
  }
  const origin = (c.env.PAGES_ORIGIN || '').replace(/\/$/, '');
  if (!origin) return c.text('public site origin (PAGES_ORIGIN) not configured', 502);
  const headers = new Headers(c.req.raw.headers);
  headers.delete('host');
  const init: RequestInit = { method: c.req.method, headers, redirect: 'manual' };
  if (c.req.method !== 'GET' && c.req.method !== 'HEAD') init.body = c.req.raw.body;
  const res = await fetch(origin + url.pathname + url.search, init);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: res.headers });
});

export default app;
