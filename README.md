# 橙築 CARS ─ 車商批發專屬 LINE 官方帳號

橙築國際汽車（ORANGE BUILDING MOTOR）做日本／韓國進口車代辦，有實體門市。
本專案是**只給台灣當地車商的批發專屬 LINE 通路**：同一批進口車源，已驗證車商可看到
**批發底價**、可線上**下訂鎖車**，散客看不到批發價。

> 與既有那個「橙築國際汽車」散客 OA（圖文選單：現車在庫／車測中／船運中／報關中／預訂中／會員專區）
> 是**不同對象**：那個給車主追蹤自己的車，這個給車商批貨。

---

## 🌐 線上 Demo（已部署）

**https://chengzhu-cars.kuo-tinghow.workers.dev**　（手機可直接開）

- 入口 `/home.html`；右上「DEMO 視角」可切 **散客 / 申請中 / 車商**，看批發價 gating 差異。
- 後端：Cloudflare Workers + D1（APAC region），批發價由後端強制 gating。
- ⚠️ 目前 `DEV_MODE=1`（示意展示：role 可公開模擬、資料皆 demo）。**正式上線前**要：`DEV_MODE=0`、接真實 LIFF 身分、`ADMIN_TOKEN` 改 secret。

## 已拍板的方向（2026-06-21 討論結論）

| 決策 | 選擇 |
|---|---|
| OA 架構 | **獨立車商專屬 OA**（與散客 OA 物理隔離，推播名單乾淨、批發價零外洩風險） |
| 批發定價 | **固定批發底價**（每台車一個底價，車商在底價上自己加利潤賣終端；符合「同行調車寄賣＋鎖價」慣例） |
| 第一步 | **先做 GLC43 車源詳情頁 demo**（Encar 風格，確認呈現與體感）← 已完成 |

下訂金流：起步用「下訂登記 ＋ 線下匯款／虛擬帳號對帳」（批發金額大、買家是公司戶）。

---

## 核心架構：權限階梯

| 階層 | 看得到 | LINE 技術 | 後台要自建 |
|---|---|---|---|
| L0 未加好友 | OA 名片 | — | — |
| L1 加好友散客 | 一般資訊＋「申請成為車商」 | Default Rich Menu | — |
| L2 申請中 | 申請表、審核進度（仍看一般版） | LIFF 表單 | 收件＋審核佇列（statusid＋名片） |
| L3 已驗證車商 | **批發價、車源、下訂鎖車、我的訂單** | approve 後 `linkRichMenuToUser` 切車商選單；narrowcast 上傳名單精準推播 | 車商主檔＋審核＋（未來分級） |

**設計鐵則**：批發價**只在 LIFF 網頁**裡、由**後端驗證 LINE ID token 後**才吐給已驗證車商。
Flex 訊息／圖文選單一律不放批發價（送出即定型、會外洩）。

---

## 技術棧（沿用 chengzhu-platform，可直接搬）

- **Node.js + TypeScript + Hono on Cloudflare Workers + D1**
- 可重用：`chengzhu-platform` 的 LINE API client、Flex 卡片庫、Rich Menu 生成腳本、多租戶／會員結構
- 車商型錄／詳情／下訂：做成 **LIFF**（手機全螢幕網頁），參考 `golf-coach-bot` 的 LIFF 寫法
- 車輛狀態流水線：預訂中 → 船運中 → 報關中 → 車測中 → 現車在庫（每台車一個狀態）

---

## 目前進度

