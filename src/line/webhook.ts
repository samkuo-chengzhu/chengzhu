import type { Env } from '../types';
import { lineClient } from './client';
import { approveDealer, setDealerStatus } from '../dealers';
import { getOrderDetail, setOrderStatus } from '../orders';

function siteUrl(env: Env) { return env.SITE_URL || 'https://chengzhu-cars.kuo-tinghow.workers.dev'; }
// 在 LINE 內開頁面用 LIFF 連結 + ?p= 查詢參數路由（保證取得身分，且不受 LIFF endpoint 路徑設定影響而 404）
function liffUrl(env: Env, page: string) {
  const key = page.replace(/\.html$/, '');
  return env.LIFF_CHANNEL_ID ? `https://liff.line.me/${env.LIFF_CHANNEL_ID}?p=${key}` : `${siteUrl(env)}/app/${key}.html`;
}
function safeParse(s: any): any[] { if (Array.isArray(s)) return s; if (!s) return []; try { const a = JSON.parse(s); return Array.isArray(a) ? a : []; } catch { return []; } }
function nt(n: any) { return (n == null) ? '—' : 'NT$ ' + Number(n).toLocaleString('en-US'); }

async function isAdminUser(env: Env, uid?: string): Promise<boolean> {
  if (!uid) return false;
  return !!(await env.DB.prepare('SELECT 1 FROM admins WHERE line_user_id = ?').bind(uid).first());
}

// 加好友歡迎訊息（深黑金 Flex）
function welcomeMessage(env: Env) {
  return {
    type: 'flex',
    altText: '歡迎加入橙築車商批發',
    contents: {
      type: 'bubble',
      body: {
        type: 'box', layout: 'vertical', backgroundColor: '#141417', paddingAll: '18px', spacing: 'sm',
        contents: [
          { type: 'text', text: '橙築車商批發', weight: 'bold', size: 'lg', color: '#E7C977' },
          { type: 'text', text: '日本・韓國進口車・車商專屬批發', size: 'xs', color: '#9A9AA3' },
          { type: 'text', text: '可瀏覽各狀態車源；申請成為車商並通過審核後，即可看到批發底價並線上詢價、下訂鎖車。', size: 'sm', color: '#F3F3F5', wrap: true, margin: 'md' },
        ],
      },
      footer: {
        type: 'box', layout: 'vertical', spacing: 'sm', backgroundColor: '#141417', paddingAll: '14px',
        contents: [
          { type: 'button', style: 'primary', color: '#9C7C3C', action: { type: 'uri', label: '⭐ 申請成為車商', uri: liffUrl(env, 'apply.html') } },
          { type: 'button', style: 'secondary', height: 'sm', action: { type: 'uri', label: '🚗 先逛批發車源', uri: liffUrl(env, 'list.html') } },
        ],
      },
    },
  };
}

// 單一車商卡片（完整資料 + 名片照片 + 「通過 / 婉拒」postback）；通知與「待審核」列表共用
function dealerBubble(env: Env, d: any) {
  const v = (s: any) => (s == null || s === '') ? '—' : String(s);
  const brands = safeParse(d.brands);
  const info = (label: string, text: string) => ({
    type: 'box', layout: 'baseline', spacing: 'sm',
    contents: [
      { type: 'text', text: label, color: '#9A9AA3', size: 'sm', flex: 2 },
      { type: 'text', text, color: '#F3F3F5', size: 'sm', flex: 5, wrap: true },
    ],
  });
  const rows: any[] = [info('公司', v(d.company_name)), info('統編', v(d.tax_id)), info('聯絡人', v(d.contact_name)), info('電話', v(d.phone))];
  if (brands.length) rows.push(info('收車', brands.join('、')));
  if (d.note) rows.push(info('備註', v(d.note)));
  const bubble: any = {
    type: 'bubble',
    body: {
      type: 'box', layout: 'vertical', backgroundColor: '#141417', paddingAll: '16px', spacing: 'sm',
      contents: [
        { type: 'text', text: '🏢 車商申請', weight: 'bold', size: 'lg', color: '#E7C977' },
        { type: 'box', layout: 'vertical', margin: 'md', spacing: 'sm', contents: rows },
      ],
    },
    footer: {
      type: 'box', layout: 'vertical', backgroundColor: '#141417', paddingAll: '14px', spacing: 'sm',
      contents: [
        { type: 'button', style: 'primary', color: '#3FAE6B', action: { type: 'postback', label: '✅ 通過', data: `approve:${d.id}`, displayText: `通過 ${v(d.company_name)}` } },
        { type: 'button', style: 'secondary', height: 'sm', action: { type: 'postback', label: '✗ 婉拒', data: `reject:${d.id}`, displayText: `婉拒 ${v(d.company_name)}` } },
      ],
    },
  };
  // 名片 / 營登照片：Flex 需完整 HTTPS 網址
  if (d.business_card && typeof d.business_card === 'string') {
    const url = d.business_card.startsWith('http') ? d.business_card : `${siteUrl(env)}${d.business_card}`;
    bubble.hero = { type: 'image', url, size: 'full', aspectRatio: '20:13', aspectMode: 'cover', action: { type: 'uri', uri: url } };
  }
  return bubble;
}

