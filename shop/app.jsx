// 主應用程式

const { useState, useEffect } = React;

const App = () => {
  const [view, setView] = useState("home");
  const [cat, setCat] = useState("all");
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [toast, setToast] = useState(null);
  const [tweaks, setTweaks] = useTweaks(/*EDITMODE-BEGIN*/{
    "density": "default"
  }/*EDITMODE-END*/);

  useEffect(() => {
    document.documentElement.setAttribute("data-density", tweaks.density);
  }, [tweaks.density]);

  const onNav = (key) => {
    if (key === "shop") { setCat("all"); setView("shop"); }
    else if (key === "appliance" || key === "lifestyle") { setCat(key); setView("shop"); }
    else if (key === "home_cat") { setCat("home"); setView("shop"); }
    else if (key === "home") { setView("home"); }
    else { setView(key); }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onProduct = (p) => { setProduct(p); setView("product"); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const onAddToCart = (p, q = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === p.id);
      if (ex) return prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + q } : i);
      return [...prev, { product: p, qty: q }];
    });
    setToast({ name: p.name, icon: p.icon });
    setTimeout(() => setToast(null), 2200);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ensure cart has at least mock items for liff/checkout demo
  useEffect(() => {
    if ((view === "cart" || view === "checkout" || view === "liff") && cart.length === 0) {
      setCart([
        { product: PRODUCTS.find(p => p.id === "ar-2018"), qty: 1 },
        { product: PRODUCTS.find(p => p.id === "kim-21w"), qty: 1 },
      ]);
    }
  }, [view]);

  const currentNav = view === "shop" ? (cat === "all" ? "shop" : cat === "home" ? "home_cat" : cat) : view;

  return (
    <>
      <Header cartCount={cartCount} onNav={onNav} current={currentNav} />
      {view === "home" && <HomeView onNav={onNav} onAddToCart={onAddToCart} onProduct={onProduct} />}
      {view === "shop" && <ShopView catFilter={cat} onAddToCart={onAddToCart} onProduct={onProduct} onNav={onNav} />}
      {view === "product" && <ProductView product={product} onAddToCart={onAddToCart} onNav={onNav} onBack={() => onNav("shop")} />}
      {view === "cart" && <CartView cart={cart} setCart={setCart} onNav={onNav} />}
      {view === "checkout" && <CheckoutView cart={cart} onNav={onNav} setOrder={setOrder} />}
      {view === "liff" && <LiffView cart={cart} onNav={onNav} setOrder={setOrder} />}
      {view === "bot" && <BotView onNav={onNav} />}
      {view === "orderdone" && <OrderDoneView order={order} onNav={onNav} />}
      <Footer />

      {/* Quick LINE demo nav (always visible) */}
      <div style={{ position: "fixed", bottom: 24, left: 24, display: "flex", flexDirection: "column", gap: 8, zIndex: 40 }}>
        <button onClick={() => onNav("bot")} style={{
          background: "white", padding: "10px 14px", borderRadius: "var(--r-pill)",
          fontSize: 12, fontWeight: 700, boxShadow: "var(--sh-2)",
          display: "flex", alignItems: "center", gap: 6,
          color: "var(--line-green-dark)",
          border: view === "bot" ? "2px solid var(--line-green)" : "none",
        }}>
          <Icon.Line style={{ width: 14, height: 14 }} /> Bot 對話 Demo
        </button>
        <button onClick={() => onNav("liff")} style={{
          background: "white", padding: "10px 14px", borderRadius: "var(--r-pill)",
          fontSize: 12, fontWeight: 700, boxShadow: "var(--sh-2)",
          display: "flex", alignItems: "center", gap: 6,
          color: "var(--line-green-dark)",
          border: view === "liff" ? "2px solid var(--line-green)" : "none",
        }}>
          <Icon.Line style={{ width: 14, height: 14 }} /> LIFF 結帳 Demo
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 90, right: 24,
          background: "white", padding: "14px 18px",
          borderRadius: 12, boxShadow: "var(--sh-3)",
          display: "flex", alignItems: "center", gap: 12,
          zIndex: 1000, animation: "slideInRight .3s ease",
          minWidth: 280,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--green-ok)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.Check /></div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>已加入購物車</div>
            <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{toast.icon} {toast.name}</div>
          </div>
        </div>
      )}

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="排版密度">
          <TweakRadio
            tweaks={tweaks} setTweak={setTweaks}
            tweakKey="density"
            options={[
              { value: "tight", label: "緊" },
              { value: "default", label: "標準" },
              { value: "loose", label: "鬆" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
