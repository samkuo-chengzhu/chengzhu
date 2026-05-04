// 購物車 + LIFF 結帳 + 訂單追蹤 + LINE Bot Demo

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
      <main style={{ padding: "80px 24px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>🛒</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>購物車是空的</h1>
        <p style={{ color: "var(--ink-500)", marginBottom: 28 }}>還沒有加入任何商品，去逛逛吧！</p>
        <button onClick={() => onNav("shop")} className="cz-btn-primary">去逛逛 <Icon.ChevR /></button>
      </main>
    );
  }

  return (
    <main style={{ padding: "32px 24px", maxWidth: 1400, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 24px" }}>購物車 <span style={{ fontSize: 18, color: "var(--ink-500)", fontWeight: 600 }}>· {cart.length} 件商品</span></h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "flex-start" }}>
        <div style={{ background: "white", borderRadius: "var(--r-lg)", overflow: "hidden", boxShadow: "var(--sh-1)" }}>
          {cart.map((item, i) => (
            <div key={item.product.id} style={{ display: "flex", gap: 16, padding: 20, borderBottom: i < cart.length - 1 ? "1px solid var(--ink-100)" : "none" }}>
              <div style={{ width: 100, height: 100, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                <ProductImage product={item.product} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--ink-400)", fontWeight: 600 }}>{item.product.cat}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{item.product.name}</div>
                <Price value={item.product.price} orig={item.product.origPrice} size="md" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
                <button onClick={() => remove(item.product.id)} style={{ fontSize: 12, color: "var(--ink-400)" }}>移除</button>
                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--ink-200)", borderRadius: "var(--r-pill)" }}>
                  <button onClick={() => updateQty(item.product.id, -1)} style={{ padding: "6px 10px", color: "var(--ink-700)" }}><Icon.Minus /></button>
                  <span style={{ padding: "0 12px", fontWeight: 700, fontSize: 14, minWidth: 30, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.product.id, 1)} style={{ padding: "6px 10px", color: "var(--ink-700)" }}><Icon.Plus /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside style={{ position: "sticky", top: 100 }}>
          <div style={{ background: "white", borderRadius: "var(--r-lg)", padding: 24, boxShadow: "var(--sh-2)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 18px" }}>訂單摘要</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14, color: "var(--ink-700)", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>小計</span><span>${subtotal.toLocaleString()}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>運費 {subtotal >= 499 && <span style={{ color: "var(--green-ok)", fontSize: 11, fontWeight: 700 }}>(已免運)</span>}</span><span>{shipping === 0 ? "免費" : `$${shipping}`}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cz-orange-dark)" }}><span>橙幣回饋 (8%)</span><span>+{orangeBack}</span></div>
            </div>
            <div style={{ borderTop: "1px solid var(--ink-200)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>總計</span>
              <Price value={total} size="lg" />
            </div>
            <button onClick={() => onNav("checkout")} className="cz-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15, marginBottom: 10 }}>
              前往結帳 <Icon.ChevR />
            </button>
            <button onClick={() => onNav("liff")} className="cz-btn-line" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>
              <Icon.Line /> LIFF 一鍵結帳
            </button>
            <p style={{ fontSize: 11, color: "var(--ink-500)", textAlign: "center", margin: "14px 0 0", lineHeight: 1.6 }}>結帳即表示同意服務條款與隱私權政策<br/>此商城為 demo 不會實際扣款</p>
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
    <main style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 8px" }}>結帳</h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 28, fontSize: 13 }}>
        {["填寫資料", "付款", "完成"].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: step > i ? "var(--cz-orange-dark)" : "var(--ink-400)", fontWeight: 700 }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: step > i ? "var(--cz-orange)" : "var(--ink-200)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{i + 1}</span>
            {s}
            {i < 2 && <span style={{ color: "var(--ink-300)" }}>—</span>}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32, alignItems: "flex-start" }}>
        <div style={{ background: "white", borderRadius: "var(--r-lg)", padding: 28, boxShadow: "var(--sh-1)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 18px" }}>收件資訊</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            {[
              { l: "收件人姓名", v: "陳小姐" },
              { l: "電話", v: "0975-691-485" },
              { l: "Email", v: "[email protected]", span: 2 },
              { l: "縣市", v: "桃園市" },
              { l: "區", v: "桃園區" },
              { l: "地址", v: "春日路 818 號 1F", span: 2 },
            ].map((f, i) => (
              <div key={i} style={{ gridColumn: f.span === 2 ? "span 2" : "auto" }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-700)", display: "block", marginBottom: 6 }}>{f.l}</label>
                <input defaultValue={f.v} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid var(--ink-200)", borderRadius: 8, fontSize: 14 }} />
              </div>
            ))}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 18px" }}>付款方式</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { k: "credit", t: "信用卡", s: "Visa / Master / JCB · 6% 回饋", icon: "💳" },
              { k: "line", t: "LINE Pay", s: "推薦 · 額外 3% 回饋", icon: "💚", best: true },
              { k: "atm", t: "ATM 轉帳", s: "3 天內完成", icon: "🏦" },
              { k: "cod", t: "貨到付款", s: "+30 元手續費", icon: "📦" },
            ].map(p => (
              <label key={p.k} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, border: p.k === "line" ? "2px solid var(--line-green)" : "1.5px solid var(--ink-200)", borderRadius: 12, cursor: "pointer", background: p.k === "line" ? "rgba(6,199,85,0.06)" : "white", position: "relative" }}>
                <input type="radio" name="pay" defaultChecked={p.k === "line"} />
                <span style={{ fontSize: 24 }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{p.t} {p.best && <span style={{ background: "var(--line-green)", color: "white", padding: "2px 6px", borderRadius: 4, fontSize: 10, marginLeft: 6 }}>推薦</span>}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{p.s}</div>
                </div>
              </label>
            ))}
          </div>
          <button onClick={placeOrder} className="cz-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 24, padding: 14, fontSize: 15 }}>
            確認下單 (Demo · 不會實際扣款)
          </button>
        </div>

        <aside style={{ background: "white", borderRadius: "var(--r-lg)", padding: 24, boxShadow: "var(--sh-1)", position: "sticky", top: 100 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>訂單摘要</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {cart.map(i => (
              <div key={i.product.id} style={{ display: "flex", gap: 10, fontSize: 13 }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}><ProductImage product={i.product} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{i.product.name}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-500)" }}>x{i.qty}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--cz-orange-dark)" }}>${(i.product.price * i.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--ink-200)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "var(--ink-700)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>小計</span><span>${subtotal.toLocaleString()}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>運費</span><span>{shipping === 0 ? "免費" : `$${shipping}`}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, paddingTop: 8, borderTop: "1px solid var(--ink-100)", color: "var(--ink-900)" }}><span>總計</span><span style={{ color: "var(--cz-orange-dark)" }}>${total.toLocaleString()}</span></div>
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
    <main style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg, #E8F8E8, #D0F0D0)", borderRadius: "var(--r-xl)", padding: 40, textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--green-ok)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 8px 24px rgba(31,154,92,0.3)" }}>
          <Icon.Check width={36} height={36} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>訂單成立！</h1>
        <p style={{ fontSize: 15, color: "var(--ink-700)", margin: "0 0 16px" }}>訂單編號 <b>#{order.id}</b> · {order.date}</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", padding: "10px 18px", borderRadius: "var(--r-pill)", fontSize: 13, color: "var(--line-green-dark)", fontWeight: 700 }}>
          <Icon.Line style={{ width: 16, height: 16 }} /> 訂單通知已推送至 LINE
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "var(--r-lg)", padding: 28, boxShadow: "var(--sh-1)", marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 24px" }}>訂單追蹤</h3>
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
          <div style={{ position: "absolute", top: 18, left: 18, right: 18, height: 3, background: "var(--ink-200)", zIndex: 0 }} />
          <div style={{ position: "absolute", top: 18, left: 18, height: 3, background: "var(--cz-orange)", width: "calc(50% - 18px)", zIndex: 1 }} />
          {stages.map(s => (
            <div key={s.k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 2, position: "relative", flex: 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.done ? "var(--cz-orange)" : "var(--ink-200)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: s.current ? "0 0 0 6px rgba(255,107,44,0.2)" : "none" }}>
                {s.done ? <Icon.Check width={16} height={16} /> : <span style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.done ? "var(--ink-900)" : "var(--ink-400)" }}>{s.t}</div>
              <div style={{ fontSize: 10, color: "var(--ink-500)" }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "var(--r-lg)", padding: 28, boxShadow: "var(--sh-1)", marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>商品明細</h3>
        {order.items.map(i => (
          <div key={i.product.id} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--ink-100)" }}>
            <div style={{ width: 60, height: 60, borderRadius: 10, overflow: "hidden" }}><ProductImage product={i.product} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{i.product.name}</div>
              <div style={{ fontSize: 12, color: "var(--ink-500)" }}>x{i.qty}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--cz-orange-dark)" }}>${(i.product.price * i.qty).toLocaleString()}</div>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, fontSize: 18, fontWeight: 800 }}>
          <span>總計</span>
          <span style={{ color: "var(--cz-orange-dark)" }}>${order.total.toLocaleString()}</span>
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