// 新下訂鎖車卡片（給管理員，含「確認接單 / 取消」postback）
function orderBubble(o: any) {
  const v = (s: any) => (s == null || s === '') ? '—' : String(s);
  const info = (label: string, text: string) => ({
    type: 'box', layout: 'baseline', spacing: 'sm',
    contents: [
      { type: 'text', text: label, color: '#9A9AA3', size: 'sm', flex: 2 },
      { type: 'text', text, color: '#F3F3F5', size: 'sm', flex: 5, wrap: true },
    ],
  });
  return {
    type: 'bubble',
    body: {
      type: 'box', layout: 'vertical', backgroundColor: '#141417', paddingAll: '16px', spacing: 'sm',
      contents: [
        { type: 'text', text: '🔒 新下訂鎖車', weight: 'bold', size: 'lg', color: '#E7C977' },
        { type: 'box', layout: 'vertical', margin: 'md', spacing: 'sm', contents: [
          info('車商', v(o.company_name)),
          info('車輛', `${v(o.model_year)} ${v(o.brand)} ${v(o.model)}`),
          info('批發價', nt(o.wholesale_price)),
          info('訂金', nt(o.deposit_twd)),
          info('鎖至', v(o.locked_until)),
        ] },
      ],
    },
    footer: {
      type: 'box', layout: 'vertical', backgroundColor: '#141417', paddingAll: '14px', spacing: 'sm',
      contents: [
        { type: 'button', style: 'primary', color: '#3FAE6B', action: { type: 'postback', label: '✅ 確認接單', data: `order_confirm:${o.id}`, displayText: '確認接單' } },
        { type: 'button', style: 'secondary', height: 'sm', action: { type: 'postback', label: '✗ 取消', data: `order_cancel:${o.id}`, displayText: '取消此單' } },
      ],
    },
  };
}

