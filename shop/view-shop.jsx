// 商品列表頁

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
    { k: "price-asc", l: "價格低→高" },
    { k: "price-desc", l: "價格高→低" },
  ];

  return (
    <main style={{ padding: "32px 24px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "var(--ink-500)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <span onClick={() => onNav("home")} style={{ cursor: "pointer" }}>首頁</span>
        <Icon.ChevR style={{ width: 12, height: 12 }} />
        <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{CATEGORIES.find(c => c.key === activeCat)?.label || "全部商品"}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32, alignItems: "flex-start" }}>
        {/* Sidebar */}
        <aside style={{ position: "sticky", top: 100 }}>
          <div style={{ background: "white", borderRadius: "var(--r-lg)", padding: 20, boxShadow: "var(--sh-1)", marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 14px", letterSpacing: "0.02em" }}>商品分類</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {CATEGORIES.map(c => {
                const cnt = c.key === "all" ? PRODUCTS.length : PRODUCTS.filter(p => p.catKey === c.key).length;
                return (
                  <button key={c.key} onClick={() => setActiveCat(c.key)} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                    background: activeCat === c.key ? "var(--cz-orange-light)" : "transparent",
                    color: activeCat === c.key ? "var(--cz-orange-dark)" : "var(--ink-700)",
                    textAlign: "left",
                  }}>
                    <span>{c.icon} {c.label}</span>
                    <span style={{ fontSize: 11, color: "var(--ink-400)" }}>{cnt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "var(--r-lg)", padding: 20, boxShadow: "var(--sh-1)", marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 14px" }}>價格範圍</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["$0 - $500", "$500 - $1,000", "$1,000 - $3,000", "$3,000 以上"].map(r => (
                <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-700)" }}>
                  <input type="checkbox" /> {r}
                </label>
              ))}
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, #06C755, #04A246)", borderRadius: "var(--r-lg)", padding: 20, color: "white" }}>
            <Icon.Line style={{ width: 24, height: 24, marginBottom: 8 }} />
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>用 LINE 找商品</div>
            <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.95, margin: "0 0 14px" }}>傳送商品關鍵字，Bot 立即推薦最適合您的選擇</p>
            <button style={{ background: "white", color: "var(--line-green-dark)", padding: "8px 14px", borderRadius: "var(--r-pill)", fontSize: 12, fontWeight: 800 }}>加 LINE 試試</button>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>{CATEGORIES.find(c => c.key === activeCat)?.label}</h1>
              <p style={{ fontSize: 13, color: "var(--ink-500)", margin: "4px 0 0" }}>為您找到 <b style={{ color: "var(--cz-orange-dark)" }}>{filtered.length}</b> 件商品</p>
            </div>
            <div style={{ display: "flex", gap: 6, background: "white", padding: 4, borderRadius: "var(--r-pill)", boxShadow: "var(--sh-1)" }}>
              {sorts.map(s => (
                <button key={s.k} onClick={() => setSort(s.k)} style={{
                  padding: "8px 14px", borderRadius: "var(--r-pill)", fontSize: 13, fontWeight: 600,
                  background: sort === s.k ? "var(--ink-900)" : "transparent",
                  color: sort === s.k ? "white" : "var(--ink-700)",
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
