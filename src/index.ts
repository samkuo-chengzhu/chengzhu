import { Hono } from 'hono';
import type { Env } from './types';
import { resolveIdentity } from './auth';
import { listCars, getCar } from './cars';
import { applyDealer, approveDealer } from './dealers';
import { verifyLineSignature } from './line/signature';
import { handleEvents } from './line/webhook';

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => c.redirect('/home.html'));
app.get('/api/health', (c) => c.json({ ok: true }));
app.get('/api/config', (c) => c.json({ devMode: c.env.DEV_MODE === '1', liffId: c.env.LIFF_CHANNEL_ID || null }));

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
  return c.json(await applyDealer(c.env, body, id.userId));
});

// 後台審核通過（簡易管理權限；正式請改 secret + 真正的後台）
app.post('/api/admin/dealers/:id/approve', async (c) => {
  if (c.req.header('X-Admin-Token') !== c.env.ADMIN_TOKEN) return c.json({ error: 'unauthorized' }, 401);
  return c.json(await approveDealer(c.env, c.req.param('id')));
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

export default app;
