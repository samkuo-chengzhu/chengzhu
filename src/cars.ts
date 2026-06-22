import type { Env } from './types';

// D1 raw row → 前端用的車輛物件（欄位對齊 demo/data/cars.json）。
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
