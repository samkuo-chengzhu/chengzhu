-- 0001_cars.sql ─ 橙築車商批發 資料模型 (Cloudflare D1 / SQLite)
-- 三個核心物件：cars（車源）、dealers（車商會員，審核制）、orders（下訂/鎖車）
-- 批發價（wholesale_price）只由後端在「驗證車商身分後」回傳，前端 LIFF 不直接信任。

-- ─────────────────────────────────────────────
-- 車源
-- ─────────────────────────────────────────────
CREATE TABLE cars (
  id               TEXT PRIMARY KEY,              -- slug，例：'glc43-366009'
  status           TEXT NOT NULL DEFAULT 'reserved'
                   CHECK (status IN ('reserved','shipping','customs','inspection','in_stock','sold')),
                   -- 預訂中 / 船運中 / 報關中 / 車測中 / 現車在庫 / 已售出

  brand            TEXT NOT NULL,                 -- Mercedes-AMG
  model            TEXT NOT NULL,                 -- GLC 43 4MATIC+ Coupé
  model_year       INTEGER NOT NULL,             -- 2025
  region_spec      TEXT,                          -- 韓規 / 日規
  mileage_km       INTEGER,                       -- 可為 NULL（新古車未定）
  fuel             TEXT,                          -- 汽油 / 油電 / 柴油 / 電動
  displacement_cc  INTEGER,
  drivetrain       TEXT,                          -- 4MATIC / RWD / quattro
  transmission     TEXT,                          -- 9G 自手排
  engine           TEXT,                          -- 引擎簡述，例：M139 2.0T + 48V
  tires            TEXT,                          -- 輪胎規格，例：前265/後295 R21
  horsepower       INTEGER,
  exterior_color   TEXT,
  interior_color   TEXT,
  vin              TEXT,                          -- 完整 VIN（顯示時前端遮罩）
  production_date  TEXT,                          -- ISO date

  -- 批發（受保護欄位：API 僅對 verified 車商回傳）
  wholesale_price  INTEGER,                       -- 批發底價 TWD
  suggested_retail INTEGER,                       -- 建議零售 TWD（算利潤空間用）
  lock_days        INTEGER NOT NULL DEFAULT 3,    -- 下訂鎖車天數
  deposit_pct      INTEGER NOT NULL DEFAULT 30,   -- 訂金 %
  eta_weeks_min    INTEGER,                       -- 預計到港（週）
  eta_weeks_max    INTEGER,

  accident_free    INTEGER NOT NULL DEFAULT 1,    -- 0/1 無重大事故
  highlights       TEXT,                          -- JSON 陣列：配備亮點
  spec             TEXT,                          -- JSON 物件：規格表 label->value
  carfax_url       TEXT,
  decode_url       TEXT,                          -- outvin 全配備解碼
  cover_photo      TEXT,                          -- 主圖（亦可取 car_photos sort=0）

  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_brand  ON cars(brand);

CREATE TABLE car_photos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  car_id     TEXT NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  caption    TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_photos_car ON car_photos(car_id, sort_order);

-- ─────────────────────────────────────────────
-- 車商會員（審核制 ─ 權限階梯 L2 pending → L3 verified）
-- ─────────────────────────────────────────────
CREATE TABLE dealers (
  id            TEXT PRIMARY KEY,
  line_user_id  TEXT UNIQUE,                      -- 綁定的 LINE userId（後端驗 ID token 後寫入）
  company_name  TEXT,
  tax_id        TEXT,                             -- 統一編號
  contact_name  TEXT,
  phone         TEXT,
  business_card TEXT,                             -- 名片/營登照片 URL
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','verified','suspended')),
  tier          TEXT NOT NULL DEFAULT 'standard', -- 預留分級（未來可給不同折讓）
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  verified_at   TEXT
);
CREATE INDEX idx_dealers_status ON dealers(status);

-- ─────────────────────────────────────────────
-- 下訂 / 鎖車
-- ─────────────────────────────────────────────
CREATE TABLE orders (
  id           TEXT PRIMARY KEY,
  car_id       TEXT NOT NULL REFERENCES cars(id),
  dealer_id    TEXT NOT NULL REFERENCES dealers(id),
  status       TEXT NOT NULL DEFAULT 'locked'
               CHECK (status IN ('locked','deposit_paid','confirmed','cancelled','completed')),
               -- 鎖車中 / 已付訂金 / 已確認 / 取消 / 完成交車
  locked_until TEXT,                              -- 鎖車到期 = now + cars.lock_days
  deposit_twd  INTEGER,
  note         TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_orders_car    ON orders(car_id);
CREATE INDEX idx_orders_dealer ON orders(dealer_id);
-- 同一台車同時只應有一筆有效鎖車（locked/deposit_paid/confirmed）：於應用層保證或加部分唯一索引。
