import type { Env } from './types';

// 車商申請（L2 pending）。正式模式會帶 LINE userId 一起寫入，作為日後 gating 依據。
export async function applyDealer(env: Env, body: any, userId?: string) {
  const id = 'd_' + crypto.randomUUID().slice(0, 8);
  await env.DB.prepare(
    `INSERT INTO dealers (id, line_user_id, company_name, tax_id, contact_name, phone, status)
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`
  ).bind(
    id,
    userId ?? null,
    body?.companyName ?? null,
    body?.taxId ?? null,
    body?.contactName ?? null,
    body?.phone ?? null
  ).run();
  return { id, status: 'pending' };
}

// 後台審核通過（L3 verified）。
// TODO 下一階段：approve 後呼叫 LINE linkRichMenuToUser，把該 userId 切成「車商版」圖文選單。
export async function approveDealer(env: Env, id: string) {
  await env.DB.prepare(
    `UPDATE dealers SET status = 'verified', verified_at = datetime('now') WHERE id = ?`
  ).bind(id).run();
  return { id, status: 'verified' };
}
