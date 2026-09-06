# 橙築國際 — 網站 monorepo

兩個獨立網站放在同一個 repo 統一維護，但**部署管道各自獨立**。

```
chengzhu/
├─ www/     chengzhu.co          主站（純靜態，Cloudflare Pages）
├─ cars/    cars.chengzhu.co     橙築國際汽車（Worker + D1 + R2 + Astro 官網）
└─ tools/   主站的字型子集腳本
```

---

## ⚠️ 部署前必讀

主站**沒有 build 步驟**，Cloudflare Pages 是把「輸出目錄整包」當網站發佈——
目錄內任何檔案都會變成 chengzhu.co 上可下載的網址。

因此 Pages 專案的 **build output directory 必須設為 `www`**（不是 `/`）。

若誤設回 `/`，`cars/db/migrations/*.sql`（內含真實批發底價）與 `cars/src/*`
（批發價 gating 邏輯）會直接對外公開。這與 repo 是否為 private 無關。

---

## www/ — 主站

無需建置。本機預覽：

```bash
python -m http.server 8899 --directory www
```

部署：推上 `main` 後由 Cloudflare Pages 自動建置（output directory = `www`）。

字型為自架 IBM Plex Sans TC 子集。**改過文案後需重跑**，否則新字會掉到後備字型：

```bash
python tools/subset-fonts.py
```

---

## cars/ — 橙築國際汽車

車商批發專屬通路。公開官網（Astro）＋ LIFF／後台（Worker 同源）＋
D1／R2 後端，批發價 gating 完全在後端。詳見 [cars/README.md](cars/README.md)。

```bash
cd cars
npm install && npm install --prefix site

npm run build --prefix site        # 公開官網
python tools/subset-fonts.py       # 字型子集（建置後再跑）

npx wrangler deploy                                    # Worker（API／LIFF／後台）
npx wrangler pages deploy site/dist \
  --project-name chengzhu-cars-site --branch main      # 公開官網
```

`cars/` 不在主站的發佈範圍內，兩邊部署互不影響。
