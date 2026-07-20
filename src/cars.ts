import type { Env } from './types';

// D1 raw row → 前端用的車輛物件（欄位對齊前端車輛物件）。
// canSee=false 時，批發價/建議零售一律設為 null —— 後端強制 gating，前端拿不到價就顯示鎖。
function mapCar(row: any, photos: any[], canSee: boolean) {
  return {
    id: row.id,
    status: row.status,
    brand: row.brand,
    model: row.model,
    modelYear: row.model_year,
    regionSpec: row.region_spec,
    mileageKm: row.mileage_km,
    fuel: row.fuel,
    displacementCc: row.displacement_cc,
    drivetrain: row.drivetrain,
    transmission: row.transmission,
    engine: row.engine,
    tires: row.tires,
    horsepower: row.horsepower,
    exteriorColor: row.exterior_color,
    interiorColor: row.interior_color,
    vinDisplay: maskVin(row.vin),
    productionDate: row.production_date,
    wholesalePrice: canSee ? row.wholesale_price : null,
    suggestedRetail: canSee ? row.suggested_retail : null,
    lockDays: row.lock_days,
    depositPct: row.deposit_pct,
    etaWeeksMin: row.eta_weeks_min,
    etaWeeksMax: row.eta_weeks_max,
    accidentFree: !!row.accident_free,
    highlights: parseJSON(row.highlights, []),
    spec: parseJSON(row.spec, {}),
    carfaxUrl: row.carfax_url,
    decodeUrl: row.decode_url,
    photos: photos.map((p) => ({ url: p.url, caption: p.caption })),
    placeholder: photos.length === 0,
  };
}

function maskVin(vin: string | null): string | null {
  if (!vin) return null;
  return vin.length > 12 ? `${vin.slice(0, 6)}...${vin.slice(-6)}` : vin;
}
function parseJSON<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

// 車源流水線排序：現車在庫優先、預訂中最後
const RANK =
  "CASE status WHEN 'in_stock' THEN 0 WHEN 'inspection' THEN 1 WHEN 'customs' THEN 2 WHEN 'shipping' THEN 3 WHEN 'reserved' THEN 4 ELSE 5 END";

export async function listCars(env: Env, canSee: boolean) {
  const cars = (await env.DB.prepare(`SELECT * FROM cars WHERE status != 'sold' ORDER BY ${RANK}, created_at`).all()).results as any[];
  const photos = (await env.DB.prepare('SELECT car_id, url, caption FROM car_photos ORDER BY sort_order').all()).results as any[];
  const byCar: Record<string, any[]> = {};
  for (const p of photos) (byCar[p.car_id] ||= []).push(p);
  return cars.map((c) => mapCar(c, byCar[c.id] ?? [], canSee));
}

export async function getCar(env: Env, id: string, canSee: boolean) {
  const row = await env.DB.prepare('SELECT * FROM cars WHERE id = ?').bind(id).first<any>();
  if (!row) return null;
  const photos = (await env.DB.prepare('SELECT url, caption FROM car_photos WHERE car_id = ? ORDER BY sort_order').bind(id).all()).results as any[];
  return mapCar(row, photos, canSee);
}

// ───────────────────────────────────────────────
// 後台：車源 CRUD（皆由 admin token 路由呼叫，回傳完整資料含批發價）
// ───────────────────────────────────────────────
const CAR_INT = ['model_year', 'mileage_km', 'displacement_cc', 'horsepower', 'wholesale_price', 'suggested_retail', 'lock_days', 'deposit_pct', 'eta_weeks_min', 'eta_weeks_max', 'accident_free'];
const CAR_TEXT = ['status', 'brand', 'model', 'region_spec', 'fuel', 'drivetrain', 'transmission', 'engine', 'tires', 'exterior_color', 'interior_color', 'vin', 'production_date', 'carfax_url', 'decode_url', 'cover_photo'];
const CAR_JSON = ['highlights', 'spec'];

// 從 body 取白名單欄位（型別轉換 + JSON 串化），避免任意欄位/SQL 注入
function carFields(body: any): { cols: string[]; vals: any[] } {
  const cols: string[] = [];
  const vals: any[] = [];
  for (const k of CAR_TEXT) if (body[k] !== undefined) { cols.push(k); vals.push(body[k] === '' ? null : body[k]); }
  for (const k of CAR_INT) if (body[k] !== undefined) { const v = body[k]; cols.push(k); vals.push(v === '' || v === null ? null : Number(v)); }
  for (const k of CAR_JSON) if (body[k] !== undefined) { cols.push(k); vals.push(body[k] == null ? null : JSON.stringify(body[k])); }
  return { cols, vals };
}

