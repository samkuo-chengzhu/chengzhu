import type { Env } from './types';

function parseJSON<T>(s: any, fb: T): T { if (!s) return fb; try { return JSON.parse(s) as T; } catch { return fb; } }

// D1 row → 前端/通知用的車商物件（brands 解析成陣列）
function mapDealer(r: any) {
  return {
    id: r.id,
    company_name: r.company_name,
    tax_id: r.tax_id,
    contact_name: r.contact_name,
    phone: r.phone,
    status: r.status,
    tier: r.tier,
    created_at: r.created_at,
    verified_at: r.verified_at,
    brands: parseJSON<string[]>(r.brands, []),
    note: r.note ?? null,
    business_card: r.business_card ?? null,
  };
}

// 車商申請（L2 pending）。帶 LINE userId 寫入，作為日後 gating 依據。
// 同一 LINE 已申請過 → 更新該筆（重新送件）；已通過者不退回 pending。
export async function applyDealer(env: Env, body: any, userId?: string) {
  const brands = JSON.stringify(Array.isArray(body?.brands) ? body.brands : []);
  const fields = [body?.companyName ?? null, body?.taxId ?? null, body?.contactName ?? null, body?.phone ?? null, body?.businessCard ?? null, brands, body?.note ?? null];

  if (userId) {
    const existing = await env.DB.prepare('SELECT id, status FROM dealers WHERE line_user_id = ?').bind(userId).first<any>();
    if (existing) {
      await env.DB.prepare(
        `UPDATE dealers SET company_name=?, tax_id=?, contact_name=?, phone=?, business_card=?, brands=?, note=?,
         status = CASE WHEN status='verified' THEN 'verified' ELSE 'pending' END WHERE id=?`
      ).bind(...fields, existing.id).run();
      return { id: existing.id, status: existing.status === 'verified' ? 'verified' : 'pending', updated: true };
    }
  }

  const id = 'd_' + crypto.randomUUID().slice(0, 8);
  await env.DB.prepare(
    `INSERT INTO dealers (id, line_user_id, company_name, tax_id, contact_name, phone, business_card, brands, note, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
  ).bind(id, userId ?? null, ...fields).run();
  return { id, status: 'pending' };
}

// 後台審核通過（L3 verified）。
export async function approveDealer(env: Env, id: string) {
  await env.DB.prepare(
    `UPDATE dealers SET status = 'verified', verified_at = datetime('now') WHERE id = ?`
  ).bind(id).run();
  return { id, status: 'verified' };
}

// 後台：列出車商（可依狀態過濾 + 關鍵字搜尋）。不回傳 line_user_id 等敏感綁定值。
export async function listDealers(env: Env, status?: string, q?: string) {
  const cols = 'id, company_name, tax_id, contact_name, phone, status, tier, created_at, verified_at, brands, note, business_card';
  const where: string[] = [];
  const vals: any[] = [];
  if (status) { where.push('status = ?'); vals.push(status); }
  if (q) {
    const like = `%${q}%`;
    where.push('(company_name LIKE ? OR tax_id LIKE ? OR contact_name LIKE ? OR phone LIKE ?)');
    vals.push(like, like, like, like);
  }
  const sql = `SELECT ${cols} FROM dealers${where.length ? ' WHERE ' + where.join(' AND ') : ''} ORDER BY created_at DESC`;
  const stmt = env.DB.prepare(sql);
  const rows = (await (vals.length ? stmt.bind(...vals) : stmt).all()).results as any[];
  return rows.map(mapDealer);
}

// 後台：單一車商完整資料（含收車類型 / 備註 / 名片照片）
export async function getDealer(env: Env, id: string) {
  const r = await env.DB.prepare(
    'SELECT id, company_name, tax_id, contact_name, phone, status, tier, created_at, verified_at, brands, note, business_card FROM dealers WHERE id = ?'
  ).bind(id).first<any>();
  return r ? mapDealer(r) : null;
}

// 後台：變更車商狀態（婉拒/停權 → suspended）。verified 走 approveDealer 以寫入 verified_at。
export async function setDealerStatus(env: Env, id: string, status: 'pending' | 'verified' | 'suspended') {
  if (status === 'verified') return approveDealer(env, id);
  await env.DB.prepare(`UPDATE dealers SET status = ? WHERE id = ?`).bind(status, id).run();
  return { id, status };
}

// 後台：編輯車商資料（白名單欄位，避免任意欄位/SQL 注入）
const EDITABLE_FIELDS = ['company_name', 'tax_id', 'contact_name', 'phone', 'tier', 'note'] as const;
export async function updateDealer(env: Env, id: string, body: any) {
  const sets: string[] = [];
  const vals: any[] = [];
  for (const k of EDITABLE_FIELDS) {
    if (body && body[k] !== undefined) { sets.push(`${k} = ?`); vals.push(body[k] === '' ? null : body[k]); }
  }
  if (body && body.brands !== undefined) { sets.push('brands = ?'); vals.push(JSON.stringify(Array.isArray(body.brands) ? body.brands : [])); }
  if (!sets.length) return { id, updated: 0 };
  vals.push(id);
  await env.DB.prepare(`UPDATE dealers SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
  return { id, updated: sets.length };
}

// 後台：刪除車商
export async function deleteDealer(env: Env, id: string) {
  await env.DB.prepare(`DELETE FROM dealers WHERE id = ?`).bind(id).run();
  return { id, deleted: true };
}