// 處理 webhook events
export async function handleEvents(events: any[], env: Env): Promise<void> {
  const client = lineClient(env.LINE_CHANNEL_ACCESS_TOKEN || '');
  for (const e of events) {
    try {
      if (e.type === 'follow') {
        await client.reply(e.replyToken, [welcomeMessage(env)]);
      } else if (e.type === 'message' && e.message?.type === 'text') {
        const t = String(e.message.text || '').trim();
        const uid = e.source?.userId;
        if (t.startsWith('綁定通知') || t.startsWith('綁定後台')) {
          const pw = t.replace(/^綁定(通知|後台)/, '').trim();
          if (uid && env.ADMIN_TOKEN && pw === env.ADMIN_TOKEN) {
            await env.DB.prepare('INSERT OR IGNORE INTO admins (line_user_id) VALUES (?)').bind(uid).run();
            await client.reply(e.replyToken, [{ type: 'text', text: '✅ 已綁定管理員通知。新車商申請與下訂鎖車都會在這裡通知您，可直接審核。（傳「待審核」叫出待審名單；傳「解除通知」取消）' }]);
          } else {
            await client.reply(e.replyToken, [{ type: 'text', text: '❌ 密碼錯誤，無法綁定。格式：綁定通知 你的後台密碼' }]);
          }
        } else if (t === '解除通知') {
          if (uid) await env.DB.prepare('DELETE FROM admins WHERE line_user_id = ?').bind(uid).run();
          await client.reply(e.replyToken, [{ type: 'text', text: '已解除，之後不再推送通知。' }]);
        } else if (t === '待審核' || t === '待審' || t === '審核') {
          await replyPendingDealers(e, env, client);
        } else if (t.includes('車源') || t.includes('批發') || t.includes('看車') || t.includes('車輛') || t.includes('庫存')) {
          await client.reply(e.replyToken, [{ type: 'text', text: `批發車源請點：${liffUrl(env, 'list.html')}` }]);
        }
      } else if (e.type === 'postback') {
        await handlePostback(e, env, client);
      }
    } catch (err) {
      console.error('handleEvents error', err);
    }
  }
}

// 管理員傳「待審核」→ 把待審車商一張張卡片列出（每張可直接通過/婉拒）
async function replyPendingDealers(e: any, env: Env, client: ReturnType<typeof lineClient>): Promise<void> {
  if (!(await isAdminUser(env, e.source?.userId))) {
    await client.reply(e.replyToken, [{ type: 'text', text: '⚠️ 僅限已綁定的管理員查詢。請先傳「綁定通知 後台密碼」。' }]);
    return;
  }
  const rows = (await env.DB.prepare(
    "SELECT id, company_name, tax_id, contact_name, phone, brands, note, business_card FROM dealers WHERE status = 'pending' ORDER BY created_at DESC LIMIT 10"
  ).all()).results as any[];
  if (!rows.length) {
    await client.reply(e.replyToken, [{ type: 'text', text: '目前沒有待審核的車商 ✅' }]);
    return;
  }
  await client.reply(e.replyToken, [{ type: 'flex', altText: `待審核車商 ${rows.length} 筆`, contents: { type: 'carousel', contents: rows.map((d) => dealerBubble(env, d)) } }]);
}

// 對話式審核 / 接單：卡片按鈕 postback。只有已綁定管理員可操作
async function handlePostback(e: any, env: Env, client: ReturnType<typeof lineClient>): Promise<void> {
  const data = String(e.postback?.data || '');
  if (!(await isAdminUser(env, e.source?.userId))) {
    await client.reply(e.replyToken, [{ type: 'text', text: '⚠️ 僅限已綁定的管理員可操作。' }]);
    return;
  }

  let m = data.match(/^(approve|reject):(.+)$/);
  if (m) {
    const [, act, id] = m;
    const dealer = await env.DB.prepare('SELECT company_name, line_user_id FROM dealers WHERE id = ?').bind(id).first<any>();
    if (!dealer) { await client.reply(e.replyToken, [{ type: 'text', text: '找不到該車商（可能已被刪除）。' }]); return; }
    if (act === 'approve') {
      await approveDealer(env, id);
      await client.reply(e.replyToken, [{ type: 'text', text: `✅ 已通過：${dealer.company_name}\n對方重開車源頁即可看到批發底價。` }]);
      if (dealer.line_user_id) await notifyDealerApproved(env, dealer.line_user_id);
    } else {
      await setDealerStatus(env, id, 'suspended');
      await client.reply(e.replyToken, [{ type: 'text', text: `已婉拒：${dealer.company_name}` }]);
    }
    return;
  }

  m = data.match(/^order_(confirm|cancel):(.+)$/);
  if (m) {
    const [, act, id] = m;
    const o = await getOrderDetail(env, id);
    if (!o) { await client.reply(e.replyToken, [{ type: 'text', text: '找不到該訂單。' }]); return; }
    const carName = `${o.model_year} ${o.brand} ${o.model}`;
    if (act === 'confirm') {
      await setOrderStatus(env, id, 'confirmed');
      await client.reply(e.replyToken, [{ type: 'text', text: `✅ 已確認接單：${o.company_name} · ${carName}` }]);
      if (o.dealer_uid) { try { await lineClient(env.LINE_CHANNEL_ACCESS_TOKEN || '').push(o.dealer_uid, [{ type: 'text', text: `✅ 您的下訂已確認：${carName}\n我們將與您聯繫後續訂金與排船事宜。` }]); } catch (err) {} }
    } else {
      await setOrderStatus(env, id, 'cancelled');
      await client.reply(e.replyToken, [{ type: 'text', text: `已取消訂單：${o.company_name} · ${carName}` }]);
    }
    return;
  }
}

