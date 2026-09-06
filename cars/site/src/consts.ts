// 全站共用常數。LINE OA 深連結沿用 public/app/app.js 的 OA_CHAT_URL。
export const SITE = {
  name: '橙築國際汽車',
  nameEn: 'ORANGE BUILDING MOTOR',
  tagline: '日本・韓國進口車・車商專屬批發',
  domain: 'https://cars.chengzhu.co',
};

// 加入官方帳號 / 進 LINE 對話（公開官網的主要轉換點）
export const LINE_OA_URL = 'https://line.me/R/ti/p/%40378svzat';

// 公開型錄資料來源（訪客視角，後端不回傳批發價）
export const API_BASE = 'https://cars.chengzhu.co';

export const NAV_LINKS = [
  { href: '/', label: '首頁' },
  { href: '/cars', label: '批發車源' },
  { href: '/about', label: '關於橙築' },
  { href: '/dealer', label: '成為車商' },
];
