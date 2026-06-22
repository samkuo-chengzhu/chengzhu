// Cloudflare Workers 環境綁定
export interface Env {
  DB: D1Database;
  DEV_MODE: string;                    // '1' 允許 dev:<role> 模擬身分
  LIFF_CHANNEL_ID?: string;
  LINE_CHANNEL_ACCESS_TOKEN?: string;
  LINE_CHANNEL_SECRET?: string;
  ADMIN_TOKEN: string;
  SITE_URL?: string;
}

export type Role = 'guest' | 'pending' | 'dealer';

export interface Identity {
  role: Role;
  userId?: string;     // LINE userId（正式模式）
  dealerId?: string;
}
