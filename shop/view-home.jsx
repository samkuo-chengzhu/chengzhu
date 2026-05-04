// 首頁畫面：Hero + 促銷 + 分類 + 熱銷 + LINE Demo + 評價

const HomeView = ({ onNav, onAddToCart, onProduct }) => {
  const [flashTime, setFlashTime] = useState({ h: 5, m: 23, s: 47 });

  useEffect(() => {
    const t = setInterval(() => {
      setFlashTime(p => {
        let s = p.s - 1, m = p.m, h = p.h;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 5; m = 23; s = 47; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const flashProducts = PRODUCTS.filter(p => p.flash);
  const hotProducts = PRODUCTS.filter(p => p.badge === "熱銷").slice(0, 4);
  const newProducts = PRODUCTS.filter(p => p.badge === "新品").slice(0, 4);
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <main>
      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, #FFE4D6 0%, #FFD3B8 40%, #FFC299 100%)",
        padding: "60px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,181,71,0.4), transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -100, left: -50, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,44,0.3), transparent 70%)" }} />

        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 60, alignItems: "center", position: "relative" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", padding: "6px 14px", borderRadius: "var(--r-pill)", fontSize: 12, fontWeight: 700, color: "var(--cz-orange-dark)", marginBottom: 24, boxShadow: "var(--sh-1)" }}>
              <Icon.Line style={{ width: 14, height: 14, color: "var(--line-green)" }} />
              全台首創 · LINE 內直接結帳
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: 68, fontWeight: 800, lineHeight: 1.05,
              letterSpacing: "-0.03em", color: "var(--ink-900)",
              margin: "0 0 24px",
            }}>
              在 LINE 裡<br/>
              <span style={{
                background: "linear-gradient(135deg, var(--cz-orange), var(--red-hot))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>就能逛街</span>結帳。
            </h1>
            <p style={{ fontSize: 18, lineHeight: 1.7, color: "var(--ink-700)", marginBottom: 32, maxWidth: 480 }}>
              橙築選物 — 不用打開網頁、不用下載 App。直接在 LINE 傳「氣炸鍋」，Bot 主動推送商品卡，一鍵 LIFF 結帳，訂單通知自動推播。
            </p>
            <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
              <button onClick={() => onNav("shop")} className="cz-btn-primary" style={{ fontSize: 16, padding: "16px 28px" }}>
                立即逛逛 <Icon.ChevR />
              </button>
              <button className="cz-btn-line" style={{ fontSize: 16, padding: "16px 28px" }}>
                <Icon.Line /> 加 LINE 享首單 $100
              </button>
            </div>
            <div style={{ display: "flex", gap: 32, fontSize: 13, color: "var(--ink-700)" }}>
              <div><b style={{ fontSize: 22, color: "var(--ink-900)", display: "block" }}>30+</b>精選商品</div>
              <div><b style={{ fontSize: 22, color: "var(--ink-900)", display: "block" }}>3,200+</b>LINE 好友</div>
              <div><b style={{ fontSize: 22, color: "var(--ink-900)", display: "block" }}>4.8★</b>客戶滿意度</div>
            </div>
          </div>

          {/* LINE chat preview */}
          <div style={{
            background: "white", borderRadius: 28,
            padding: 16, boxShadow: "var(--sh-3)",
            transform: "rotate(2deg)", maxWidth: 380, marginLeft: "auto",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -16, right: -12,
              background: "var(--cz-orange)", color: "white",
              padding: "6px 14px", borderRadius: "var(--r-pill)",
              fontSize: 12, fontWeight: 800, transform: "rotate(8deg)",
              boxShadow: "var(--sh-orange)",
            }}>
              ✨ Live Demo
            </div>
            <div style={{ background: "#8FB7D9", borderRadius: 18, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>橙</div>
              <div style={{ color: "white" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>橙築選物</div>
                <div style={{ fontSize: 10, opacity: 0.85 }}>● 線上 · 24h 服務</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ alignSelf: "flex-end", background: "#A0DC51", color: "#1a1410", padding: "8px 12px", borderRadius: "16px 16px 4px 16px", fontSize: 13, maxWidth: "70%" }}>
                氣炸鍋
              </div>
              <div style={{ alignSelf: "flex-start", maxWidth: "85%" }}>
                <div style={{ background: "white", border: "1px solid #eee", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ background: "linear-gradient(135deg, #F5C09A, #E58A4F)", height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🔥</div>
                  <div style={{ padding: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>KINYO 12L 微電腦氣炸鍋</div>
                    <div style={{ fontSize: 14, color: "var(--cz-orange-dark)", fontWeight: 800 }}>$2,680 <span style={{ fontSize: 10, color: "#999", textDecoration: "line-through", fontWeight: 400 }}>$3,680</span></div>
                    <button style={{ width: "100%", marginTop: 8, background: "var(--line-green)", color: "white", padding: 8, borderRadius: 6, fontSize: 12, fontWeight: 700 }}>立即購買</button>
                  </div>
                </div>
              </div>
              <div style={{ alignSelf: "flex-start", background: "white", border: "1px solid #eee", padding: "8px 12px", borderRadius: "16px 16px 16px 4px", fontSize: 12, color: "var(--ink-700)" }}>
                點「立即購買」自動跳到結帳頁 ✨
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section style={{ background: "white", padding: "20px 24px", borderBottom: "1px solid var(--ink-100)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { i: <Icon.Truck />, t: "滿 $499 全館免運", s: "本島不限離島" },
            { i: <Icon.Shield />, t: "信用卡最高 6%", s: "刷卡享回饋" },
            { i: <Icon.Tag />, t: "橙幣最高 8%", s: "下次購物折抵" },
            { i: <Icon.Heart />, t: "會員首單立折 $100", s: "加 LINE 即享" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--cz-orange-light)", color: "var(--cz-orange-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>{b.i}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{b.t}</div>
                <div style={{ fontSize: 11, color: "var(--ink-500)" }}>{b.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLASH SALE */}
      <section style={{ padding: "var(--section-pad-y) 24px", background: "linear-gradient(180deg, #FFF8F0, var(--ink-50))" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                background: "linear-gradient(135deg, var(--red-hot), var(--cz-orange))",
                color: "white", padding: "10px 18px", borderRadius: "var(--r-md)",
                fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em",
                boxShadow: "0 8px 24px rgba(229,48,74,0.3)",
              }}>🔥 閃購倒數</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", fontFamily: "var(--font-mono)" }}>
                {[pad(flashTime.h), pad(flashTime.m), pad(flashTime.s)].map((v, i) => (
                  <React.Fragment key={i}>
                    <div style={{ background: "var(--ink-900)", color: "white", padding: "8px 12px", borderRadius: 8, fontSize: 20, fontWeight: 800, minWidth: 44, textAlign: "center" }}>{v}</div>
                    {i < 2 && <span style={{ color: "var(--ink-700)", fontWeight: 800 }}>:</span>}
                  </React.Fragment>
                ))}
              </div>
              <span style={{ fontSize: 13, color: "var(--ink-500)" }}>每日 0/12/18 點開搶</span>
            </div>
            <button onClick={() => onNav("shop")} className="cz-btn-ghost">查看全部 <Icon.ChevR /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--gap)" }}>
            {flashProducts.map(p => (
              <ProductCard key={p.id} product={p} onAdd={onAddToCart} onClick={() => onProduct(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "20px 24px var(--section-pad-y)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>分類選購</h2>
            <span style={{ color: "var(--ink-500)", fontSize: 14 }}>從家電到生活，一站搞定</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--gap)" }}>
            {[
              { k: "appliance", t: "KINYO 家電", s: "12 件商品", c: "linear-gradient(135deg, #FFD3B8, #FFAA77)", icon: "🏠" },
              { k: "lifestyle", t: "生活選物", s: "10 件商品", c: "linear-gradient(135deg, #E5DCC7, #C9A87C)", icon: "✨" },
              { k: "home_cat", t: "居家用品", s: "10 件商品", c: "linear-gradient(135deg, #D6E8E0, #88B5A0)", icon: "🛋️" },
            ].map(c => (
              <div key={c.k} onClick={() => onNav(c.k)} style={{
                background: c.c, borderRadius: "var(--r-xl)", padding: 32,
                cursor: "pointer", position: "relative", overflow: "hidden",
                aspectRatio: "16/9", display: "flex", flexDirection: "column", justifyContent: "space-between",
                transition: "transform .25s",
              }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{ fontSize: 80, lineHeight: 1, opacity: 0.85 }}>{c.icon}</div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ink-900)", letterSpacing: "-0.02em" }}>{c.t}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-700)", opacity: 0.8, marginTop: 4 }}>{c.s} · 立即選購 →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOT PRODUCTS */}
      <section style={{ padding: "0 24px var(--section-pad-y)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>本週熱銷</h2>
              <p style={{ color: "var(--ink-500)", fontSize: 14, margin: "6px 0 0" }}>3,200+ 位 LINE 好友的選擇</p>
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

      {/* LINE BOT FEATURE */}
      <section style={{
        background: "linear-gradient(135deg, #F0FFF4, #E0F8E8)",
        padding: "var(--section-pad-y) 24px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "white", padding: "6px 14px", borderRadius: "var(--r-pill)", fontSize: 12, fontWeight: 700, color: "var(--line-green-dark)", marginBottom: 20 }}>
              <Icon.Line style={{ width: 14, height: 14 }} />
              LINE Bot × LIFF 整合
            </div>
            <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 20 }}>
              不用打開網頁，<br/>在 LINE 裡也能逛街結帳
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--ink-700)", marginBottom: 28 }}>
              加入官方帳號後,直接傳訊息「氣炸鍋」、「保溫杯」就能收到商品卡;點「立即購買」會自動跳到 LIFF 結帳頁,完成後 Bot 主動推送訂單通知。<b>整套流程不離開 LINE。</b>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
              {[
                { n: "01", t: "Bot 商品卡推送", s: "關鍵字觸發 / 個人化推薦" },
                { n: "02", t: "LIFF 一鍵結帳", s: "免註冊、免輸入、3 秒下單" },
                { n: "03", t: "訂單自動追蹤", s: "出貨、配送、簽收主動通知" },
              ].map(s => (
                <div key={s.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--line-green)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{s.t}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-500)" }}>{s.s}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="cz-btn-line" style={{ fontSize: 15 }}>
              <Icon.Line /> 加 LINE 體驗 Bot
            </button>
          </div>

          {/* Phone mockup with LINE */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 320, background: "#1a1410", borderRadius: 36, padding: 8,
              boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
            }}>
              <div style={{ background: "#F0F0F0", borderRadius: 30, overflow: "hidden", aspectRatio: "9/19" }}>
                {/* LINE header */}
                <div style={{ background: "white", padding: "44px 16px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #eee" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--cz-orange), var(--cz-amber))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800 }}>橙</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>橙築選物</div>
                    <div style={{ fontSize: 10, color: "var(--ink-500)" }}>● 線上</div>
                  </div>
                </div>
                {/* messages */}
                <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ alignSelf: "flex-end", background: "#A0DC51", padding: "6px 12px", borderRadius: "14px 14px 4px 14px", fontSize: 12 }}>保溫杯推薦</div>
                  <div style={{ background: "white", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                    <div style={{ background: "linear-gradient(135deg, #D9E2EC, #5B7C99)", height: 80, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🥤</div>
                    <div style={{ padding: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700 }}>KINYO 不鏽鋼真空保溫杯</div>
                      <div style={{ fontSize: 13, color: "var(--cz-orange-dark)", fontWeight: 800, marginTop: 2 }}>$580</div>
                      <button style={{ width: "100%", marginTop: 6, background: "var(--line-green)", color: "white", padding: 6, borderRadius: 4, fontSize: 11, fontWeight: 700 }}>立即購買</button>
                    </div>
                  </div>
                  <div style={{ alignSelf: "flex-start", background: "white", padding: "6px 10px", borderRadius: "14px 14px 14px 4px", fontSize: 11, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    🎉 訂單 #20260504-A82 已成立<br/>預計 2 天到貨
                  </div>
                </div>
              </div>
            </div>
            {/* Floating chip cards */}
            <div style={{ position: "absolute", top: 40, left: 0, background: "white", padding: "10px 14px", borderRadius: 12, boxShadow: "var(--sh-2)", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, transform: "rotate(-5deg)" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green-ok)" }}></span>
              Bot 平均回應 0.8 秒
            </div>
            <div style={{ position: "absolute", bottom: 60, right: 10, background: "white", padding: "10px 14px", borderRadius: 12, boxShadow: "var(--sh-2)", fontSize: 12, fontWeight: 600, transform: "rotate(4deg)" }}>
              💚 LIFF 一鍵結帳
            </div>
          </div>
        </div>
      </section>

      {/* NEW PRODUCTS */}
      <section style={{ padding: "var(--section-pad-y) 24px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>新品上架</h2>
              <p style={{ color: "var(--ink-500)", fontSize: 14, margin: "6px 0 0" }}>本月精選新品</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--gap)" }}>
            {newProducts.map(p => (
              <ProductCard key={p.id} product={p} onAdd={onAddToCart} onClick={() => onProduct(p)} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "var(--ink-100)", padding: "var(--section-pad-y) 24px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 28px", textAlign: "center" }}>客戶開箱 · 真實評價</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--gap)" }}>
            {[
              { n: "陳小姐", a: "桃園", r: 5, t: "在 LINE 直接買真的太方便了！氣炸鍋下單到收貨只花兩天，包裝也很完整。", p: "氣炸鍋", c: "#FFE4D6" },
              { n: "林先生", a: "新竹", r: 5, t: "Bot 推的商品卡很準，買了保溫杯送同事大家都說讚。橙幣回饋也實用。", p: "保溫杯", c: "#D9E2EC" },
              { n: "王太太", a: "台北", r: 4, t: "客服在 LINE 上回應很快，退換貨也順暢。下次還會再來買。", p: "床包組", c: "#E8E4DC" },
            ].map((r, i) => (
              <div key={i} style={{ background: "white", borderRadius: "var(--r-lg)", padding: 24, boxShadow: "var(--sh-1)" }}>
                <Stars value={r.r} size={16} />
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-700)", margin: "14px 0 20px" }}>「{r.t}」</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: r.c, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--ink-700)" }}>{r.n[0]}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{r.n} · {r.a}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-500)" }}>購買 · {r.p}</div>
                  </div>
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
