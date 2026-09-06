# 橙築 CARS ─ 進口車商批發專屬通路

橙築國際汽車（ORANGE BUILDING MOTOR）經營日本／韓國原裝進口車代辦，有實體門市。
本專案是**給台灣當地車商的批發專屬通路**：公開官網對外展示車源與品牌，**已驗證車商**可在
LINE 內看到**批發底價**、線上**下訂鎖車**；散客／訪客看不到批發價。

> 與既有的散客 OA（車主追蹤自己進口車的進度）是**不同對象**：這套是給**車商批貨**用。

---

## 正式站與重要連結

| 用途 | 網址 |
|---|---|
| 公開官網（對外唯一網域） | `https://cars.chengzhu.co` |
| 後台・車源管理 | `https://cars.chengzhu.co/app/admin-cars` |
| 後台・會員管理 | `https://cars.chengzhu.co/app/admin` |
| 後台・訂單管理 | `https://cars.chengzhu.co/app/admin-orders` |
| LINE 官方帳號 | `https://line.me/R/ti/p/%40378svzat` （`@378svzat`） |
| 管理員通知綁定（手機 LINE 開） | `https://liff.line.me/2010475696-IrFQfA6v?p=admin-bind` |

- 後台三頁共用一組 `ADMIN_TOKEN` 密碼登入、彼此 nav 互連。
- 舊網址 `/admin*.html`（無 `/app/`）會自動 301 導到新路徑，舊書籤仍可用。
- 自訂網域已綁定、SSL 生效；舊的 `*.workers.dev` 已停用，對外一律用 `cars.chengzhu.co`。

---

## 架構總覽

單一網域 `cars.chengzhu.co`，由 **Hono Worker 當唯一入口**：

```
                        ┌──────────────────────── cars.chengzhu.co  (Worker, src/)
 瀏覽器 / LINE  ─────▶  │  /api/*    後端 API（D1 + R2，批發價 gating）
                        │  /app/*    LIFF 前台 ＋ 後台（public/app/ 靜態頁）
                        │  /assets/* 車輛照片等靜態資源（public/assets/）
                        │  /photos/* R2 車輛照片
                        │  /line/*   LINE webhook
                        │  其餘 (/、/cars、/about、/dealer …)
                        │           → 反向代理到 Astro 公開官網（Cloudflare Pages）
                        └────────────────────────
```

- **公開官網**：Astro 靜態站（`site/`），部署到 Cloudflare Pages（`chengzhu-cars-site.pages.dev`），由 Worker 反代。桌機／手機 RWD、可被搜尋。
- **LIFF ＋ 後台**：`public/app/` 靜態 HTML，由 Worker 的 `[assets]` 同源提供（前端打 `/api/*` 無 CORS）。
- **後端**：Hono on Cloudflare Workers ＋ **D1**（資料）＋ **R2**（照片）。
- **批發價 gating 完全在後端**：同一支 `/api/cars` 同時服務「瀏覽器訪客（無批發價）」與「LINE 內已驗證車商（有批發價）」。

---

## 權限階梯（批發價 gating）

| 階層 | 看得到 | LINE 技術 |
|---|---|---|
| L0 未加好友 | 公開官網、OA 名片 | — |
| L1 加好友散客 | 一般資訊 ＋「申請成為車商」 | 預設 Rich Menu |
| L2 申請中 | 申請表、審核進度（仍看一般版） | LIFF 表單 |
| L3 已驗證車商 | **批發價、車源、下訂鎖車** | approve 後切車商選單；分眾推播 |

**設計鐵則**：批發價**只在後端驗證身分後**才回傳給已驗證車商；前端永遠不可信。
Flex 訊息／圖文選單一律不放批發價（送出即定型、會外洩）。

---

## 專案結構

```
chengzhu-CARS/
├─ src/                 Worker（Hono）─ API、gating、反向代理、LINE
│  ├─ index.ts          路由總表 ＋ /app・/api・/photos・/line ＋ 反代 Astro
│  ├─ auth.ts           身分解析（resolveIdentity；gating 核心）
│  ├─ cars.ts           車源查詢 ＋ 批發價 gating
│  ├─ dealers.ts        車商申請 / 審核
│  ├─ orders.ts         下訂鎖車 / 訂單狀態
│  └─ line/             webhook、簽章、client、richmenu
├─ public/              Worker 同源提供的靜態資源（原 demo/，2026-06 更名）
│  ├─ app/              LIFF 前台（home/list/detail/apply）＋ 後台（admin*）＋ app.css / app.js
│  └─ assets/           車輛實拍照片、Rich Menu 底圖
├─ site/                公開官網（Astro，部署 Cloudflare Pages）
│  └─ src/pages/        index / cars / cars/[id] / about / dealer
├─ db/migrations/       D1 結構 ＋ 種子資料
└─ wrangler.toml        Worker 設定（[assets] directory = "./public"）
```

---

## 主要頁面

