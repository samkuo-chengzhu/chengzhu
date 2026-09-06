import type { Env } from './types';

// 下訂鎖車：建立一筆 locked 訂單（同一台車同時只允許一筆有效鎖車）
export async function createOrder(env: Env, carId: string, dealerId: string) {
  const car = await env.DB.prepare('SELECT id, status, wholesale_price, lock_days, deposit_pct FROM cars WHERE id = ?').bind(carId).first<any>();
  if (!car) return { error: 'car_not_found' };
  if (car.status === 'sold') return { error: 'car_sold' };
  const active = await env.DB.prepare("SELECT id FROM orders WHERE car_id = ? AND status IN ('locked','deposit_paid','confirmed')").bind(carId).first();
  if (active) return { error: 'already_locked' };

  const id = 'o_' + crypto.randomUUID().slice(0, 8);
  const lockDays = car.lock_days || 3;
  const deposit = (car.wholesale_price && car.deposit_pct) ? Math.round((car.wholesale_price * car.deposit_pct) / 100) : null;
  await env.DB.prepare(
    `INSERT INTO orders (id, car_id, dealer_id, status, locked_until, deposit_twd)
     VALUES (?, ?, ?, 'locked', datetime('now', '+' || ? || ' days'), ?)`
  ).bind(id, carId, dealerId, lockDays, deposit).run();
  // 車輛連動：下訂後自動變「預訂中」，離開現車在庫
  await env.DB.prepare("UPDATE cars SET status = 'reserved', updated_at = datetime('now') WHERE id = ?").bind(carId).run();
  return { id, status: 'locked', lockDays, deposit };
}

// 後台：變更訂單狀態（連動車輛：完成交車→已售出下架；取消→復原現車在庫）
export async function setOrderStatus(env: Env, id: string, status: string) {
  const order = await env.DB.prepare('SELECT car_id FROM orders WHERE id = ?').bind(id).first<any>();
  await env.DB.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, id).run();
  if (order) {
    if (status === 'completed') await env.DB.prepare("UPDATE cars SET status = 'sold', updated_at = datetime('now') WHERE id = ?").bind(order.car_id).run();
    else if (status === 'cancelled') await env.DB.prepare("UPDATE cars SET status = 'in_stock', updated_at = datetime('now') WHERE id = ?").bind(order.car_id).run();
  }
  return { id, status };
}

// 訂單完整資料（含車輛與車商，給通知/後台用）
export async function getOrderDetail(env: Env, id: string) {
  return env.DB.prepare(
    `SELECT o.id, o.status, o.locked_until, o.deposit_twd, o.created_at,
            c.brand, c.model, c.model_year, c.wholesale_price,
            d.company_name, d.line_user_id AS dealer_uid
     FROM orders o JOIN cars c ON c.id = o.car_id JOIN dealers d ON d.id = o.dealer_id
     WHERE o.id = ?`
  ).bind(id).first<any>();
}

// 後台：訂單列表（可依狀態過濾）
export async function listOrders(env: Env, status?: string) {
  const base = `SELECT o.id, o.status, o.locked_until, o.deposit_twd, o.created_at,
            c.brand, c.model, c.model_year, d.company_name
     FROM orders o JOIN cars c ON c.id = o.car_id JOIN dealers d ON d.id = o.dealer_id`;
  const stmt = status
    ? env.DB.prepare(base + ' WHERE o.status = ? ORDER BY o.created_at DESC').bind(status)
    : env.DB.prepare(base + ' ORDER BY o.created_at DESC');
  return (await stmt.all()).results;
}