// 新車商申請 → 推播給所有已綁定的管理員（卡片含完整資料 + 名片，可直接審核）
export async function notifyAdminsNewDealer(env: Env, body: any, dealerId?: string): Promise<void> {
  try {
    if (!env.LINE_CHANNEL_ACCESS_TOKEN) return;
    const admins = (await env.DB.prepare('SELECT line_user_id FROM admins').all()).results as any[];
    if (!admins.length) return;
    const d = { id: dealerId, company_name: body?.companyName, tax_id: body?.taxId, contact_name: body?.contactName, phone: body?.phone, brands: body?.brands, note: body?.note, business_card: body?.businessCard };
    const msg = { type: 'flex', altText: `🔔 新車商申請：${d.company_name || ''}`, contents: dealerBubble(env, d) };
    const client = lineClient(env.LINE_CHANNEL_ACCESS_TOKEN);
    for (const a of admins) { try { await client.push(a.line_user_id, [msg]); } catch (e) { /* 單一推播失敗不影響其他 */ } }
  } catch (e) {
    console.error('notifyAdminsNewDealer error', e);
  }
}

// 新下訂鎖車 → 推播給所有已綁定的管理員（可直接確認接單 / 取消）
export async function notifyAdminsNewOrder(env: Env, orderId: string): Promise<void> {
  try {
    if (!env.LINE_CHANNEL_ACCESS_TOKEN) return;
    const admins = (await env.DB.prepare('SELECT line_user_id FROM admins').all()).results as any[];
    if (!admins.length) return;
    const o = await getOrderDetail(env, orderId);
    if (!o) return;
    const msg = { type: 'flex', altText: `🔒 新下訂鎖車：${o.company_name || ''}`, contents: orderBubble(o) };
    const client = lineClient(env.LINE_CHANNEL_ACCESS_TOKEN);
    for (const a of admins) { try { await client.push(a.line_user_id, [msg]); } catch (e) {} }
  } catch (e) {
    console.error('notifyAdminsNewOrder error', e);
  }
}

// 通過後主動通知車商
async function notifyDealerApproved(env: Env, userId: string): Promise<void> {
  try {
    if (!env.LINE_CHANNEL_ACCESS_TOKEN) return;
    const client = lineClient(env.LINE_CHANNEL_ACCESS_TOKEN);
    await client.push(userId, [{
      type: 'flex', altText: '🎉 您的車商申請已通過',
      contents: {
        type: 'bubble',
        body: {
          type: 'box', layout: 'vertical', backgroundColor: '#141417', paddingAll: '18px', spacing: 'sm',
          contents: [
            { type: 'text', text: '🎉 審核通過', weight: 'bold', size: 'lg', color: '#E7C977' },
            { type: 'text', text: '您已成為已驗證車商，現在可看到所有車源的批發底價，並可線上詢價、下訂鎖車。', size: 'sm', color: '#F3F3F5', wrap: true, margin: 'md' },
          ],
        },
        footer: {
          type: 'box', layout: 'vertical', backgroundColor: '#141417', paddingAll: '14px',
          contents: [{ type: 'button', style: 'primary', color: '#9C7C3C', action: { type: 'uri', label: '🚗 查看批發車源', uri: liffUrl(env, 'list.html') } }],
        },
      },
    }]);
  } catch (e) {
    console.error('notifyDealerApproved error', e);
  }
}
