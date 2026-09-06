// @ts-check
import { defineConfig } from 'astro/config';

// 公開官網：靜態輸出，部署到 Cloudflare Pages；由 cars.chengzhu.co 的 Worker 反向代理。
// 之後若需要 SSR（即時庫存），再加 @astrojs/cloudflare adapter 並把個別頁標 prerender=false。
export default defineConfig({
  site: 'https://cars.chengzhu.co',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
