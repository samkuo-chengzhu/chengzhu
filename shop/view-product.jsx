// 商品詳情頁 — refined / golf-boutique aesthetic

const ProductView = ({ product, onAddToCart, onNav, onBack }) => {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [imgIdx, setImgIdx] = useState(0);

  if (!product) return null;
  const discount = product.origPrice ? Math.round((1 - product.price / product.origPrice) * 100) : null;

  const reviews = [
    { n: "陳O婷", r: 5, d: "2026/04/28", t: "商品跟描述一樣,包裝很完整,物流也很快。", img: true },
    { n: "李O明", r: 5, d: "2026/04/22", t: "在 LINE 直接買真的很方便,付款一鍵完成,已經回購第三次。" },
    { n: "張O文", r: 4, d: "2026/04/15", t: "整體不錯,CP 值很高。客服也很專業。" },
  ];

  return (
    <main style={{ padding: "40px 24px 80px", maxWidth: 1400, margin: "0 auto" }}>
      <div style={{ fontSize: 12, color: "var(--ink-500)", marginBottom: 32, display: "flex", alignItems: "center", gap: 8, letterSpacing: "0.04em" }}>
        <span onClick={() => onNav("home")} style={{ cursor: "pointer" }}>首頁</span>
        <span style={{ color: "var(--ink-300)" }}>/</span>
        <span onClick={onBack} style={{ cursor: "pointer" }}>{product.cat}</span>
        <span style={{ color: "var(--ink-300)" }}>/</span>
        <span style={{ color: "var(--ink-900)", fontWeight: 500 }}>{product.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 56, marginBottom: 80 }}>
        {/* Gallery */}
        <div>
          <div style={{ border: "1px solid var(--ink-200)", overflow: "hidden", marginBottom: 12 }}>
            <ProductImage product={product} size="hero" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} onClick={() => setImgIdx(i)} style={{
                overflow: "hidden", cursor: "pointer",
                border: imgIdx === i ? "1px solid var(--ink-900)" : "1px solid var(--ink-200)",
                transition: "border .15s",
              }}>
                <ProductImage product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {product.badge && (
              <span className={product.badge === "新品" ? "cz-chip cz-chip-new" : "cz-chip cz-chip-hot"}>
                {product.badge === "新品" ? "NEW · 新品" : "FEATURED · 嚴選"}
              </span>
            )}
            <span className="cz-chip cz-chip-line"><Icon.Line style={{ width: 11, height: 11 }} /> 可在 LINE 購買</span>
          </div>
          <div className="cz-eyebrow" style={{ marginBottom: 12 }}>{product.cat} · KINYO 授權</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32, fontWeight: 600, letterSpacing: "-0.015em",
            lineHeight: 1.3, margin: "0 0 18px",
            color: "var(--ink-900)",
          }}>{product.name}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "var(--ink-700)", marginBottom: 28 }}>
            <Stars value={product.rating} size={14} />
            <b style={{ fontWeight: 600 }}>{product.rating}</b>
            <span style={{ color: "var(--ink-300)" }}>·</span>
            <span style={{ color: "var(--ink-500)" }}>{product.reviewCount} 則評價</span>
            <span style={{ color: "var(--ink-300)" }}>·</span>
            <span style={{ color: "var(--ink-500)" }}>已售 {product.sold.toLocaleString()} 件</span>
          </div>

          <div style={{
            background: "var(--ink-100)",
            padding: 24, marginBottom: 28,
            border: "1px solid var(--ink-200)",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 12 }}>
              <Price value={product.price} orig={product.origPrice} size="xl" accent />
              {discount && (
                <span style={{
                  border: "1px solid var(--cz-orange)", color: "var(--cz-orange)",
                  padding: "3px 10px", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
                }}>−{discount}% OFF</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 18, fontSize: 12, color: "var(--ink-700)", letterSpacing: "0.02em" }}>
              <span>橙幣回饋 +{Math.round(product.price * 0.08)}</span>
              <span style={{ color: "var(--ink-300)" }}>·</span>
              <span>信用卡 6% 回饋</span>
              <span style={{ color: "var(--ink-300)" }}>·</span>
              <span>滿 $499 免運</span>
            </div>
          </div>

          {/* Features */}
          <div style={{ marginBottom: 28 }}>
            <div className="cz-eyebrow" style={{ marginBottom: 14 }}>商品特色</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {product.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-700)" }}>
                  <span style={{ color: "var(--cz-sage)", display: "inline-flex", flexShrink: 0 }}><Icon.Check width={14} height={14} /></span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, fontSize: 13, paddingBottom: 24, borderBottom: "1px solid var(--ink-200)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: product.stock > 10 ? "var(--green-ok)" : "var(--cz-orange)", fontWeight: 500 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
              {product.stock > 10 ? `庫存充足 (${product.stock} 件)` : `僅剩 ${product.stock} 件`}
            </span>
            <span style={{ color: "var(--ink-300)" }}>·</span>
            <span style={{ color: "var(--ink-700)" }}>預計 1-2 天到貨</span>
          </div>

          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            <span className="cz-eyebrow">數量</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--ink-300)" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: "10px 14px", color: "var(--ink-700)" }}><Icon.Minus /></button>
              <span style={{ padding: "0 18px", fontWeight: 600, fontSize: 14, minWidth: 40, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ padding: "10px 14px", color: "var(--ink-700)" }}><Icon.Plus /></button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button onClick={() => onAddToCart(product, qty)} className="cz-btn-ghost" style={{
              flex: 1, justifyContent: "center", padding: "14px 20px", fontSize: 14,
            }}>
              <Icon.Cart width={16} height={16} /> 加入購物車
            </button>
            <button onClick={() => { onAddToCart(product, qty); onNav("cart"); }} className="cz-btn-primary" style={{ flex: 1, justifyContent: "center", padding: "14px 20px", fontSize: 14 }}>
              立即購買
            </button>
          </div>
          <button className="cz-btn-line" style={{ width: "100%", justifyContent: "center", padding: "14px 20px", fontSize: 14 }}>
            <Icon.Line /> 在 LINE 直接購買 (LIFF 結帳)
          </button>

          {/* Service */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--ink-200)" }}>
            {[
              { i: <Icon.Truck />, t: "免運", s: "滿 NT$499" },
              { i: <Icon.Shield />, t: "原廠保固", s: "1 年" },
              { i: <Icon.Tag />, t: "鑑賞期", s: "7 天免費退換" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0 12px", borderRight: i < 2 ? "1px solid var(--ink-200)" : "none" }}>
                <div style={{ color: "var(--ink-700)", display: "flex", justifyContent: "center", marginBottom: 8 }}>{s.i}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{s.t}</div>
                <div className="cz-eyebrow" style={{ marginTop: 4, fontSize: 10 }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", border: "1px solid var(--ink-200)", padding: 36 }}>
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--ink-200)", marginBottom: 32 }}>
          {[{ k: "desc", l: "商品介紹" }, { k: "spec", l: "規格" }, { k: "review", l: `評價 (${product.reviewCount})` }, { k: "qa", l: "Q&A" }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              padding: "14px 24px", fontSize: 13, fontWeight: 500, letterSpacing: "0.04em",
              borderBottom: tab === t.k ? "2px solid var(--ink-900)" : "2px solid transparent",
              color: tab === t.k ? "var(--ink-900)" : "var(--ink-500)",
              marginBottom: -1,
              transition: "color .15s, border-color .15s",
            }}>{t.l}</button>
          ))}
        </div>

        {tab === "desc" && (
          <div style={{ fontSize: 15, lineHeight: 1.9, color: "var(--ink-700)", maxWidth: 760 }}>
            <p style={{ margin: "0 0 18px", fontSize: 17, color: "var(--ink-900)", fontFamily: "var(--font-display)", fontWeight: 500 }}>{product.desc}</p>
            <p>{product.name} 是橙築選物嚴選品項,由 KINYO 授權經銷。我們對每件商品的品質、保固與售後服務都有嚴格標準 — 這也是為什麼 3,200+ 位 LINE 好友選擇我們作為長期購物夥伴。</p>
            <p>從下單、付款、到收貨追蹤,整套流程都可以在 LINE 內完成。Bot 會主動推送出貨通知、配送進度,並協助您處理任何售後問題。</p>
          </div>
        )}

        {tab === "spec" && (
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "0", maxWidth: 600, fontSize: 14 }}>
            {[
              ["商品名稱", product.name], ["分類", product.cat], ["品牌", "KINYO"],
              ["保固期限", "1 年原廠保固"], ["產地", "台灣"], ["庫存", `${product.stock} 件`],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <div style={{ color: "var(--ink-500)", padding: "12px 0", borderBottom: "1px solid var(--ink-200)", letterSpacing: "0.04em", fontSize: 12 }}>{k}</div>
                <div style={{ color: "var(--ink-900)", fontWeight: 500, padding: "12px 0", borderBottom: "1px solid var(--ink-200)" }}>{v}</div>
              </React.Fragment>
            ))}
          </div>
        )}

        {tab === "review" && (
          <div>
            <div style={{ display: "flex", gap: 40, padding: 28, background: "var(--ink-50)", border: "1px solid var(--ink-200)", marginBottom: 28 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 600, color: "var(--ink-900)", lineHeight: 1, letterSpacing: "-0.02em" }}>{product.rating}</div>
                <div style={{ marginTop: 6 }}><Stars value={product.rating} size={16} /></div>
                <div className="cz-eyebrow" style={{ marginTop: 8 }}>{product.reviewCount} 則評價</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                {[5, 4, 3, 2, 1].map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12 }}>
                    <span style={{ width: 14, color: "var(--ink-700)" }}>{s}</span>
                    <Icon.Star filled width={11} height={11} style={{ color: "var(--cz-amber)" }} />
                    <div style={{ flex: 1, height: 4, background: "var(--ink-200)", overflow: "hidden" }}>
                      <div style={{ width: `${[78, 18, 3, 1, 0][5 - s]}%`, height: "100%", background: "var(--cz-amber)" }} />
                    </div>
                    <span style={{ color: "var(--ink-500)", width: 32, textAlign: "right" }}>{[78, 18, 3, 1, 0][5 - s]}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {reviews.map((r, i) => (
                <div key={i} style={{ borderBottom: i < reviews.length - 1 ? "1px solid var(--ink-200)" : "none", padding: "20px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--ink-100)", border: "1px solid var(--ink-200)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "var(--ink-700)", fontFamily: "var(--font-display)" }}>{r.n[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{r.n}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-500)", letterSpacing: "0.04em" }}>{r.d}</div>
                    </div>
                    <Stars value={r.r} size={13} />
                  </div>
                  <p style={{ margin: "0 0 14px", fontSize: 14, lineHeight: 1.85, color: "var(--ink-700)" }}>{r.t}</p>
                  {r.img && (
                    <div style={{ display: "flex", gap: 8 }}>
                      {[0, 1, 2].map(j => (
                        <div key={j} style={{ width: 80, height: 80, border: "1px solid var(--ink-200)", overflow: "hidden" }}>
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
              { q: "可以在 LINE 內直接購買嗎?", a: "可以。加入官方帳號 @616wvceo 後,傳商品名稱即可由 Bot 推送商品卡,點選後直接 LIFF 結帳,全程不離開 LINE。" },
              { q: "保固怎麼處理?", a: "1 年原廠保固。若有問題可在 LINE 直接傳訊息,客服會協助安排維修或換貨。" },
              { q: "可以開立統編三聯式發票嗎?", a: "可以,結帳時填寫公司抬頭與統編即可。" },
            ].map((x, i) => (
              <div key={i} style={{ borderBottom: i < 2 ? "1px solid var(--ink-200)" : "none", padding: "20px 0" }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: "var(--ink-900)" }}>Q · {x.q}</div>
                <div style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.85 }}>A · {x.a}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

window.ProductView = ProductView;
