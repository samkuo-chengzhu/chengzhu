// 車源狀態定義（與 public/app/app.js 一致）
export const STATUS: Record<string, { label: string; color: string }> = {
  reserved: { label: '預訂中', color: '#e0a13a' },
  shipping: { label: '船運中', color: '#4a90e2' },
  customs: { label: '報關中', color: '#a978e0' },
  inspection: { label: '車測中', color: '#3fb6b0' },
  in_stock: { label: '現車在庫', color: '#3fae6b' },
  sold: { label: '已售出', color: '#777777' },
};

// 進度流水線（預訂中 → 船運 → 報關 → 車測 → 現車在庫）
export const PIPELINE = ['reserved', 'shipping', 'customs', 'inspection', 'in_stock'];

export const STATUS_RANK: Record<string, number> = {
  in_stock: 0,
  inspection: 1,
  customs: 2,
  shipping: 3,
  reserved: 4,
  sold: 5,
};
