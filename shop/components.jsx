// 共用元件: Header, ProductCard, Badge, Rating, etc.

const { useState, useEffect, useRef, useMemo } = React;

// ===== Icons (inline SVG for crispness) =====
const Icon = {
  Search: (p) => <svg {...p} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  Cart: (p) => <svg {...p} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>,
  Heart: (p) => <svg {...p} width="20" height="20" viewBox="0 0 24 24" fill={p.filled?"currentColor":"none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  User: (p) => <svg {...p} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Menu: (p) => <svg {...p} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  ChevR: (p) => <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevL: (p) => <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Check: (p) => <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus: (p) => <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: (p) => <svg {...p} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Star: ({filled, ...p}) => <svg {...p} width="14" height="14" viewBox="0 0 24 24" fill={filled?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Truck: (p) => <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Shield: (p) => <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Tag: (p) => <svg {...p} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Line: (p) => <svg {...p} width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 5.7 2 10.2c0 4 3.6 7.4 8.4 8.1.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c-.1.3-.3 1.2 1.1.7 1.4-.6 7.6-4.5 10.4-7.7C24.4 12 24 10.4 24 10.2 24 5.7 19.5 2 12 2z"/></svg>,
};

// ===== Star Rating =====
const Stars = ({ value, size = 14 }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span style={{ display: "inline-flex", gap: 1, color: "#FFB547", alignItems: "center" }}>
      {[0,1,2,3,4].map(i => (
        <Icon.Star key={i} filled={i < full || (i === full && half)} width={size} height={size} />
      ))}
    </span>
  );
};

// ===== Price =====
const Price = ({ value, orig, size = "md" }) => {
  const sizes = { sm: 14, md: 18, lg: 26, xl: 36 };
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ color: "var(--cz-orange-dark)", fontWeight: 800, fontSize: sizes[size], letterSpacing: "-0.02em" }}>
        <span style={{ fontSize: "0.65em", marginRight: 1 }}>NT$</span>
        {value.toLocaleString()}
      </span>
      {orig && (
        <span style={{ color: "var(--ink-400)", textDecoration: "line-through", fontSize: sizes[size] * 0.6 }}>
          ${orig.toLocaleString()}
        </span>
      )}
    </span>
  );
};

// ===== Product Card =====
const ProductCard = ({ product, onAdd, onClick, compact }) => {
  const [hover, setHover] = useState(false);
  const discount = product.origPrice ? Math.round((1 - product.price / product.origPrice) * 100) : null;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        background: "white",
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hover ? "var(--sh-2)" : "var(--sh-1)",
        transform: hover ? "translateY(-3px)" : "translateY(0)",
        transition: "all .25s cubic-bezier(.4,0,.2,1)",
        position: "relative",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ transform: hover ? "scale(1.06)" : "scale(1)", transition: "transform .35s ease" }}>
          <ProductImage product={product} />
        </div>
        {/* Top-left badges */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {discount && (
            <span style={{
              background: "var(--red-hot)", color: "white", fontSize: 11, fontWeight: 800,
              padding: "3px 8px", borderRadius: 4, letterSpacing: "0.02em",
            }}>-{discount}%</span>
          )}
          {product.badge && (
            <span style={{
              background: product.badge === "新品" ? "var(--green-ok)" : "var(--cz-orange)",
              color: "white", fontSize: 11, fontWeight: 700,
              padding: "3px 8px", borderRadius: 4,
            }}>{product.badge}</span>
          )}
        </div>
        {/* LINE-able indicator */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "white", borderRadius: "var(--r-pill)",
          padding: "4px 8px 4px 6px", display: "flex", alignItems: "center", gap: 4,
          fontSize: 10, fontWeight: 700, color: "var(--line-green-dark)",
          boxShadow: "var(--sh-1)",
        }}>
          <Icon.Line style={{ width: 12, height: 12 }} />
          可在 LINE 購買
        </div>
        {/* Quick add (hover) */}
        <button
          onClick={(e) => { e.stopPropagation(); onAdd && onAdd(product); }}
          style={{
            position: "absolute", bottom: 10, right: 10,
            background: "var(--cz-orange)", color: "white",
            width: 36, height: 36, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hover ? 1 : 0, transform: hover ? "translateY(0)" : "translateY(8px)",
            transition: "all .2s ease", boxShadow: "var(--sh-orange)",
          }}
        >
          <Icon.Plus />
        </button>
      </div>
      <div style={{ padding: "var(--card-pad)" }}>
        <div style={{ fontSize: 11, color: "var(--ink-400)", marginBottom: 4, fontWeight: 600 }}>{product.cat}</div>
        <div style={{
          fontSize: 14, fontWeight: 600, color: "var(--ink-900)",
          marginBottom: 8, lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          minHeight: "2.8em",
        }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-500)", marginBottom: 8 }}>
          <Stars value={product.rating} size={11} />
          <span style={{ color: "var(--ink-700)", fontWeight: 600 }}>{product.rating}</span>
          <span>·</span>
          <span>已售 {product.sold > 999 ? `${(product.sold/1000).toFixed(1)}k` : product.sold}</span>
        </div>
        <Price value={product.price} orig={product.origPrice} size="md" />
      </div>
    </div>
  );
};

