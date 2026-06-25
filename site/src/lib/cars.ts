import { API_BASE } from '../consts';
import { STATUS_RANK } from './status';

export type CarPhoto = { url: string; caption?: string | null };

// 對齊後端 mapCar（src/cars.ts）的輸出。訪客視角時 wholesalePrice / suggestedRetail 一律為 null。
export type Car = {
  id: string;
  status: string;
  brand: string;
  model: string;
  modelYear: number;
  regionSpec?: string | null;
  mileageKm?: number | null;
  fuel?: string | null;
  displacementCc?: number | null;
  drivetrain?: string | null;
  transmission?: string | null;
  engine?: string | null;
  tires?: string | null;
  horsepower?: number | null;
  exteriorColor?: string | null;
  interiorColor?: string | null;
  vinDisplay?: string | null;
  productionDate?: string | null;
  wholesalePrice?: number | null;
  suggestedRetail?: number | null;
  lockDays?: number | null;
  depositPct?: number | null;
  etaWeeksMin?: number | null;
  etaWeeksMax?: number | null;
  accidentFree?: boolean;
  highlights?: string[];
  spec?: Record<string, string>;
  carfaxUrl?: string | null;
  decodeUrl?: string | null;
  photos?: CarPhoto[];
  placeholder?: boolean;
};

// build 時抓公開型錄（訪客視角，後端不回傳批發價）。
// 抓不到 / 離線時一律回空陣列，build 不中斷。
export async function getCars(): Promise<Car[]> {
  try {
    const res = await fetch(`${API_BASE}/api/cars`);
    if (!res.ok) return [];
    const data = await res.json();
    const list: Car[] = Array.isArray(data) ? data : [];
    return list
      .filter((c) => c.status !== 'sold')
      .sort((a, b) => (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9));
  } catch {
    return [];
  }
}

export async function getCar(id: string): Promise<Car | null> {
  const cars = await getCars();
  return cars.find((c) => c.id === id) ?? null;
}

// 後端回傳 /photos/... 相對路徑 → 補成絕對網址，確保本機 dev / pages.dev / 正式代理皆可載入。
export function imgUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return API_BASE + (url.startsWith('/') ? url : '/' + url);
}

export function cover(car: Car): string | null {
  return car.photos && car.photos.length ? imgUrl(car.photos[0].url) : null;
}

export function km(n?: number | null): string {
  return n == null ? '里程未定' : '約 ' + Number(n).toLocaleString('en-US') + ' km';
}

export function carTitle(car: Car): string {
  return `${car.modelYear} ${car.brand} ${car.model}`.trim();
}
