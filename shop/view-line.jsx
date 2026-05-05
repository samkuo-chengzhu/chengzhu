// LIFF 結帳 Mock + LINE Bot 對話 Mock (in iPhone frame)

const LiffView = ({ cart, onNav, setOrder }) => {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = subtotal + (subtotal >= 499 ? 0 : 80);

  const placeOrder = () => {
    setOrder({ id: "20260504-A82C", items: cart, total, shipping: subtotal >= 499 ? 0 : 80, subtotal, date: "2026/05/04 14:32" });
    onNav("orderdone");
  };

  return (
    <main style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <div className="cz-eyebrow" style={{ marginBottom: 10 }}>LIFF · LINE Front-end Framework</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, letterSpacing: "-0.015em", margin: "0 0 8px", color: "var(--ink-900)" }}>LIFF 一鍵結帳</h1>
        <p style={{ fontSize: 14, color: "var(--ink-500)", margin: 0 }}>在 LINE 內開啟 LIFF 結帳頁,免註冊、免輸入,3 秒下單。</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 48, alignItems: "flex-start" }}>
        {/* Phone */}
        <div style={{ width: 360, background: "#1a1410", borderRadius: 44, padding: 10, boxShadow: "0 30px 60px rgba(0,0,0,0.2)", margin: "0 auto" }}>
          <div style={{ background: "white", borderRadius: 36, overflow: "hidden", aspectRatio: "9/19.5", position: "relative" }}>
            {/* status */}
            <div style={{ height: 38, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", fontSize: 13, fontWeight: 700 }}>
              <span>9:41</span>
              <span style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 100, height: 24, background: "#1a1410", borderRadius: 12 }}></span>
              <span>● ●</span>
            </div>
            {/* LIFF header */}
            <div style={{ background: "var(--line-green)", color: "white", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <Icon.ChevL />
              <Icon.Line style={{ width: 16, height: 16 }} />
              <div style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>橙築選物 LIFF</div>
              <span style={{ fontSize: 11 }}>關閉</span>
            </div>
            {/* content */}
            <div style={{ padding: 16, overflowY: "auto", height: "calc(100% - 92px)" }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>確認訂單</div>
              {cart.slice(0, 2).map(i => (
                <div key={i.product.id} style={{ display: "flex", gap: 10, padding: 10, background: "var(--ink-50)", borderRadius: 10, marginBottom: 8 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 8, overflow: "hidden" }}><ProductImage product={i.product} /></div>
                  <div style={{ flex: 1, fontSize: 11 }}>
                    <div style={{ fontWeight: 700, lineHeight: 1.3 }}>{i.product.name}</div>
                    <div style={{ color: "var(--ink-500)", marginTop: 2 }}>x{i.qty}</div>
                    <div style={{ color: "var(--cz-orange-dark)", fontWeight: 800, marginTop: 2 }}>${i.product.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8 }}>收件資訊</div>
                <div style={{ background: "var(--ink-50)", borderRadius: 10, padding: 10, fontSize: 11, color: "var(--ink-700)", lineHeight: 1.6 }}>
                  陳小姐 · 0975-691-485<br/>
                  桃園市桃園區春日路 818 號 1F
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8 }}>付款方式</div>
                <div style={{ background: "rgba(6,199,85,0.1)", border: "1.5px solid var(--line-green)", borderRadius: 10, padding: 10, fontSize: 11, fontWeight: 700, color: "var(--line-green-dark)", display: "flex", alignItems: "center", gap: 8 }}>
                  💚 LINE Pay <span style={{ marginLeft: "auto", fontSize: 10 }}>已綁定</span>
                </div>
              </div>

              <div style={{ marginTop: 14, padding: 12, background: "var(--ink-50)", border: "1px solid var(--ink-200)", borderRadius: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-700)", marginBottom: 4 }}><span>小計</span><span>NT$ {subtotal.toLocaleString()}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-700)", marginBottom: 4 }}><span>運費</span><span>{subtotal >= 499 ? "免費" : "NT$ 80"}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, color: "var(--ink-900)", paddingTop: 6, borderTop: "1px solid var(--ink-200)", marginTop: 4 }}><span>總計</span><span style={{ color: "var(--cz-orange)" }}>NT$ {total.toLocaleString()}</span></div>
              </div>

              <button onClick={placeOrder} style={{ width: "100%", marginTop: 14, background: "var(--line-green)", color: "white", padding: 14, borderRadius: 6, fontSize: 14, fontWeight: 600, letterSpacing: "0.04em" }}>
                確認付款 NT$ {total.toLocaleString()}
              </button>
              <p style={{ fontSize: 9, color: "var(--ink-400)", textAlign: "center", marginTop: 8 }}>點擊即表示同意服務條款 · Demo 不會實際扣款</p>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-0.015em", margin: "0 0 18px", lineHeight: 1.25, color: "var(--ink-900)" }}>從 LINE 對話直達結帳,<br/>不需要打開瀏覽器</h2>
          <p style={{ fontSize: 15, color: "var(--ink-700)", lineHeight: 1.85, marginBottom: 28 }}>
            LIFF 是 LINE 官方的 Web 應用框架。整套商城頁面嵌入 LINE 內,自動取得使用者資訊、LINE Pay 已綁定。客戶無需註冊帳號、無需填寫地址 (從 LINE Profile 帶入)、無需重新輸入信用卡 (LINE Pay 直接付) — <b style={{ color: "var(--ink-900)" }}>真正的 3 秒下單</b>。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            {[
              { t: "免註冊", d: "LINE 帳號即會員" },
              { t: "免輸入", d: "從 Profile 帶入" },
              { t: "免綁卡", d: "LINE Pay 直接付" },
              { t: "原生通知", d: "Bot 主動推送" },
            ].map(x => (
              <div key={x.t} style={{ background: "white", padding: 18, border: "1px solid var(--ink-200)" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "var(--cz-sage)" }}><Icon.Check width={14} height={14} /></span> {x.t}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{x.d}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--ink-900)", color: "white", padding: 20, fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.85 }}>
            <div style={{ color: "var(--cz-amber)", marginBottom: 6 }}>// LIFF 整合範例</div>
            <div><span style={{ color: "#7CC8FF" }}>liff</span>.init(&#123; liffId: <span style={{ color: "#A0DC51" }}>"2006xxxxxx-xxxxx"</span> &#125;);</div>
            <div><span style={{ color: "#7CC8FF" }}>const</span> profile = <span style={{ color: "#7CC8FF" }}>await</span> liff.<span style={{ color: "#FFD93D" }}>getProfile</span>();</div>
            <div><span style={{ color: "#7CC8FF" }}>const</span> pay = <span style={{ color: "#7CC8FF" }}>await</span> linePay.<span style={{ color: "#FFD93D" }}>request</span>(&#123; total &#125;);</div>
          </div>
        </div>
      </div>
    </main>
  );
};

// LINE Bot 對話 demo
const BotView = ({ onNav }) => {
  const messages = [
    { from: "user", t: "氣炸鍋" },
    { from: "bot", type: "products", items: PRODUCTS.filter(p => p.id === "ar-2018").concat(PRODUCTS.filter(p => p.id === "kc-coffee").slice(0, 1)) },
    { from: "bot", t: "為您推薦以上熱銷商品 🔥 點「立即購買」即可在 LINE 內直接結帳" },
    { from: "user", t: "查詢訂單" },
    { from: "bot", type: "order" },
    { from: "user", t: "我的橙幣" },
    { from: "bot", type: "points" },
  ];

  return (
    <main style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <div className="cz-eyebrow" style={{ marginBottom: 10 }}>LINE Bot · Conversational Commerce</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, letterSpacing: "-0.015em", margin: "0 0 8px", color: "var(--ink-900)" }}>Bot 對話 Demo</h1>
        <p style={{ fontSize: 14, color: "var(--ink-500)", margin: 0 }}>關鍵字觸發商品卡、訂單查詢、會員資訊 — 24 小時自動服務。</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 48, alignItems: "flex-start" }}>
        <div style={{ width: 360, background: "#1a1410", borderRadius: 44, padding: 10, boxShadow: "0 30px 60px rgba(0,0,0,0.2)" }}>
          <div style={{ background: "#8FB7D9", borderRadius: 36, overflow: "hidden", aspectRatio: "9/19.5", position: "relative" }}>
            <div style={{ height: 38, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", fontSize: 13, fontWeight: 700, color: "white" }}>
              <span>9:41</span>
              <span>● ●</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.95)", padding: "8px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <Icon.ChevL />
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--ink-900)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}>橙</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>橙築選物</div>
                <div style={{ fontSize: 9, color: "var(--ink-500)" }}>● 線上 · 24h 服務</div>
              </div>
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, height: "calc(100% - 88px)", overflowY: "auto" }}>
              {messages.map((m, i) => {
                if (m.from === "user") return (
                  <div key={i} style={{ alignSelf: "flex-end", background: "#A0DC51", color: "#1a1410", padding: "6px 12px", borderRadius: "14px 14px 4px 14px", fontSize: 12, maxWidth: "75%" }}>{m.t}</div>
                );
                if (m.type === "products") return (
                  <div key={i} style={{ alignSelf: "flex-start", display: "flex", gap: 6, overflowX: "auto", maxWidth: "92%" }}>
                    {m.items.map(p => (
                      <div key={p.id} style={{ background: "white", borderRadius: 10, overflow: "hidden", width: 130, flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
                        <div style={{ height: 70, background: `linear-gradient(135deg, ${p.color}, ${p.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>{p.icon}</div>
                        <div style={{ padding: 8 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.3, height: 26, overflow: "hidden" }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: "var(--cz-orange-dark)", fontWeight: 800, marginTop: 4 }}>${p.price.toLocaleString()}</div>
                          <button style={{ width: "100%", marginTop: 4, background: "var(--line-green)", color: "white", padding: 5, borderRadius: 4, fontSize: 9, fontWeight: 700 }}>立即購買</button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
                if (m.type === "order") return (
                  <div key={i} style={{ alignSelf: "flex-start", background: "white", borderRadius: 10, padding: 10, fontSize: 11, maxWidth: "85%", boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontWeight: 800, marginBottom: 6 }}>📦 您的訂單</div>
                    <div style={{ borderTop: "1px solid #eee", paddingTop: 6, lineHeight: 1.7 }}>
                      <div>#20260504-A82C · <span style={{ color: "var(--cz-orange-dark)", fontWeight: 700 }}>配送中</span></div>
                      <div style={{ color: "var(--ink-500)", fontSize: 10 }}>2 件商品 · $3,260</div>
                      <div style={{ color: "var(--ink-500)", fontSize: 10 }}>預計 5/6 到貨</div>
                    </div>
                  </div>
                );
                if (m.type === "points") return (
                  <div key={i} style={{ alignSelf: "flex-start", background: "var(--cz-orange-light)", border: "1px solid var(--ink-200)", borderRadius: 8, padding: 12, fontSize: 11, maxWidth: "85%" }}>
                    <div className="cz-eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>會員等級 · 黃金</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--cz-orange)", margin: "4px 0", letterSpacing: "-0.01em" }}>1,248 橙幣</div>
                    <div style={{ fontSize: 10, color: "var(--ink-700)", letterSpacing: "0.04em" }}>可折抵 $1,248 · 升級 VIP 還差 $852</div>
                  </div>
                );
                return <div key={i} style={{ alignSelf: "flex-start", background: "white", padding: "6px 10px", borderRadius: "14px 14px 14px 4px", fontSize: 11, maxWidth: "80%" }}>{m.t}</div>;
              })}
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "white", padding: 10, display: "flex", gap: 6, alignItems: "center", borderTop: "1px solid #eee" }}>
              <span style={{ fontSize: 18 }}>＋</span>
              <div style={{ flex: 1, background: "var(--ink-100)", borderRadius: 18, padding: "6px 12px", fontSize: 11, color: "var(--ink-400)" }}>輸入訊息...</div>
              <span style={{ fontSize: 18 }}>😊</span>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 14px", lineHeight: 1.2 }}>Bot 商品卡 · 個人化推薦 · 24h 自動服務</h2>
          <p style={{ fontSize: 14, color: "var(--ink-700)", lineHeight: 1.8, marginBottom: 24 }}>
            客戶在 LINE 對話中傳關鍵字、查詢訂單、查橙幣餘額——Bot 立即回應，無需排隊等客服。整合 OpenAI / Claude，能理解模糊查詢、推薦相似商品。
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
            {[
              { c: "👤 用戶", t: "保溫杯 500ml 不鏽鋼", o: "→ Bot 推送 KINYO 保溫杯商品卡" },
              { c: "👤 用戶", t: "我的訂單到哪了？", o: "→ Bot 回覆即時物流狀態" },
              { c: "👤 用戶", t: "送女朋友禮物推薦", o: "→ Bot 推薦生活選物熱銷商品" },
              { c: "👤 用戶", t: "我的橙幣", o: "→ Bot 顯示會員等級與餘額" },
            ].map((x, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", background: "white", padding: 14, borderRadius: 12, boxShadow: "var(--sh-1)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "var(--ink-400)", fontWeight: 700, marginBottom: 2 }}>{x.c}</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>「{x.t}」</div>
                </div>
                <div style={{ fontSize: 12, color: "var(--line-green-dark)", fontWeight: 700, background: "rgba(6,199,85,0.08)", padding: "6px 12px", borderRadius: 8 }}>{x.o}</div>
              </div>
            ))}
          </div>

          <button className="cz-btn-line" style={{ fontSize: 15, padding: "12px 24px" }}><Icon.Line /> 加 @616wvceo 體驗 Bot</button>
        </div>
      </div>
    </main>
  );
};

window.LiffView = LiffView;
window.BotView = BotView;