// ===== Header =====
const Header = ({ cartCount, onNav, current }) => {
  const navs = [
    { key: "home", label: "首頁" },
    { key: "shop", label: "全部商品" },
    { key: "appliance", label: "KINYO 家電" },
    { key: "lifestyle", label: "生活選物" },
    { key: "home_cat", label: "居家用品" },
  ];
  return (
    <>
      {/* Top notice */}
      <div style={{
        background: "var(--ink-900)", color: "white",
        padding: "8px 24px", fontSize: 12, fontWeight: 500,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{
            background: "var(--cz-orange)", color: "white",
            padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 800, letterSpacing: "0.05em",
          }}>DEMO</span>
          <span>橙築 LINE 整合電商示範站 · 結帳不會實際扣款</span>
        </div>
        <div style={{ display: "flex", gap: 16, opacity: 0.85 }}>
          <span>客服中心</span>
          <span>訂單查詢</span>
          <span>會員登入</span>
          <span>加入會員</span>
        </div>
      </div>
      <header style={{
        background: "white",
        borderBottom: "1px solid var(--ink-200)",
        padding: "16px 24px",
        position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(8px)",
        background: "rgba(255,255,255,0.92)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32, maxWidth: 1400, margin: "0 auto" }}>
          <div onClick={() => onNav("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, var(--cz-orange), var(--cz-amber))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: 18,
              boxShadow: "var(--sh-orange)",
            }}>橙</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1 }}>橙築選物</div>
              <div style={{ fontSize: 9, color: "var(--ink-400)", letterSpacing: "0.15em", marginTop: 2 }}>CHENGZHU SHOP</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 4, flex: 1 }}>
            {navs.map(n => (
              <button key={n.key} onClick={() => onNav(n.key)} style={{
                padding: "8px 14px", borderRadius: "var(--r-pill)",
                fontSize: 14, fontWeight: 600,
                color: current === n.key ? "var(--cz-orange-dark)" : "var(--ink-700)",
                background: current === n.key ? "var(--cz-orange-light)" : "transparent",
                transition: "all .15s",
              }}>{n.label}</button>
            ))}
          </nav>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--ink-100)", padding: "8px 14px",
            borderRadius: "var(--r-pill)", width: 280,
            color: "var(--ink-400)",
          }}>
            <Icon.Search />
            <span style={{ fontSize: 13 }}>搜尋商品...</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button title="LINE 加好友" style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--line-green)", color: "white",
              padding: "8px 14px", borderRadius: "var(--r-pill)",
              fontSize: 13, fontWeight: 700,
            }}>
              <Icon.Line style={{ width: 16, height: 16 }} />
              加 LINE
            </button>
            <button onClick={() => onNav("cart")} style={{ position: "relative", color: "var(--ink-700)" }}>
              <Icon.Cart />
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  background: "var(--cz-orange)", color: "white",
                  width: 18, height: 18, borderRadius: "50%",
                  fontSize: 10, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

// ===== Footer =====
const Footer = () => (
  <footer style={{
    background: "var(--ink-900)", color: "var(--ink-200)",
    padding: "60px 24px 30px", marginTop: 60,
  }}>
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, var(--cz-orange), var(--cz-amber))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 800, fontSize: 20,
            }}>橙</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>橙築選物</div>
              <div style={{ fontSize: 10, color: "var(--ink-400)", letterSpacing: "0.15em" }}>CHENGZHU SHOP</div>
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--ink-300)", marginBottom: 20 }}>
            橙築國際旗下 LINE 整合電商。<br/>從家電到生活選物，所有商品都可在 LINE 直接購買、結帳、追蹤訂單。
          </p>
          <button style={{
            background: "var(--line-green)", color: "white",
            padding: "10px 18px", borderRadius: "var(--r-pill)",
            fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon.Line style={{ width: 16, height: 16 }} />
            加入 @616wvceo
          </button>
        </div>
        {[
          { t: "關於橙築", l: ["主站", "選物商城", "KINYO 家電", "車業", "LINE Bot"] },
          { t: "客戶服務", l: ["訂單查詢", "退換貨政策", "運費說明", "常見問題", "客服中心"] },
          { t: "會員", l: ["會員登入", "加入會員", "會員等級", "橙幣回饋", "邀請好友"] },
          { t: "聯絡資訊", l: ["桃園春日路 818 號", "03-370-8108", "0975-691-485", "[email protected]"] },
        ].map((c, i) => (
          <div key={i}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "white", marginBottom: 14, letterSpacing: "0.05em" }}>{c.t}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--ink-300)" }}>
              {c.l.map(x => <span key={x}>{x}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20,
        display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-400)",
      }}>
        <span>© 2026 橙築國際 ChengZhu International · 此商城為 demo 展示</span>
        <span>桃園市桃園區春日路 818 號 1F</span>
      </div>
    </div>
  </footer>
);

window.Icon = Icon;
window.Stars = Stars;
window.Price = Price;
window.ProductCard = ProductCard;
window.Header = Header;
window.Footer = Footer;
