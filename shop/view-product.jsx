// 商品詳情頁

const ProductView = ({ product, onAddToCart, onNav, onBack }) => {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [imgIdx, setImgIdx] = useState(0);

  if (!product) return null;
  const discount = product.origPrice ? Math.round((1 - product.price / product.origPrice) * 100) : null;

  const reviews = [
    { n: "陳O婷", r: 5, d: "2026/04/28", t: "商品跟描述一樣，包裝很完整，物流也很快！", img: true },
    { n: "李O明", r: 5, d: "2026/04/22", t: "在 LINE 直接買真的很方便，付款一鍵完成，已經回購第三次。" },
    { n: "張O文", r: 4, d: "2026/04/15", t: "整體不錯，CP 值很高。客服也很專業。" },
  ];

  return (
    <main style={{ padding: "32px 24px", maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ fontSize: 13, color: "var(--ink-500)", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <span onClick={() => onNav("home")} style={{ cursor: "pointer" }}>首頁</span>
        <Icon.ChevR style={{ width: 12, height: 12 }} />
        <span onClick={onBack} style={{ cursor: "pointer" }}>{product.cat}</span>
        <Icon.ChevR style={{ width: 12, height: 12 }} />
        <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>{product.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, marginBottom: 60 }}>
        {/* Gallery */}
        <div>
          <div style={{ borderRadius: "var(--r-xl)", overflow: "hidden", marginBottom: 12, boxShadow: "var(--sh-2)" }}>
            <ProductImage product={product} size="hero" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} onClick={() => setImgIdx(i)} style={{
                borderRadius: 12, overflow: "hidden", cursor: "pointer",
                border: imgIdx === i ? "2px solid var(--cz-orange)" : "2px solid transparent",
                transition: "border .15s",
              }}>
                <ProductImage product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {product.badge && (
              <span style={{ background: product.badge === "新品" ? "var(--green-ok)" : "var(--cz-orange)", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 4 }}>{product.badge}</span>
            )}
            <span className="cz-chip cz-chip-line"><Icon.Line style={{ width: 12, height: 12 }} /> 可在 LINE 購買</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-500)", fontWeight: 600, marginBottom: 8 }}>{product.cat} · KINYO 授權</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.25, margin: "0 0 14px" }}>{product.name}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "var(--ink-700)", marginBottom: 24 }}>
            <Stars value={product.rating} size={16} />
            <b>{product.rating}</b>
            <span style={{ color: "var(--ink-400)" }}>({product.reviewCount} 則評價)</span>
            <span style={{ color: "var(--ink-400)" }}>·</span>
            <span>已售 {product.sold.toLocaleString()} 件</span>
          </div>

          <div style={{
            background: "linear-gradient(135deg, #FFF8F0, #FFE4D6)",
            borderRadius: "var(--r-lg)", padding: 20, marginBottom: 20,
            border: "1px solid var(--cz-orange-light)",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
              <Price value={product.price} orig={product.origPrice} size="xl" />
              {discount && (
                <span style={{ background: "var(--red-hot)", color: "white", padding: "4px 10px", borderRadius: 4, fontSize: 13, fontWeight: 800 }}>-{discount}%</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--ink-700)" }}>
              <span>💰 橙幣回饋 +{Math.round(product.price * 0.08)}</span>
              <span>💳 信用卡 6% 回饋</span>
              <span>🚚 滿 $499 免運</span>
            </div>
          </div>

          {/* Features */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: "var(--ink-700)" }}>商品特色</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {product.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-700)" }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--cz-orange-light)", color: "var(--cz-orange-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Icon.Check width={11} height={11} /></span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, fontSize: 13 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: product.stock > 10 ? "var(--green-ok)" : "var(--red-hot)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor" }} />
              {product.stock > 10 ? `庫存充足 (${product.stock} 件)` : `僅剩 ${product.stock} 件`}
            </span>
            <span style={{ color: "var(--ink-400)" }}>·</span>
            <span style={{ color: "var(--ink-700)" }}>🚚 預計 1-2 天到貨</span>
          </div>

          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-700)" }}>數量</span>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--ink-200)", borderRadius: "var(--r-pill)", overflow: "hidden" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: "10px 14px", color: "var(--ink-700)" }}><Icon.Minus /></button>
              <span style={{ padding: "0 18px", fontWeight: 700, fontSize: 15, minWidth: 40, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ padding: "10px 14px", color: "var(--ink-700)" }}><Icon.Plus /></button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <button onClick={() => onAddToCart(product, qty)} style={{
              flex: 1, background: "white", color: "var(--cz-orange-dark)",
              border: "2px solid var(--cz-orange)", padding: "14px 20px",
              borderRadius: "var(--r-pill)", fontSize: 15, fontWeight: 700,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <Icon.Cart /> 加入購物車
            </button>
            <button onClick={() => { onAddToCart(product, qty); onNav("cart"); }} className="cz-btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 15, padding: "14px 20px" }}>
              立即購買
            </button>
          </div>
          <button className="cz-btn-line" style={{ width: "100%", justifyContent: "center", fontSize: 15, padding: "14px 20px" }}>
            <Icon.Line /> 在 LINE 直接購買 (LIFF 結帳)
          </button>

          {/* Service */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--ink-200)" }}>
            {[
              { i: <Icon.Truck />, t: "免運", s: "滿 $499" },
              { i: <Icon.Shield />, t: "原廠保固", s: "1 年" },
              { i: <Icon.Tag />, t: "7 天鑑賞", s: "免費退換" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: 12 }}>
                <div style={{ color: "var(--cz-orange-dark)", display: "flex", justifyContent: "center", marginBottom: 6 }}>{s.i}</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{s.t}</div>
                <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderRadius: "var(--r-lg)", padding: 32, boxShadow: "var(--sh-1)" }}>
        <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--ink-200)", marginBottom: 28 }}>
          {[{ k: "desc", l: "商品介紹" }, { k: "spec", l: "規格" }, { k: "review", l: `評價 (${product.reviewCount})` }, { k: "qa", l: "Q&A" }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              padding: "12px 20px", fontSize: 14, fontWeight: 700,
              borderBottom: tab === t.k ? "3px solid var(--cz-orange)" : "3px solid transparent",
              color: tab === t.k ? "var(--cz-orange-dark)" : "var(--ink-500)",
              marginBottom: -1,
            }}>{t.l}</button>
          ))}
        </div>

        {tab === "desc" && (
          <div style={{ fontSize: 15, lineHeight: 1.85, color: "var(--ink-700)", maxWidth: 760 }}>
            <p style={{ margin: "0 0 16px", fontSize: 17, color: "var(--ink-900)" }}>{product.desc}</p>
            <p>{product.name} 是橙築選物嚴選品項，由 KINYO 授權經銷。我們對每件商品的品質、保固與售後服務都有嚴格標準——這也是為什麼 3,200+ 位 LINE 好友選擇我們作為長期購物夥伴。</p>
            <p>從下單、付款、到收貨追蹤，整套流程都可以在 LINE 內完成。Bot 會主動推送出貨通知、配送進度，並協助您處理任何售後問題。</p>
          </div>
        )}

        {tab === "spec" && (
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "12px 24px", maxWidth: 600, fontSize: 14 }}>
            {[
              ["商品名稱", product.name], ["分類", product.cat], ["品牌", "KINYO"],
              ["保固期限", "1 年原廠保固"], ["產地", "台灣"], ["庫存", `${product.stock} 件`],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <div style={{ color: "var(--ink-500)", padding: "10px 0", borderBottom: "1px solid var(--ink-100)" }}>{k}</div>
                <div style={{ color: "var(--ink-900)", fontWeight: 600, padding: "10px 0", borderBottom: "1px solid var(--ink-100)" }}>{v}</div>
              </React.Fragment>
            ))}
          </div>
        )}

        {tab === "review" && (
          <div>
            <div style={{ display: "flex", gap: 32, padding: 24, background: "var(--ink-50)", borderRadius: "var(--r-lg)", marginBottom: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 56, fontWeight: 800, color: "var(--cz-orange-dark)", lineHeight: 1 }}>{product.rating}</div>
                <Stars value={product.rating} size={18} />
                <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4 }}>{product.reviewCount} 則評價</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
                {[5, 4, 3, 2, 1].map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                    <span style={{ width: 14 }}>{s}</span>
                    <Icon.Star filled width={12} height={12} />
                    <div style={{ flex: 1, height: 6, background: "var(--ink-200)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${[78, 18, 3, 1, 0][5 - s]}%`, height: "100%", background: "var(--cz-amber)" }} />
                    </div>
                    <span style={{ color: "var(--ink-500)", width: 32, textAlign: "right" }}>{[78, 18, 3, 1, 0][5 - s]}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ borderBottom: "1px solid var(--ink-100)", paddingBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--cz-orange-light)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--cz-orange-dark)" }}>{r.n[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{r.n}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{r.d}</div>
                    </div>
                    <Stars value={r.r} size={14} />
                  </div>
                  <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.7, color: "var(--ink-700)" }}>{r.t}</p>
                  {r.img && (
                    <div style={{ display: "flex", gap: 8 }}>
                      {[0, 1, 2].map(j => (
                        <div key={j} style={{ width: 80, height: 80, borderRadius: 8, overflow: "hidden" }}>
                          <ProductImage product={product} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "qa" && (
          <div style={{ maxWidth: 760 }}>
            {[
              { q: "可以在 LINE 內直接購買嗎？", a: "可以！加入官方帳號 @616wvceo 後，傳商品名稱即可由 Bot 推送商品卡，點選後直接 LIFF 結帳，全程不離開 LINE。" },
              { q: "保固怎麼處理？", a: "1 年原廠保固。若有問題可在 LINE 直接傳訊息，客服會協助安排維修或換貨。" },
              { q: "可以開立統編三聯式發票嗎？", a: "可以，結帳時填寫公司抬頭與統編即可。" },
            ].map((x, i) => (
              <div key={i} style={{ borderBottom: "1px solid var(--ink-100)", padding: "16px 0" }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Q：{x.q}</div>
                <div style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.7 }}>A：{x.a}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

window.ProductView = ProductView;