export async function adminListCars(env: Env, status?: string, q?: string) {
  const where: string[] = [];
  const vals: any[] = [];
  if (status) { where.push('status = ?'); vals.push(status); }
  if (q) { const like = `%${q}%`; where.push('(brand LIKE ? OR model LIKE ? OR vin LIKE ?)'); vals.push(like, like, like); }
  const sql = `SELECT * FROM cars${where.length ? ' WHERE ' + where.join(' AND ') : ''} ORDER BY ${RANK}, created_at DESC`;
  const stmt = env.DB.prepare(sql);
  const cars = (await (vals.length ? stmt.bind(...vals) : stmt).all()).results as any[];
  const photos = (await env.DB.prepare('SELECT car_id, url FROM car_photos ORDER BY sort_order').all()).results as any[];
  const byCar: Record<string, any[]> = {};
  for (const p of photos) (byCar[p.car_id] ||= []).push(p);
  return cars.map((c) => ({
    id: c.id, status: c.status, brand: c.brand, model: c.model, modelYear: c.model_year,
    wholesalePrice: c.wholesale_price, suggestedRetail: c.suggested_retail,
    cover: byCar[c.id]?.[0]?.url || c.cover_photo || null,
    photoCount: byCar[c.id]?.length || 0,
  }));
}

export async function adminGetCar(env: Env, id: string) {
  const row = await env.DB.prepare('SELECT * FROM cars WHERE id = ?').bind(id).first<any>();
  if (!row) return null;
  const photos = (await env.DB.prepare('SELECT id, url, caption, sort_order FROM car_photos WHERE car_id = ? ORDER BY sort_order').bind(id).all()).results;
  return { ...row, highlights: parseJSON(row.highlights, []), spec: parseJSON(row.spec, {}), photos };
}

export async function createCar(env: Env, body: any) {
  if (!body || !body.brand || !body.model || !body.model_year) return { error: 'missing_required' };
  const id = (typeof body.id === 'string' && body.id.trim()) ? body.id.trim() : 'car_' + crypto.randomUUID().slice(0, 8);
  const { cols, vals } = carFields(body);
  const allCols = ['id', ...cols];
  const allVals = [id, ...vals];
  await env.DB.prepare(`INSERT INTO cars (${allCols.join(',')}) VALUES (${allCols.map(() => '?').join(',')})`).bind(...allVals).run();
  return { id, created: true };
}

export async function updateCar(env: Env, id: string, body: any) {
  const { cols, vals } = carFields(body);
  if (!cols.length) return { id, updated: 0 };
  const sets = cols.map((c) => `${c} = ?`).join(', ') + `, updated_at = datetime('now')`;
  vals.push(id);
  await env.DB.prepare(`UPDATE cars SET ${sets} WHERE id = ?`).bind(...vals).run();
  return { id, updated: cols.length };
}

export async function deleteCar(env: Env, id: string) {
  const photos = (await env.DB.prepare('SELECT url FROM car_photos WHERE car_id = ?').bind(id).all()).results as any[];
  await env.DB.prepare('DELETE FROM cars WHERE id = ?').bind(id).run(); // car_photos 由 ON DELETE CASCADE 一併刪
  for (const p of photos) await deleteR2(env, p.url);
  return { id, deleted: true };
}

// 後台：車輛照片（R2）
export async function addCarPhotoRow(env: Env, carId: string, url: string, caption?: string) {
  const r = await env.DB.prepare('SELECT COALESCE(MAX(sort_order),-1)+1 AS n FROM car_photos WHERE car_id = ?').bind(carId).first<any>();
  const sort = r?.n ?? 0;
  const res = await env.DB.prepare('INSERT INTO car_photos (car_id,url,caption,sort_order) VALUES (?,?,?,?)').bind(carId, url, caption ?? null, sort).run();
  return { id: res.meta.last_row_id, url, sort_order: sort };
}

export async function deleteCarPhoto(env: Env, carId: string, photoId: string) {
  const row = await env.DB.prepare('SELECT url FROM car_photos WHERE id = ? AND car_id = ?').bind(photoId, carId).first<any>();
  if (!row) return { ok: false };
  await env.DB.prepare('DELETE FROM car_photos WHERE id = ?').bind(photoId).run();
  await deleteR2(env, row.url);
  return { ok: true };
}

async function deleteR2(env: Env, url: any) {
  if (typeof url === 'string' && url.startsWith('/photos/')) {
    try { await env.PHOTOS.delete(url.replace(/^\/photos\//, '')); } catch (e) { /* R2 物件可能已不存在 */ }
  }
}
