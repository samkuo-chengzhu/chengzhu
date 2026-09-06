# 本機開發環境（給協作開發者）

這份給**在自己 fork 上開發**的人。整套流程**不需要 Cloudflare 帳號，也不需要任何正式密鑰** —
Worker、D1、R2 全部模擬在你自己電腦上跑。

> 正式部署由專案擁有者執行。協作者不需要、也不會有部署權限。
> 如果 wrangler 任何時候叫你登入 Cloudflare，代表指令下錯了（多半是少了 `--local`）── 不要登入，回來看這份文件。

---

## 一次性設定

### 1. Clone 你自己的 fork

```bash
git clone https://github.com/你的帳號/chengzhu-CARS.git
```

```bash
npm install
```

### 2. 建立 `.dev.vars`

```bash
cp .dev.vars.example .dev.vars
```

裡面已經是本機開發用的值，**不用改，也不用跟任何人要真值**：

| 變數 | 值 | 說明 |
|---|---|---|
| `DEV_MODE` | `1` | 開啟身分模擬（見下方） |
| `LINE_CHANNEL_ACCESS_TOKEN` | 空 | 本機用不到 |
| `LINE_CHANNEL_SECRET` | 空 | 本機用不到 |
| `LIFF_CHANNEL_ID` | 空 | 本機用不到 |
| `ADMIN_TOKEN` | `dev-admin` | 本機後台登入密碼 |

`.dev.vars` 在 `.gitignore` 裡，不會進版控。

### 3. 建立本機資料庫

```bash
npm run db:migrate:local
```

會在 `.wrangler/` 底下建一份本機 SQLite，套用 `db/migrations/` 的 schema。
跟正式的 D1 完全無關，怎麼弄壞都沒關係，刪掉 `.wrangler/` 重跑一次就好。

---

## 每天啟動

```bash
npm run dev
```

服務起在 `http://localhost:8787`。主要頁面：

| 頁面 | 網址 |
|---|---|
| LIFF 首頁 | http://localhost:8787/app/home.html |
| 車源列表 | http://localhost:8787/app/list.html |
| 車輛詳情 | http://localhost:8787/app/detail.html |
| 車商申請 | http://localhost:8787/app/apply.html |
| 後台・車源管理 | http://localhost:8787/app/admin-cars.html |
| 後台・會員管理 | http://localhost:8787/app/admin.html |
| 後台・訂單管理 | http://localhost:8787/app/admin-orders.html |

後台三頁用 `.dev.vars` 裡的 `ADMIN_TOKEN`（預設 `dev-admin`）登入。

---

## 模擬不同身分（改排版時最常用）

正式環境的身分來自 LINE 登入，本機靠 `DEV_MODE=1` 直接模擬。打 API 時帶這個 header：

```
Authorization: Bearer dev:<role>
```

| role | 對應身分 | 看得到批發價？ |
|---|---|---|
| `guest` | 未驗證訪客／散客 | 否 |
| `pending` | 車商申請審核中 | 否 |
| `dealer` | 已驗證車商 | 是 |

實際比較兩種身分拿到的資料：

```bash
curl -H "Authorization: Bearer dev:dealer" http://localhost:8787/api/cars
```

```bash
curl -H "Authorization: Bearer dev:guest" http://localhost:8787/api/cars
```

回傳欄位會不一樣。**批發價的 gating 完全在後端**（`src/auth.ts`），前端拿不到就是拿不到 ──
改前端時請不要想辦法繞過它，那是這個專案的核心規則。

---

## 公開官網（Astro）

`site/` 是對外官網，獨立的 Astro 專案，跟 Worker 分開跑：

```bash
cd site
```

```bash
npm install
```

```bash
npm run dev
```

預設在 `http://localhost:4321`。

---

## 已知狀況：車照不在 repo 裡

`public/assets/`（約 50MB 車輛照片）刻意不進版控，避免 git 歷史肥大。
clone 下來之後那個資料夾是空的，LIFF 和後台會**破圖** ── 這是正常的，不是你弄壞的。
需要樣本圖片跟專案擁有者要一份。

---

## 請不要做的事

- 不要把 `.dev.vars` commit 進去
- 不要跟任何人要正式的 `LINE_CHANNEL_ACCESS_TOKEN` / `LINE_CHANNEL_SECRET` / `ADMIN_TOKEN`，本機開發完全用不到
- 不要跑 `npm run db:migrate`（沒有 `:local` 的那支，會改到正式資料庫）
- 不要跑 `npx wrangler deploy` 或 `deploy_cars.cmd`
- 改好的東西開 PR 回上游 repo，不要直接推

---

## 專案背景

架構總覽、權限階梯、API 設計看 [README.md](README.md)。
