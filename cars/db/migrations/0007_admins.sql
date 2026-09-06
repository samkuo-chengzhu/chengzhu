-- 0003_admins.sql ─ 管理員 LINE 通知名單
-- 車商用 LINE 傳「綁定通知 <後台密碼>」即把自己的 userId 寫入；新車商申請時推播給名單內所有人
CREATE TABLE IF NOT EXISTS admins (
  line_user_id TEXT PRIMARY KEY,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