**公開官網（Astro，對外）**
- `/` 首頁 · `/cars` 批發車源 · `/cars/<id>` 車輛詳情 · `/about` 關於橙築 · `/dealer` 成為車商

**LINE 內（LIFF，車商專用）**
- 一律用 `https://liff.line.me/2010475696-IrFQfA6v?p=<page>`（page = `list` / `home` / `detail` / `apply` / `admin-bind`）

**後台（密碼保護）**
- `/app/admin-cars` 車源管理（新增 / 編輯、上傳照片、上下架）
- `/app/admin` 會員管理（審核車商、分級、匯出名單）
- `/app/admin-orders` 訂單管理（推進：鎖車中 → 已確認 → 已收訂金 → 已交車）
- 三頁皆「**點整張卡片 → 跳資訊視窗 → 在視窗內操作**」。

車輛狀態流水線：**預訂中 → 船運中 → 報關中 → 車測中 → 現車在庫**（＋已售出）。

---

## 技術棧

- **Node.js ＋ TypeScript ＋ Hono on Cloudflare Workers**
- **D1**（SQLite，資料）、**R2**（車輛照片）
- 公開官網：**Astro**（`output: 'static'`）on Cloudflare Pages
- 品牌：深色奢華＋金，系統 TC 字型堆疊（不載 web font，與 LIFF 一致）

## 已拍板方向

| 決策 | 選擇 |
|---|---|
| OA 架構 | 獨立車商專屬 OA（與散客 OA 物理隔離，推播名單乾淨、批發價零外洩） |
| 批發定價 | 固定批發底價（每台一個底價，車商在底價上自加利潤賣終端） |
| 官網 / LIFF | 拆開：Astro 真官網（可搜尋、桌機體驗）＋ LIFF 收進 `/app/*`（LINE 內車商專用） |

下訂金流：起步用「下訂登記 ＋ 線下匯款／虛擬帳號對帳」（批發金額大、買家是公司戶）。

---

## 後端 API（重點）

| 端點 | 說明 |
|---|---|
| `GET /api/cars`、`GET /api/cars/:id` | 車源（**批發價 gating**：非車商回傳 null） |
| `GET /api/dealers/me` | 目前身分 |
| `POST /api/dealers/apply`、`/api/dealers/upload-card` | 車商申請 ＋ 名片上傳 |
| `POST /api/orders/lock` | 下訂鎖車（限已驗證車商） |
| `/api/admin/dealers…`、`/api/admin/cars…`、`/api/admin/orders…` | 後台（需 `X-Admin-Token`） |
| `POST /api/admin/richmenu/rebuild` | 重建 LINE 圖文選單 |
| `POST /line/webhook`、`GET /photos/*` | LINE webhook、R2 照片 |

身分驗證在 `src/auth.ts`：正式環境用 **LIFF access token**；`DEV_MODE=0`（正式）只認真實身分。
本機測試可暫時設 `DEV_MODE=1`，用 `Authorization: Bearer dev:<role>` 模擬。

---

## 本機開發

```bash
# 1) 公開官網（Astro）
npm install --prefix site
npm run dev --prefix site          # → http://localhost:4321

# 2) 後端 ＋ LIFF/後台（Worker，含本機 D1 與 public/ 靜態頁）
npm install
npx wrangler d1 migrations apply chengzhu-cars --local   # 建表 ＋ 種子
npx wrangler dev                                         # → http://localhost:8787 （/app/home.html …）

# 3) 純靜態預覽 LIFF/後台（不含 API）
python -m http.server 8200 --directory public            # → http://localhost:8200/app/home.html
```

驗證 gating（需本機 `DEV_MODE=1`）：

```bash
curl http://localhost:8787/api/cars -H "Authorization: Bearer dev:guest"    # 批發價 = null
curl http://localhost:8787/api/cars -H "Authorization: Bearer dev:dealer"   # 批發價有值
```

---

## 部署

```bash
# Worker（API ＋ LIFF/後台 ＋ 反代）
npx wrangler deploy                # 或執行 deploy_cars.cmd（含遠端 D1 migration）

# 公開官網（Astro → Cloudflare Pages）
npm run build --prefix site
npx wrangler pages deploy site/dist --project-name chengzhu-cars-site --branch main

# D1 schema 更新（遠端）
npx wrangler d1 migrations apply chengzhu-cars --remote
```

機密用 secret 設定（**勿**寫進 `wrangler.toml`）：

```bash
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put LINE_CHANNEL_ACCESS_TOKEN
npx wrangler secret put LINE_CHANNEL_SECRET
```

部署後對外一律驗證 `https://cars.chengzhu.co`（非 `*.workers.dev`，已停用）。

---

## 開發規範

遵循 `C:\GitHub-Claude\AGENT_RULES.md`：重大變更先說明、不自動裝套件、操作限 `GitHub-Claude/` 範圍內。
公開站資料一律走訪客視角、**絕不在前端洩批發價**（gating 只信後端）。
