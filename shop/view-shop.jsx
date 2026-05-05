// 商品列表頁 — refined / golf-boutique aesthetic

const ShopView = ({ catFilter, onAddToCart, onProduct, onNav }) => {
  const [sort, setSort] = useState("recommend");
  const [activeCat, setActiveCat] = useState(catFilter || "all");

  useEffect(() => { if (catFilter) setActiveCat(catFilter); }, [catFilter]);

  const filtered = useMemo(() => {
    let list = activeCat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.catKey === activeCat);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "hot") list = [...list].sort((a, b) => b.sold - a.sold);
    if (sort === "new") list = [...list].filter(p => p.badge === "新品").concat(list.filter(p => p.badge !== "新品"));
    return list;
  }, [activeCat, sort]);

  const sorts = [
    { k: "recommend", l: "綜合" },
    { k: "hot", l: "熱銷" },
    { k: "new", l: "新品" },
    { k: "price-asc", l: "價格 ↑" },
    { k: "price-desc", l: "價格 ↓" },
  ];

  return (
    <main style={{ padding: "40px 24px 80px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: "var(--ink-500)", marginBottom: 32, display: "flex", alignItems: "center", gap: 8, letterSpacing: "0.04em" }}>
        <span onClick={() => onNav("home")} style={{ cursor: "pointer" }}>首頁</span>
        <span style={{ color: "var(--ink-300)" }}>/</span>
        <span style={{ color: "var(--ink-900)", fontWeight: 500 }}>{CATEGORIES.find(c => c.key === activeCat)?.label || "全部商品"}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 48, alignItems: "flex-start" }}>
        {/* Sidebar */}
        <aside style={{ position: "sticky", top: 100 }}>
          <div style={{ background: "white", border: "1px solid var(--ink-200)", padding: 24, marginBottom: 16 }}>
            <div className="cz-eyebrow" style={{ marginBottom: 18 }}>商品分類</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {CATEGORIES.map(c => {
                const cnt = c.key === "all" ? PRODUCTS.length : PRODUCTS.filter(p => p.catKey === c.key).length;
                const isActive = activeCat === c.key;
                return (
                  <button key={c.key} onClick={() => setActiveCat(c.key)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 0", fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--ink-900)" : "var(--ink-700)",
                    textAlign: "left", borderBottom: "1px solid var(--ink-100)",
                    transition: "color .15s",
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "var(--ink-900)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "var(--ink-700)"; }}>
                    <span>{c.label}</span>
                    <span style={{ fontSize: 11, color: "var(--ink-400)", letterSpacing: "0.04em" }}>{cnt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: "white", border: "1px solid var(--ink-200)", padding: 24, marginBottom: 16 }}>
            <div className="cz-eyebrow" style={{ marginBottom: 18 }}>價格範圍</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["NT$0 – $500", "NT$500 – $1,000", "NT$1,000 – $3,000", "NT$3,000 以上"].map(r => (
                <label key={r} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-700)", cursor: "pointer" }}>
                  <input type="checkbox" style={{ accentColor: "var(--ink-900)" }} /> {r}
                </label>
              ))}
            </div>
          </div>

          <div style={{ background: "var(--cz-sage-light)", border: "1px solid var(--ink-200)", padding: 24 }}>
            <Icon.Line style={{ width: 22, height: 22, color: "var(--cz-sage)", marginBottom: 12 }} />
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--ink-900)", marginBottom: 6, letterSpacing: "-0.01em" }}>用 LINE 找商品</div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "var(--ink-700)", margin: "0 0 16px" }}>傳商品關鍵字,Bot 立即推薦最適合您的選擇。</p>
            <button style={{
              background: "var(--cz-sage)", color: "white",
              padding: "8px 14px", borderRadius: "var(--r-sm)",
              fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
            }}>加 LINE 試試</button>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--ink-200)" }}>
            <div>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: 36, fontWeight: 600,
                margin: 0, letterSpacing: "-0.015em",
                color: "var(--ink-900)",
              }}>{CATEGORIES.find(c => c.key === activeCat)?.label}</h1>
              <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "8px 0 0", letterSpacing: "0.02em" }}>共 <b style={{ color: "var(--ink-900)", fontWeight: 600 }}>{filtered.length}</b> 件商品</p>
            </div>
            <div style={{ display: "flex", gap: 0, border: "1px solid var(--ink-200)", background: "white" }}>
              {sorts.map(s => (
                <button key={s.k} onClick={() => setSort(s.k)} style={{
                  padding: "10px 16px", fontSize: 12, fontWeight: 500, letterSpacing: "0.04em",
                  background: sort === s.k ? "var(--ink-900)" : "transparent",
                  color: sort === s.k ? "white" : "var(--ink-700)",
                  borderRight: "1px solid var(--ink-200)",
                  transition: "background .15s, color .15s",
                }}>{s.l}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--gap)" }}>
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAdd={onAddToCart} onClick={() => onProduct(p)} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

window.ShopView = ShopView;
