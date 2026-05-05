// 首頁畫面：Hero + Trust + Editor's Pick + Categories + Hot + LINE Demo + New + Testimonials
// Refined: clean / premium / golf-boutique aesthetic — minimal decoration, generous whitespace

const HomeView = ({ onNav, onAddToCart, onProduct }) => {
  const editorPicks = PRODUCTS.filter(p => p.flash);
  const hotProducts = PRODUCTS.filter(p => p.badge === "熱銷").slice(0, 4);
  const newProducts = PRODUCTS.filter(p => p.badge === "新品").slice(0, 4);

  return (
    <main>
      {/* === HERO === */}
      <section style={{
        background: "var(--ink-50)",
        padding: "112px 24px 96px",
        borderBottom: "1px solid var(--ink-200)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="cz-eyebrow" style={{ marginBottom: 28 }}>ChengZhu Selection · 橙築選物</div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 5vw, 60px)",
              fontWeight: 600, lineHeight: 1.18,
              letterSpacing: "-0.015em",
              color: "var(--ink-900)",
              margin: "0 0 28px",
            }}>
              不打開網頁，<br/>
              在 LINE 裡<span style={{ color: "var(--cz-orange)" }}>就能逛街</span>。
            </h1>
            <p style={{
              fontSize: 17, lineHeight: 1.85, color: "var(--ink-700)",
              marginBottom: 40, maxWidth: 480, fontWeight: 400,
            }}>
              橙築精選 30 款好物。傳訊息、加購、結帳、追蹤訂單,<br/>
              整套流程不離開 LINE — 為精緻零售而生的數位櫥窗。
            </p>
            <div style={{ display: "flex", gap: 12, marginBottom: 56 }}>
              <button onClick={() => onNav("shop")} className="cz-btn-primary">
                探索選物
              </button>
              <button className="cz-btn-ghost">
                <Icon.Line style={{ width: 14, height: 14 }} /> 加入官方帳號
              </button>
            </div>
            <div style={{ display: "flex", gap: 48, paddingTop: 28, borderTop: "1px solid var(--ink-200)" }}>
              {[
                { n: "30", l: "嚴選商品" },
                { n: "3,200+", l: "VIP 客戶" },
                { n: "4.8", l: "平均評分" },
              ].map((x, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.01em" }}>{x.n}</div>
                  <div className="cz-eyebrow" style={{ marginTop: 4 }}>{x.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* LINE chat preview — refined, no rotation */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 360, background: "white", borderRadius: 16,
              padding: 20, border: "1px solid var(--ink-200)",
              boxShadow: "var(--sh-3)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 14, borderBottom: "1px solid var(--ink-200)", marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--ink-900)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16 }}>橙</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>橙築選物 · LINE 官方帳號</div>
                  <div style={{ fontSize: 11, color: "var(--ink-500)", marginTop: 2 }}><span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--green-ok)", marginRight: 6, verticalAlign: "middle" }}></span>線上 · 24h 服務</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ alignSelf: "flex-end", background: "var(--ink-100)", color: "var(--ink-900)", padding: "8px 14px", borderRadius: "10px 10px 2px 10px", fontSize: 13, maxWidth: "70%" }}>
                  氣炸鍋
                </div>
                <div style={{ alignSelf: "flex-start", maxWidth: "85%" }}>
                  <div style={{ background: "white", border: "1px solid var(--ink-200)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ background: "var(--ink-100)", height: 110, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "var(--ink-500)" }}>🔥</div>
                    <div style={{ padding: 14 }}>
                      <div className="cz-eyebrow" style={{ marginBottom: 6 }}>KINYO 家電</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 }}>12L 微電腦氣炸鍋</div>
                      <div style={{ fontSize: 14, color: "var(--ink-900)", fontWeight: 600, marginBottom: 10 }}>
                        NT$ 2,680
                        <span style={{ fontSize: 11, color: "var(--ink-400)", textDecoration: "line-through", fontWeight: 400, marginLeft: 6 }}>$3,680</span>
                      </div>
                      <button style={{ width: "100%", background: "var(--ink-900)", color: "white", padding: 8, borderRadius: 4, fontSize: 12, fontWeight: 600, letterSpacing: "0.04em" }}>立即購買 →</button>
                    </div>
                  </div>
                </div>
                <div style={{ alignSelf: "flex-start", background: "var(--ink-100)", padding: "8px 12px", borderRadius: "10px 10px 10px 2px", fontSize: 12, color: "var(--ink-700)", maxWidth: "85%" }}>
                  點「立即購買」直接在 LINE 內結帳
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === TRUST BAR === */}
      <section style={{ background: "white", padding: "32px 24px", borderBottom: "1px solid var(--ink-200)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[
            { i: <Icon.Truck />, t: "滿 $499 全館免運", s: "本島不限離島" },
            { i: <Icon.Shield />, t: "信用卡最高 6%", s: "刷卡享回饋" },
            { i: <Icon.Tag />, t: "橙幣最高 8%", s: "下次購物折抵" },
            { i: <Icon.Heart />, t: "首單立折 $100", s: "加 LINE 即享" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 38, height: 38, color: "var(--ink-700)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{b.i}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{b.t}</div>
                <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{b.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* === EDITOR'S PICK (replaces flash sale countdown) === */}
      <section style={{ padding: "var(--section-pad-y) 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
            <div>
              <div className="cz-eyebrow" style={{ marginBottom: 12 }}>Editor's Pick · 編輯精選</div>
              <h2 className="cz-section-title">本月推薦</h2>
              <p style={{ color: "var(--ink-500)", fontSize: 14, margin: "10px 0 0", maxWidth: 520, lineHeight: 1.7 }}>
                編輯團隊從 30 款選物中挑出 4 件本月最值得入手的好物。
              </p>
            </div>
            <button onClick={() => onNav("shop")} className="cz-btn-ghost">查看全部 <Icon.ChevR /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--gap)" }}>
            {editorPicks.map(p => (
              <ProductCard key={p.id} product={p} onAdd={onAddToCart} onClick={() => onProduct(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* === CATEGORIES === */}
      <section style={{ padding: "0 24px var(--section-pad-y)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <div className="cz-eyebrow" style={{ marginBottom: 12 }}>Categories · 分類選購</div>
            <h2 className="cz-section-title">三大選物方向</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--gap)" }}>
            {[
              { k: "appliance", t: "KINYO 家電", en: "APPLIANCES", s: "12 件商品", bg: "var(--cz-orange-light)", accent: "var(--cz-orange)" },
              { k: "lifestyle", t: "生活選物", en: "LIFESTYLE", s: "10 件商品", bg: "var(--ink-100)", accent: "var(--cz-amber)" },
              { k: "home_cat", t: "居家用品", en: "HOME", s: "10 件商品", bg: "var(--cz-sage-light)", accent: "var(--cz-sage)" },
            ].map(c => (
              <div key={c.k} onClick={() => onNav(c.k)} style={{
                background: c.bg, padding: 36,
                cursor: "pointer", position: "relative",
                aspectRatio: "4/3", display: "flex", flexDirection: "column", justifyContent: "space-between",
                border: "1px solid var(--ink-200)",
                borderRadius: "var(--r-md)",
                transition: "border-color .2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--ink-900)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--ink-200)"}>
                <div className="cz-eyebrow" style={{ color: c.accent }}>{c.en}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 600, color: "var(--ink-900)", letterSpacing: "-0.01em", marginBottom: 8 }}>{c.t}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-500)", display: "flex", alignItems: "center", gap: 6 }}>{c.s} <Icon.ChevR style={{ width: 12, height: 12 }} /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === HOT PRODUCTS === */}
      <section style={{ padding: "0 24px var(--section-pad-y)", background: "var(--ink-100)", paddingTop: "var(--section-pad-y)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
            <div>
              <div className="cz-eyebrow" style={{ marginBottom: 12 }}>Bestsellers · 本週熱銷</div>
              <h2 className="cz-section-title">最受歡迎</h2>
              <p style={{ color: "var(--ink-500)", fontSize: 14, margin: "10px 0 0" }}>3,200+ 位 LINE 好友的選擇</p>
            </div>
            <button onClick={() => onNav("shop")} className="cz-btn-ghost">看更多 <Icon.ChevR /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--gap)" }}>
            {hotProducts.map(p => (
              <ProductCard key={p.id} product={p} onAdd={onAddToCart} onClick={() => onProduct(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* === LINE BOT FEATURE === */}
      <section style={{
        background: "var(--cz-sage-light)",
        padding: "var(--section-pad-y) 24px",
        borderTop: "1px solid var(--ink-200)",
        borderBottom: "1px solid var(--ink-200)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="cz-eyebrow" style={{ marginBottom: 16, color: "var(--cz-sage)" }}>LINE Bot × LIFF</div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 44px)",
              fontWeight: 600, letterSpacing: "-0.015em",
              lineHeight: 1.2,
              margin: "0 0 24px",
            }}>
              不用打開網頁,<br/>在 LINE 裡也能逛街結帳
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "var(--ink-700)", marginBottom: 36 }}>
              加入官方帳號後,直接傳訊息「氣炸鍋」、「保溫杯」就能收到商品卡;點「立即購買」會自動跳到 LIFF 結帳頁,完成後 Bot 主動推送訂單通知。<br/><br/>
              <span style={{ color: "var(--ink-900)", fontWeight: 600 }}>整套流程不離開 LINE。</span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 36 }}>
              {[
                { n: "01", t: "Bot 商品卡推送", s: "關鍵字觸發 · 個人化推薦" },
                { n: "02", t: "LIFF 一鍵結帳", s: "免註冊 · 免輸入 · 3 秒下單" },
                { n: "03", t: "訂單自動追蹤", s: "出貨 · 配送 · 簽收主動通知" },
              ].map(s => (
                <div key={s.n} style={{ display: "flex", gap: 18, alignItems: "flex-start", paddingBottom: 18, borderBottom: "1px solid rgba(31,26,20,0.08)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--cz-sage)", flexShrink: 0, lineHeight: 1, paddingTop: 4 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{s.t}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-500)" }}>{s.s}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="cz-btn-line" style={{ background: "var(--cz-sage)", boxShadow: "none" }} onMouseEnter={e => e.currentTarget.style.background = "var(--ink-900)"} onMouseLeave={e => e.currentTarget.style.background = "var(--cz-sage)"}>
              <Icon.Line style={{ width: 14, height: 14 }} /> 加 LINE 體驗 Bot
            </button>
          </div>

          {/* Phone mockup with LINE — simplified, no rotation/floating chips */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 320, background: "var(--ink-900)", borderRadius: 36, padding: 8,
              boxShadow: "var(--sh-3)",
            }}>
              <div style={{ background: "var(--ink-50)", borderRadius: 30, overflow: "hidden", aspectRatio: "9/19" }}>
                <div style={{ background: "white", padding: "44px 16px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--ink-200)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--ink-900)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16 }}>橙</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>橙築選物</div>
                    <div style={{ fontSize: 10, color: "var(--ink-500)" }}><span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "var(--green-ok)", marginRight: 5, verticalAlign: "middle" }}></span>線上</div>
                  </div>
                </div>
                <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ alignSelf: "flex-end", background: "var(--ink-100)", padding: "6px 12px", borderRadius: "10px 10px 2px 10px", fontSize: 12 }}>保溫杯推薦</div>
                  <div style={{ background: "white", borderRadius: 8, overflow: "hidden", border: "1px solid var(--ink-200)" }}>
                    <div style={{ background: "var(--ink-100)", height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "var(--ink-500)" }}>🥤</div>
                    <div style={{ padding: 12 }}>
                      <div className="cz-eyebrow" style={{ marginBottom: 4, fontSize: 9 }}>KINYO 家電</div>
                      <div style={{ fontSize: 11, fontWeight: 600 }}>不鏽鋼真空保溫杯</div>
                      <div style={{ fontSize: 13, color: "var(--ink-900)", fontWeight: 600, marginTop: 6 }}>NT$ 580</div>
                      <button style={{ width: "100%", marginTop: 8, background: "var(--ink-900)", color: "white", padding: 7, borderRadius: 3, fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }}>立即購買 →</button>
                    </div>
                  </div>
                  <div style={{ alignSelf: "flex-start", background: "white", padding: "6px 10px", borderRadius: "10px 10px 10px 2px", fontSize: 11, border: "1px solid var(--ink-200)" }}>
                    訂單 #20260504-A82 已成立<br/>預計 2 天到貨
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === NEW PRODUCTS === */}
      <section style={{ padding: "var(--section-pad-y) 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
            <div>
              <div className="cz-eyebrow" style={{ marginBottom: 12 }}>New Arrivals · 新品上架</div>
              <h2 className="cz-section-title">本月新品</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--gap)" }}>
            {newProducts.map(p => (
              <ProductCard key={p.id} product={p} onAdd={onAddToCart} onClick={() => onProduct(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section style={{ background: "var(--ink-100)", padding: "var(--section-pad-y) 24px", borderTop: "1px solid var(--ink-200)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="cz-eyebrow" style={{ marginBottom: 12 }}>Customer Voices · 客戶開箱</div>
            <h2 className="cz-section-title" style={{ display: "inline-block" }}>真實評價</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--gap)" }}>
            {[
              { n: "陳小姐", a: "桃園", r: 5, t: "在 LINE 直接買真的太方便了。氣炸鍋下單到收貨只花兩天,包裝完整,品質好。", p: "氣炸鍋" },
              { n: "林先生", a: "新竹", r: 5, t: "Bot 推的商品卡很準,買了保溫杯送同事大家都說讚。橙幣回饋也實用。", p: "保溫杯" },
              { n: "王太太", a: "台北", r: 4, t: "客服在 LINE 上回應很快,退換貨也順暢。下次還會再來買。", p: "床包組" },
            ].map((r, i) => (
              <div key={i} style={{ background: "white", padding: 32, border: "1px solid var(--ink-200)" }}>
                <Stars value={r.r} size={14} />
                <p style={{ fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1.75, color: "var(--ink-700)", margin: "20px 0 28px", fontWeight: 400 }}>「{r.t}」</p>
                <div style={{ paddingTop: 20, borderTop: "1px solid var(--ink-200)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.n} · {r.a}</div>
                  <div className="cz-eyebrow">購買 {r.p}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

window.HomeView = HomeView;
