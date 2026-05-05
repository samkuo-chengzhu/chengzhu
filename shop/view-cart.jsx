// 購物車 + Checkout + Order Done — refined / golf-boutique aesthetic

const CartView = ({ cart, setCart, onNav }) => {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 499 ? 0 : 80;
  const orangeBack = Math.round(subtotal * 0.08);
  const total = subtotal + shipping;

  const updateQty = (id, delta) => {
    setCart(cart.map(i => i.product.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  const remove = (id) => setCart(cart.filter(i => i.product.id !== id));

  if (cart.length === 0) {
    return (
      <main style={{ padding: "120px 24px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 60, marginBottom: 24, opacity: 0.6 }}>🛒</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.015em", marginBottom: 14 }}>購物車是空的</h1>
        <p style={{ color: "var(--ink-500)", marginBottom: 36, fontSize: 15 }}>還沒有加入任何商品,先去逛逛吧。</p>
        <button onClick={() => onNav("shop")} className="cz-btn-primary">探索選物 <Icon.ChevR /></button>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 24px 80px", maxWidth: 1400, margin: "0 auto" }}>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: 36, fontWeight: 600, letterSpacing: "-0.015em",
        margin: "0 0 32px", color: "var(--ink-900)",
      }}>購物車 <span style={{ fontSize: 16, color: "var(--ink-500)", fontWeight: 400, marginLeft: 8, letterSpacing: "0.04em" }}>· {cart.length} 件商品</span></h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40, alignItems: "flex-start" }}>
        <div style={{ background: "white", border: "1px solid var(--ink-200)", overflow: "hidden" }}>
          {cart.map((item, i) => (
            <div key={item.product.id} style={{ display: "flex", gap: 18, padding: 24, borderBottom: i < cart.length - 1 ? "1px solid var(--ink-200)" : "none" }}>
              <div style={{ width: 96, height: 96, border: "1px solid var(--ink-200)", overflow: "hidden", flexShrink: 0 }}>
                <ProductImage product={item.product} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="cz-eyebrow" style={{ marginBottom: 6, fontSize: 10 }}>{item.product.cat}</div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 10, lineHeight: 1.4 }}>{item.product.name}</div>
                <Price value={item.product.price} orig={item.product.origPrice} size="md" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
                <button onClick={() => remove(item.product.id)} style={{ fontSize: 12, color: "var(--ink-400)", letterSpacing: "0.04em" }}>移除</button>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--ink-300)" }}>
                  <button onClick={() => updateQty(item.product.id, -1)} style={{ padding: "6px 10px", color: "var(--ink-700)" }}><Icon.Minus /></button>
                  <span style={{ padding: "0 12px", fontWeight: 600, fontSize: 13, minWidth: 30, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.product.id, 1)} style={{ padding: "6px 10px", color: "var(--ink-700)" }}><Icon.Plus /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside style={{ position: "sticky", top: 100 }}>
          <div style={{ background: "white", border: "1px solid var(--ink-200)", padding: 28 }}>
            <div className="cz-eyebrow" style={{ marginBottom: 20 }}>訂單摘要</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "var(--ink-700)", marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>小計</span><span>NT$ {subtotal.toLocaleString()}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>運費 {subtotal >= 499 && <span style={{ color: "var(--green-ok)", fontSize: 11, marginLeft: 4 }}>(已免運)</span>}</span>
                <span>{shipping === 0 ? "免費" : `NT$ ${shipping}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cz-orange)" }}><span>橙幣回饋 (8%)</span><span>+{orangeBack}</span></div>
            </div>
            <div style={{ borderTop: "1px solid var(--ink-200)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em" }}>應付總計</span>
              <Price value={total} size="lg" accent />
            </div>
            <button onClick={() => onNav("checkout")} className="cz-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 14, marginBottom: 10 }}>
              前往結帳 <Icon.ChevR />
            </button>
            <button onClick={() => onNav("liff")} className="cz-btn-line" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 14 }}>
              <Icon.Line /> LIFF 一鍵結帳
            </button>
            <p style={{ fontSize: 11, color: "var(--ink-500)", textAlign: "center", margin: "16px 0 0", lineHeight: 1.7, letterSpacing: "0.04em" }}>結帳即表示同意服務條款與隱私權政策<br/>此商城為 demo · 不會實際扣款</p>
          </div>
        </aside>
      </div>
    </main>
  );
};

// Checkout (web)
const CheckoutView = ({ cart, onNav, setOrder }) => {
  const [step, setStep] = useState(1);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal >= 499 ? 0 : 80;
  const total = subtotal + shipping;

  const placeOrder = () => {
    setOrder({ id: "20260504-A82C", items: cart, total, shipping, subtotal, date: "2026/05/04 14:32" });
    onNav("orderdone");
  };

  return (
    <main style={{ padding: "40px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: 36, fontWeight: 600, letterSpacing: "-0.015em",
        margin: "0 0 12px", color: "var(--ink-900)",
      }}>結帳</h1>
      <div style={{ display: "flex", gap: 16, marginBottom: 36, fontSize: 12, letterSpacing: "0.04em" }}>
        {["填寫資料", "付款", "完成"].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: step > i ? "var(--ink-900)" : "var(--ink-400)", fontWeight: 500 }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: step > i ? "var(--ink-900)" : "var(--ink-200)", color: step > i ? "white" : "var(--ink-500)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{i + 1}</span>
            {s}
            {i < 2 && <span style={{ color: "var(--ink-300)", marginLeft: 8 }}>—</span>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "flex-start" }}>
        <div style={{ background: "white", border: "1px solid var(--ink-200)", padding: 32 }}>
          <div className="cz-eyebrow" style={{ marginBottom: 20 }}>收件資訊</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {[
              { l: "收件人姓名", v: "陳小姐" },
              { l: "電話", v: "0975-691-485" },
              { l: "Email", v: "hi@chengzhu.co", span: 2 },
              { l: "縣市", v: "桃園市" },
              { l: "區", v: "桃園區" },
              { l: "地址", v: "春日路 818 號 1F", span: 2 },
            ].map((f, i) => (
              <div key={i} style={{ gridColumn: f.span === 2 ? "span 2" : "auto" }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-500)", display: "block", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>{f.l}</label>
                <input defaultValue={f.v} style={{ width: "100%", padding: "11px 14px", border: "1px solid var(--ink-200)", fontSize: 14, color: "var(--ink-900)", background: "white" }} />
              </div>
            ))}
          </div>
          <div className="cz-eyebrow" style={{ marginBottom: 16 }}>付款方式</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { k: "credit", t: "信用卡", s: "Visa / Master / JCB · 6% 回饋" },
              { k: "line", t: "LINE Pay", s: "推薦 · 額外 3% 回饋", best: true },
              { k: "atm", t: "ATM 轉帳", s: "3 天內完成" },
              { k: "cod", t: "貨到付款", s: "+30 元手續費" },
            ].map(p => (
              <label key={p.k} style={{
                display: "flex", alignItems: "center", gap: 14, padding: 16,
                border: p.k === "line" ? "1px solid var(--cz-sage)" : "1px solid var(--ink-200)",
                cursor: "pointer", background: p.k === "line" ? "var(--cz-sage-light)" : "white",
                position: "relative",
              }}>
                <input type="radio" name="pay" defaultChecked={p.k === "line"} style={{ accentColor: "var(--ink-900)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    {p.t}
                    {p.best && <span style={{ border: "1px solid var(--cz-sage)", color: "var(--cz-sage)", padding: "1px 8px", fontSize: 10, marginLeft: 10, letterSpacing: "0.06em" }}>RECOMMENDED</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4 }}>{p.s}</div>
                </div>
              </label>
            ))}
          </div>
          <button onClick={placeOrder} className="cz-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 28, padding: 14, fontSize: 14 }}>
            確認下單 · Demo 不會實際扣款
          </button>
        </div>

        <aside style={{ background: "white", border: "1px solid var(--ink-200)", padding: 28, position: "sticky", top: 100 }}>
          <div className="cz-eyebrow" style={{ marginBottom: 18 }}>訂單摘要</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
            {cart.map(i => (
              <div key={i.product.id} style={{ display: "flex", gap: 12, fontSize: 13 }}>
                <div style={{ width: 48, height: 48, border: "1px solid var(--ink-200)", overflow: "hidden", flexShrink: 0 }}><ProductImage product={i.product} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.5, color: "var(--ink-900)" }}>{i.product.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}>x{i.qty}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-900)", whiteSpace: "nowrap" }}>NT$ {(i.product.price * i.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--ink-200)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--ink-700)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>小計</span><span>NT$ {subtotal.toLocaleString()}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>運費</span><span>{shipping === 0 ? "免費" : `NT$ ${shipping}`}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, paddingTop: 10, borderTop: "1px solid var(--ink-200)", color: "var(--ink-900)" }}>
              <span>總計</span>
              <span style={{ color: "var(--cz-orange)" }}>NT$ {total.toLocaleString()}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

// Order Done + Tracking
const OrderDoneView = ({ order, onNav }) => {
  if (!order) return null;
  const stages = [
    { k: "paid", t: "已付款", d: "2026/05/04 14:32", done: true },
    { k: "pack", t: "備貨中", d: "2026/05/04 16:00", done: true },
    { k: "ship", t: "已出貨", d: "2026/05/05 09:15", done: true, current: true },
    { k: "deliver", t: "配送中", d: "預計 2026/05/06", done: false },
    { k: "arrive", t: "已送達", d: "—", done: false },
  ];
  return (
    <main style={{ padding: "40px 24px 80px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ background: "var(--cz-sage-light)", border: "1px solid var(--ink-200)", padding: 56, textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--cz-sage)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Icon.Check width={28} height={28} />
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.015em", margin: "0 0 12px", color: "var(--ink-900)" }}>訂單已成立</h1>
        <p style={{ fontSize: 14, color: "var(--ink-700)", margin: "0 0 24px", letterSpacing: "0.04em" }}>訂單編號 <b style={{ fontFamily: "var(--font-mono)", color: "var(--ink-900)" }}>#{order.id}</b> · {order.date}</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", padding: "10px 18px", border: "1px solid var(--line-green)", fontSize: 12, color: "var(--line-green-dark)", fontWeight: 500, letterSpacing: "0.04em" }}>
          <Icon.Line style={{ width: 14, height: 14 }} /> 訂單通知已推送至 LINE
        </div>
      </div>

      <div style={{ background: "white", border: "1px solid var(--ink-200)", padding: 32, marginBottom: 24 }}>
        <div className="cz-eyebrow" style={{ marginBottom: 28 }}>訂單追蹤</div>
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          <div style={{ position: "absolute", top: 14, left: 14, right: 14, height: 1, background: "var(--ink-200)", zIndex: 0 }} />
          <div style={{ position: "absolute", top: 14, left: 14, height: 1, background: "var(--cz-sage)", width: "calc(50% - 14px)", zIndex: 1 }} />
          {stages.map(s => (
            <div key={s.k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 2, position: "relative", flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: s.done ? "var(--cz-sage)" : "white",
                border: s.done ? "1px solid var(--cz-sage)" : "1px solid var(--ink-300)",
                color: s.done ? "white" : "var(--ink-300)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: s.current ? "0 0 0 4px rgba(92,120,100,0.2)" : "none",
              }}>
                {s.done ? <Icon.Check width={12} height={12} /> : <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: s.done ? "var(--ink-900)" : "var(--ink-400)" }}>{s.t}</div>
              <div style={{ fontSize: 10, color: "var(--ink-500)", letterSpacing: "0.04em" }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", border: "1px solid var(--ink-200)", padding: 32, marginBottom: 24 }}>
        <div className="cz-eyebrow" style={{ marginBottom: 18 }}>商品明細</div>
        {order.items.map((i, idx) => (
          <div key={i.product.id} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: idx < order.items.length - 1 ? "1px solid var(--ink-200)" : "none" }}>
            <div style={{ width: 56, height: 56, border: "1px solid var(--ink-200)", overflow: "hidden", flexShrink: 0 }}><ProductImage product={i.product} /></div>
            <div style={{ flex: 1 }}>
              <div className="cz-eyebrow" style={{ marginBottom: 4, fontSize: 10 }}>{i.product.cat}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{i.product.name}</div>
              <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 4 }}>數量 × {i.qty}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-900)", whiteSpace: "nowrap" }}>NT$ {(i.product.price * i.qty).toLocaleString()}</div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 18, fontSize: 16, fontWeight: 600, borderTop: "1px solid var(--ink-200)", marginTop: 4 }}>
          <span>應付總計</span>
          <span style={{ color: "var(--cz-orange)", fontFamily: "var(--font-display)" }}>NT$ {order.total.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => onNav("home")} className="cz-btn-ghost" style={{ flex: 1, justifyContent: "center", padding: 14 }}>回首頁</button>
        <button className="cz-btn-line" style={{ flex: 1, justifyContent: "center", padding: 14 }}><Icon.Line /> 在 LINE 查詢訂單</button>
      </div>
    </main>
  );
};

window.CartView = CartView;
window.CheckoutView = CheckoutView;
window.OrderDoneView = OrderDoneView;