- [x] **資料模型** `db/migrations/0001_cars.sql` ─ cars / dealers / orders 三表（狀態、批發價、照片、審核、鎖車）
- [x] **真實庫存** ─ 10 台韓國實拍真車（GLC43/Coupe、GLC300 Coupe、GT63S、CLA45S、CLE450、E300，含真實底價/開價），鋪滿 5 種狀態；資料同步進 D1（`0003_seed_real.sql`）與 `cars.json`
- [x] **車源列表** `demo/list.html` ─ Encar 式卡片格 ＋ 狀態分頁篩選（讀 cars.json）
- [x] **車源詳情** `demo/detail.html` ─ 資料驅動，依狀態自動點亮流水線、無照片自動降級為示意佔位
- [x] `demo/glc43.html` ─ 最初的獨立版詳情頁（已被 detail.html 取代，保留參考）
- [x] **OA 首頁 ＋ 雙版圖文選單** `demo/home.html` ─ 散客版 / 車商版 Rich Menu，依身分切換
- [x] **車商申請流程** `demo/apply.html` ─ LIFF 申請表 → 審核中 → 模擬通過 → 解鎖
- [x] **批發價 gating ＋ 身分視角** `app.js` ─ 權限階梯（散客／申請中／車商）；列表與詳情依身分顯示或鎖價；右上「DEMO 視角」可即時切換全站
- [x] **後端 API（Hono on Workers + D1）＋ 批發價 gating** `src/` ─ 後端驗身分查 `dealers`，只對 verified 車商回傳批發價；前端已接（dev 模式可測）
- [ ] 下訂鎖車 ＋ 訂金對帳（接 orders 表）
- [ ] LINE 整合：webhook 歡迎訊息、approve 後 `linkRichMenuToUser` 切選單、分眾推播（需 LINE OA 憑證）
- [x] **部署到 Cloudflare** ─ 已上線 https://chengzhu-cars.kuo-tinghow.workers.dev （遠端 D1 + Workers）
- [ ] 正式硬化：`DEV_MODE=0`、LIFF 真實身分驗證、`ADMIN_TOKEN` 改 secret、掛自訂網域

## 本機預覽 demo

```
python -m http.server 8200 --directory demo
# 起點（OA 首頁）： http://localhost:8200/home.html
# 列表頁：           http://localhost:8200/list.html
# 詳情頁：           http://localhost:8200/detail.html?id=glc43-366009
# ＊右上「DEMO 視角」可切換 散客 / 申請中 / 車商，整站即時跟著變（鎖價、選單、CTA）
```

> 互動 demo 流程：home（散客版選單）→ 賞車看得到車況但批發價鎖 → 申請成為車商（apply）→ 模擬審核通過 → 全站批發價解鎖、切換車商版選單。

> demo 內的價格、里程、車況數字皆為**示意範例**，正式上線換成真實資料。

---

## 後端 API（Cloudflare Workers + D1）

**真正的批發價 gating 在後端**：前端送身分（dev 模式 `Authorization: Bearer dev:<role>`；正式為 LIFF access token），
後端 `src/auth.ts` 解析身分、查 `dealers` 表，**只對 `verified` 車商回傳批發價**（`src/cars.ts` 的 `mapCar` 在 `canSee=false` 時把價格設 null）。前端拿不到價就顯示鎖卡 — 前端永遠不可信。

| 檔案 | 角色 |
|---|---|
| `src/index.ts` | Hono 路由 |
| `src/auth.ts` | 身分解析（gating 核心；dev 模擬 + 正式 LINE token 驗證） |
| `src/cars.ts` | 車源查詢 + `mapCar`（gating 在這裡執行） |
| `src/dealers.ts` | 車商申請 / 審核 |
| `db/migrations/` | 0001 結構（cars/dealers/orders）、0002 種子（7 車＋GLC43 照片＋2 測試車商） |

### 本機執行
```
npm install
npx wrangler d1 migrations apply chengzhu-cars --local   # 建表 + 灌種子
npx wrangler dev                                         # → http://localhost:8787
```
開 `http://localhost:8787/home.html`；前端會自動改打 `/api/cars`（同源）。純靜態（python server）開啟時則自動回退 `data/cars.json`。

### 驗證 gating（後端強制）
```
curl http://localhost:8787/api/cars -H "Authorization: Bearer dev:guest"    # 批發價 = null
curl http://localhost:8787/api/cars -H "Authorization: Bearer dev:dealer"   # 批發價有值
```
API：`GET /api/cars`、`GET /api/cars/:id`、`GET /api/dealers/me`、`POST /api/dealers/apply`、`POST /api/admin/dealers/:id/approve`（需 `X-Admin-Token`）。

> DEV_MODE=1 才允許 `dev:<role>` 模擬，正式環境請在 wrangler.toml 設 0，改用真實 LIFF access token。

## 開發規範

遵循 `C:\GitHub-Claude\AGENT_RULES.md`：不刪檔、不用 `>` 覆寫、改既有檔前先備份 `.bak`、
重大變更先說明等使用者確認、不自動裝套件、操作限 `GitHub-Claude/` 範圍內。
