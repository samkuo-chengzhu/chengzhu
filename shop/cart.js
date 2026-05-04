// 橙築選物 — 購物車狀態管理 (localStorage)
// 跨頁面共用,任一頁修改後其他頁開啟時自動讀新狀態

const CART_KEY = 'chengzhu_shop_cart_v1';
const ORDER_KEY = 'chengzhu_shop_last_order_v1';

window.cartStore = {
  get() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },
  save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('cart:change'));
  },
  add(productId, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === productId);
    if (existing) existing.qty += qty;
    else items.push({ id: productId, qty });
    this.save(items);
  },
  remove(productId) {
    this.save(this.get().filter(i => i.id !== productId));
  },
  setQty(productId, qty) {
    const items = this.get();
    const item = items.find(i => i.id === productId);
    if (!item) return;
    if (qty <= 0) this.remove(productId);
    else { item.qty = qty; this.save(items); }
  },
  clear() {
    this.save([]);
  },
  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },
  // 帶入完整商品資料的購物車項目
  itemsWithProduct() {
    return this.get().map(i => {
      const p = window.findProduct ? window.findProduct(i.id) : null;
      return p ? { ...p, qty: i.qty } : null;
    }).filter(Boolean);
  },
  subtotal() {
    return this.itemsWithProduct().reduce((s, i) => s + (i.price * i.qty), 0);
  },
};

// 訂單暫存(從 checkout → success 傳遞用)
window.orderStore = {
  save(order) {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  },
  get() {
    try {
      const raw = localStorage.getItem(ORDER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  clear() {
    localStorage.removeItem(ORDER_KEY);
  },
};

// 共用:更新所有 .js-cart-count 元素
function syncCartBadges() {
  const n = window.cartStore.count();
  document.querySelectorAll('.js-cart-count').forEach(el => {
    el.textContent = n;
  });
}

// Toast 共用組件
window.showToast = function(msg) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    toast.innerHTML = '<div class="check">✓</div><span></span>';
    document.body.appendChild(toast);
  }
  toast.querySelector('span').textContent = msg;
  toast.classList.add('show');
  clearTimeout(window.showToast._t);
  window.showToast._t = setTimeout(() => toast.classList.remove('show'), 2000);
};

window.addEventListener('cart:change', syncCartBadges);
window.addEventListener('storage', e => {
  if (e.key === CART_KEY) syncCartBadges();
});
document.addEventListener('DOMContentLoaded', syncCartBadges);
