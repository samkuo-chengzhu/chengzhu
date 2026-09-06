// LIFF 入口路由：liff.line.me/<id>?p=<page> → 導到對應頁（用 query 比「LIFF 額外路徑」穩，不受 endpoint 設定影響）
(function () {
  try {
    const p = new URLSearchParams(location.search).get('p');
    const map = { 'admin-bind': '/app/admin-bind.html', apply: '/app/apply.html', list: '/app/list.html', home: '/app/home.html', detail: '/app/detail.html' };
    if (p && map[p] && !location.pathname.endsWith(map[p])) location.replace(map[p]);
  } catch (e) {}
})();

// 共用：狀態定義、格式化、資料載入
const STATUS = {
  reserved:   { label: '預訂中',   color: '#e0a13a' },
  shipping:   { label: '船運中',   color: '#4a90e2' },
  customs:    { label: '報關中',   color: '#a978e0' },
  inspection: { label: '車測中',   color: '#3fb6b0' },
  in_stock:   { label: '現車在庫', color: '#3fae6b' },
  sold:       { label: '已售出',   color: '#777777' },
};
const PIPELINE = ['reserved', 'shipping', 'customs', 'inspection', 'in_stock'];

const CAR_SVG = '<svg viewBox="0 0 640 512" fill="currentColor"><path d="M171.3 96H224v96H111.3l30.4-75.9C146.5 104 158.2 96 171.3 96zM272 192V96h81.2c9.7 0 18.9 4.4 25 12l67.2 84H272zm256.2 1L428.2 68c-18.2-22.8-45.8-36-75-36H171.3c-39.3 0-74.6 23.9-89.1 60.3L40.6 196.4C16.8 205.8 0 228.9 0 256V368c0 17.7 14.3 32 32 32H65.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H385.3c7.6 45.4 47.1 80 94.7 80s87.1-34.6 94.7-80H608c17.7 0 32-14.3 32-32V320c0-65.2-48.8-119-111.8-127zM160 320a48 48 0 110 96 48 48 0 010-96zm272 48a48 48 0 1196 0 48 48 0 01-96 0z"/></svg>';

function nt(n) { return (n == null) ? '—' : 'NT$ ' + Number(n).toLocaleString('en-US'); }
function km(n) { return (n == null) ? '里程未定' : '約 ' + Number(n).toLocaleString('en-US') + ' km'; }
function profitText(car) {
  if (car.suggestedRetail && car.wholesalePrice) {
    return '利潤 約 ' + Math.round((car.suggestedRetail - car.wholesalePrice) / 10000) + ' 萬';
  }
  return '';
}
// 照片網址正規化：相對路徑（assets/...）補成絕對（/assets/...），避免頁面在 /app/ 下被解析成 /app/assets/... 而 404
function imgURL(u) { return (u && !/^(https?:\/\/|\/)/.test(u)) ? '/' + u : u; }
function coverOf(car) {
  const u = (car.photos && car.photos.length) ? car.photos[0].url : car.cover_photo;
  return imgURL(u) || null;
}
// ── LIFF 整合 ───────────────────────────────
const LIFF_ID = '2010475696-IrFQfA6v';
const __liff = { ready: false, token: null, role: null };

// 進頁面前先跑：在 LINE 內 → 用真實身分；純瀏覽器 → 維持 dev 模擬（不強制登入）
async function bootstrap() {
  window.__DEV = true;                                // 預設 demo（純靜態 fallback 時保留切換器）
  try { const r = await fetch('/api/config'); if (r.ok) window.__DEV = !!(await r.json()).devMode; } catch (e) {}
  if (typeof liff === 'undefined') return;           // SDK 沒載入＝純靜態
  try {
    await liff.init({ liffId: LIFF_ID });
    if (liff.isInClient() || liff.isLoggedIn()) {     // 只有在 LINE 內才走真實身分
      if (!liff.isLoggedIn()) { liff.login(); await new Promise(() => {}); }
      __liff.ready = true;
      __liff.token = liff.getAccessToken();
      try {
        const r = await fetch('/api/dealers/me', { headers: { Authorization: 'Bearer ' + __liff.token } });
        if (r.ok) __liff.role = (await r.json()).role;
      } catch (e) {}
    }
  } catch (e) { console.warn('LIFF init 失敗，改用瀏覽器模式', e); }
}
function inLiff() { return __liff.ready && !!__liff.token; }

// 身分 header：LIFF 用真實 access token；純瀏覽器用 dev:<role> 模擬
function authHeaders() {
  return inLiff() ? { Authorization: 'Bearer ' + __liff.token } : { Authorization: 'Bearer dev:' + getRole() };
}

// 正式上線：一律走真後端 API，批發價 gating 全在後端。失敗時回空，絕不從前端洩任何資料。
async function loadCars() {
  try {
    const r = await fetch('/api/cars', { headers: authHeaders() });
    if (r.ok) return await r.json();
  } catch (e) {}
  return [];
}
async function loadCar(id) {
  try {
    const r = await fetch('/api/cars/' + encodeURIComponent(id), { headers: authHeaders() });
    if (r.ok) return await r.json();
  } catch (e) {}
  return null;
}

// 能否看到批發價：完全以「後端是否回傳價格」為準（後端才是真正的 gating）。
function canSeeWholesale(car) { return !!car && car.wholesalePrice != null; }

function getParam(k) { return new URLSearchParams(location.search).get(k); }

// ── 身分（權限階梯 L1 散客 / L2 申請中 / L3 已驗證車商）──
// 正式上線：LINE 內以後端驗證的真實身分為準；非 LINE 環境一律當散客（看不到批發價）。
function getRole() { return inLiff() ? (__liff.role || 'guest') : 'guest'; }
function isDealer() { return getRole() === 'dealer'; }
const ROLE_LABEL = { guest: '散客（未驗證）', pending: '車商審核中', dealer: '已驗證車商' };
function mountRoleSwitcher() {}  // 正式上線：不再顯示 DEMO 視角切換器

// 詢價：在 LINE 內送一則預填訊息給官方帳號（由專人接單）；非 LINE 環境則開啟 OA 聊天
const OA_CHAT_URL = 'https://line.me/R/ti/p/%40378svzat';
async function inquire(car) {
  const name = car ? `${car.modelYear} ${car.brand} ${car.model}` : '車源';
  const text = `我想詢價：${name}${car && car.id ? `（編號 ${car.id}）` : ''}`;
  try {
    if (inLiff() && typeof liff !== 'undefined' && liff.isApiAvailable && liff.isApiAvailable('sendMessages')) {
      await liff.sendMessages([{ type: 'text', text }]);
      if (liff.isInClient()) { liff.closeWindow(); return; }
      alert('已送出詢價訊息，請回到 LINE 對話查看回覆');
      return;
    }
  } catch (e) {}
  if (typeof liff !== 'undefined' && liff.openWindow) liff.openWindow({ url: OA_CHAT_URL, external: true });
  else location.href = OA_CHAT_URL;
}
window.inquire = inquire;

// 開啟外部文件（Carfax / 原廠解碼報告）：有合法網址才開
function openDoc(url) {
  if (!url) return;
  if (typeof liff !== 'undefined' && liff.openWindow) liff.openWindow({ url, external: true });
  else window.open(url, '_blank');
}
window.openDoc = openDoc;
