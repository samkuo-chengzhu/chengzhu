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
function coverOf(car) {
  if (car.photos && car.photos.length) return car.photos[0].url;
  return car.cover_photo || null;
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

// 優先打真後端 API；後端不在（純靜態開啟）時回退本地 cars.json
async function loadCars() {
  try {
    const r = await fetch('/api/cars', { headers: authHeaders() });
    if (r.ok) { window.__API = true; return await r.json(); }
  } catch (e) {}
  window.__API = false;
  return (await fetch('data/cars.json')).json();
}
async function loadCar(id) {
  try {
    const r = await fetch('/api/cars/' + encodeURIComponent(id), { headers: authHeaders() });
    if (r.ok) { window.__API = true; return await r.json(); }
  } catch (e) {}
  window.__API = false;
  const all = await (await fetch('data/cars.json')).json();
  return all.find(c => c.id === id) || all[0];
}

// 能否看到批發價：API 模式以「後端是否回傳價格」為準（後端才是真正 gating）；
// 純靜態 fallback 模式則用前端身分模擬。
function canSeeWholesale(car) { return window.__API ? (!!car && car.wholesalePrice != null) : isDealer(); }

function getParam(k) { return new URLSearchParams(location.search).get(k); }

// ── DEMO 身分（權限階梯 L1 散客 / L2 申請中 / L3 已驗證車商）──
function getRole() {
  if (inLiff()) return __liff.role || 'guest';   // LINE 內：用後端驗證的真實身分
  try { return localStorage.getItem('cz_role') || 'guest'; } catch (e) { return 'guest'; }
}
function setRole(r) { try { localStorage.setItem('cz_role', r); } catch (e) {} location.reload(); }
function isDealer() { return getRole() === 'dealer'; }
const ROLE_LABEL = { guest: '散客（未驗證）', pending: '車商審核中', dealer: '已驗證車商' };
function roleSwitcherHTML() {
  const r = getRole();
  const b = (k, t) => `<button class="rs-btn${r === k ? ' on' : ''}" onclick="setRole('${k}')">${t}</button>`;
  return `<div class="role-sw"><span class="rs-lab">👁 DEMO 視角</span>${b('guest', '散客')}${b('pending', '申請中')}${b('dealer', '車商')}</div>`;
}
function mountRoleSwitcher() { const el = document.getElementById('rsw'); if (el) el.innerHTML = (inLiff() || !window.__DEV) ? '' : roleSwitcherHTML(); }
