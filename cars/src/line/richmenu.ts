import type { Env } from '../types';
import { lineClient } from './client';

// 在 LINE 內開頁面的 LIFF 連結（?status= / ?goto= 走 app.js + / handler 的路由）
function liff(env: Env, q: string) {
  return env.LIFF_CHANNEL_ID ? `https://liff.line.me/${env.LIFF_CHANNEL_ID}?${q}` : `${env.SITE_URL || 'https://cars.chengzhu.co'}/?${q}`;
}

// 重建圖文選單：用 public/assets/richmenu-line-v2.png（新順序）+ 6 格連結，並設為預設、清掉舊的
export async function rebuildRichMenu(env: Env) {
  if (!env.LINE_CHANNEL_ACCESS_TOKEN) return { error: 'no_line_token' };
  const client = lineClient(env.LINE_CHANNEL_ACCESS_TOKEN);
  // 圖文選單底圖放 R2（Worker 不能 fetch 自己的公開網址 —— 會被反代 catch-all 攔成 404；改從 R2 直接讀）
  const imgObj = await env.PHOTOS.get('richmenu-line-v2.png');
  if (!imgObj) return { error: 'image_not_found' };
  const img = await imgObj.arrayBuffer();

  const W = 2500, H = 1686;
  const cols = [0, 833, 1666, 2500];
  const rowTop = 360, rowH = 620; // 兩排（row0: 360–980、row1: 980–1600）
  const cell = (ci: number, ri: number, q: string) => ({
    bounds: { x: cols[ci], y: rowTop + ri * rowH, width: cols[ci + 1] - cols[ci], height: rowH },
    action: { type: 'uri', uri: liff(env, q) },
  });

  const menu = {
    size: { width: W, height: H },
    selected: true,
    name: '橙築車商批發選單 v2',
    chatBarText: '車源選單',
    areas: [
      cell(0, 0, 'status=in_stock'),    // 現車在庫
      cell(1, 0, 'status=inspection'),  // 車測中
      cell(2, 0, 'status=customs'),     // 報關中
      cell(0, 1, 'status=shipping'),    // 船運中
      cell(1, 1, 'status=reserved'),    // 預訂中
      cell(2, 1, 'goto=apply'),         // 會員專區
    ],
  };

  const createRes = await client.createRichMenu(menu);
  const created = (await createRes.json().catch(() => ({}))) as any;
  const id = created.richMenuId;
  if (!id) return { error: 'create_failed', detail: created };

  const upRes = await client.uploadRichMenuImage(id, img, 'image/png');
  if (!upRes.ok) return { error: 'upload_failed', detail: await upRes.text().catch(() => '') };

  await client.setDefaultRichMenu(id);

  // 清掉其餘舊選單（只留剛建立的）
  try {
    const list = (await (await client.listRichMenus()).json().catch(() => ({}))) as any;
    for (const rm of (list.richmenus || [])) {
      if (rm.richMenuId !== id) { try { await client.deleteRichMenu(rm.richMenuId); } catch (e) {} }
    }
  } catch (e) {}

  return { ok: true, richMenuId: id };
}
