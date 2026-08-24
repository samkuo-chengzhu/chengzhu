"""產出橙築國際各頁的 OG 分享圖（1200x630 PNG）。

用網站自己的色票與字體渲染，確保與站上視覺一致。
以本機 Chrome 無頭模式輸出，不需要安裝任何額外套件。
"""
import html
import pathlib
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE / "og"
OUT.mkdir(exist_ok=True)
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# 頁首圖形：與站上 assets/hero-converge.svg 同一份
ART = (pathlib.Path(r"C:\GitHub-Claude\chengzhu\assets\hero-converge.svg")).read_text(encoding="utf-8")

TEMPLATE = """<!DOCTYPE html>
<html lang="zh-TW"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;600&family=Noto+Sans+TC:wght@400;500&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  html, body {{ width:1200px; height:630px; }}
  body {{
    background:#f7f1e6; color:#2b2620; position:relative; overflow:hidden;
    font-family:"Noto Sans TC", sans-serif;
  }}
  .grain {{
    position:absolute; inset:0; opacity:.5; mix-blend-mode:multiply; pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.16 0 0 0 0 0.14 0 0 0 0 0.12 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }}
  .art {{
    position:absolute; right:-150px; top:50%; transform:translateY(-50%); width:700px; opacity:.9;
    -webkit-mask-image:linear-gradient(to right, transparent 6%, #000 42%, #000 100%);
    mask-image:linear-gradient(to right, transparent 6%, #000 42%, #000 100%);
  }}
  .art svg {{ width:100%; height:auto; display:block; }}
  .rule {{ position:absolute; left:78px; top:0; width:64px; height:7px; background:#d8623a; }}
  .wrap {{
    position:absolute; inset:0; padding:78px 78px 178px; display:flex; flex-direction:column;
    justify-content:center; z-index:2;
  }}
  .eyebrow {{
    font-family:"JetBrains Mono", monospace; font-size:19px; font-weight:600;
    letter-spacing:.2em; text-transform:uppercase; color:#c1542f; margin-bottom:24px;
  }}
  h1 {{
    font-family:"Noto Serif TC", serif; font-weight:600; font-size:{size}px;
    line-height:1.32; letter-spacing:-.01em; max-width:{tw}px;
  }}
  .sub {{
    margin-top:26px; font-size:23px; line-height:1.75; color:#5e564a;
    max-width:{sw}px; word-break:keep-all; line-break:strict;
  }}
  .stats {{ margin-top:30px; display:flex; gap:38px; }}
  .stat .v {{
    font-family:"JetBrains Mono", monospace; font-size:33px; font-weight:600;
    color:#d8623a; line-height:1.1; font-variant-numeric:tabular-nums;
  }}
  .stat .l {{ font-size:15px; color:#5e564a; margin-top:6px; }}
  .foot {{
    position:absolute; left:78px; right:78px; bottom:56px; z-index:2;
    display:flex; align-items:flex-end; justify-content:space-between;
    padding-top:24px; border-top:1px solid #ded2ba;
  }}
  .brand {{ font-family:"Noto Serif TC", serif; font-size:26px; font-weight:600; }}
  .brand .dot {{ color:#d8623a; }}
  .brand .en {{
    display:block; margin-top:7px; font-family:"JetBrains Mono", monospace;
    font-size:14px; letter-spacing:.22em; color:#8a8071; font-weight:500;
  }}
  .url {{
    font-family:"JetBrains Mono", monospace; font-size:20px; font-weight:500; color:#c1542f;
  }}
</style></head>
<body>
  <div class="art">{art}</div>
  <div class="grain"></div>
  <div class="rule"></div>
  <div class="wrap">
    <div class="eyebrow">{eyebrow}</div>
    <h1>{title}</h1>
    {subblock}
    {statblock}
  </div>
  <div class="foot">
    <div class="brand">橙築<span class="dot">.</span> 國際<span class="en">CHENGZHU INTERNATIONAL</span></div>
    <div class="url">chengzhu.co</div>
  </div>
</body></html>
"""

# name, eyebrow, title(可含 <br>), sub, stats[(值,標籤)], 標題字級, 標題寬, 副標寬
PAGES = [
    ("home", "ChengZhu Digital", "我們交付的系統，<br>此刻正在客戶的<br>營運現場跑。", "",
     [("29", "支後端服務"), ("1,858", "筆料件"), ("2,000+", "商品查價"), ("5", "個互動 Demo")], 60, 640, 560),
    ("solutions", "Solutions", "不是再多一套工具，<br>而是一套能一起運作的系統。",
     "網站 · ERP · CRM · POS · LINE · 資料自動化", [], 52, 660, 560),
    ("industries", "Industries", "懂系統，<br>也懂產業怎麼運作。",
     "高爾夫 · 車業與進口 · 零售與 3C 通路 · 美業與預約型服務", [], 58, 620, 540),
    ("demos", "Try It Yourself", "不用相信我們，<br>自己點點看。",
     "五個可以直接操作的實際流程，打開就能走完一次。", [], 62, 600, 520),
    ("case", "Selected Work", "已經在跑的系統。",
     "六個實際交付、目前仍在營運現場運行的專案。數字與技術細節都是真的。", [], 66, 620, 540),
    ("case-golf-studio", "Case Study", "從分散作業，<br>到一套完整的營運系統。",
     "會員 · Fitting 工單 · 工坊派工 · 掃碼庫存 · 教學堂數",
     [("1,858", "筆料件"), ("29", "支後端服務"), ("7", "人團隊每天使用")], 52, 640, 660),
    ("assessment", "Digital Checkup", "五分鐘，<br>找出流程斷在哪裡。",
     "勾選符合現況的項目就好。不需要填表，不需要留信箱。", [], 60, 600, 520),
    ("contact", "Contact", "想先解決哪一個<br>營運問題？",
     "桃園市桃園區春日路 818 號 1F　·　初次諮詢免費", [], 62, 600, 560),
    ("appliances", "KINYO 授權經銷商", "企業禮贈品，<br>一次採購到位。",
     "尾牙抽獎 · 股東會紀念品 · 員工三節福利 · 三聯式發票", [], 60, 600, 540),
    ("solutions-salon", "Salon & Beauty", "客人用 LINE 預約。<br>你用 LINE 管整間店。",
     "預約 · 設計師排班 · 營收拆帳 · 休假自動擋預約", [], 54, 640, 540),
    ("solutions-coach", "Coaching & Lessons", "學員用 LINE 預約。<br>你用 LINE 管所有課。",
     "LIFF 預約 · 一鍵核准 · 堂數自動扣 · 到期提醒", [], 54, 640, 540),
    ("solutions-community", "Community Signup", "群組接龍報名？<br>換成一鍵搞定。",
     "一鍵報名 · 候補自動遞補 · 同組管理 · 自動分組", [], 58, 600, 540),
    ("solutions-enterprise", "Enterprise Automation", "你公司最煩的那段流程，<br>用 LINE + AI 自動化掉。",
     "查價 · 下單 · 追蹤 · 簽核 · 通知 · 報表", [], 50, 660, 540),
]


def build(name, eyebrow, title, sub, stats, size, tw, sw):
    subblock = f'<div class="sub">{sub}</div>' if sub else ""
    if stats:
        items = "".join(
            f'<div class="stat"><div class="v">{html.escape(v)}</div>'
            f'<div class="l">{html.escape(l)}</div></div>'
            for v, l in stats
        )
        statblock = f'<div class="stats">{items}</div>'
    else:
        statblock = ""
    page = TEMPLATE.format(art=ART, eyebrow=html.escape(eyebrow), title=title,
                           subblock=subblock, statblock=statblock,
                           size=size, tw=tw, sw=sw)
    src = OUT / f"{name}.html"
    src.write_text(page, encoding="utf-8")

    png = OUT / f"{name}.png"
    if png.exists():
        png.unlink()
    subprocess.run([
        CHROME, "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
        f"--screenshot={png}", "--window-size=1200,630",
        "--virtual-time-budget=9000", "--force-device-scale-factor=1",
        src.as_uri(),
    ], capture_output=True, timeout=90)
    return png


ok, bad = [], []
for row in PAGES:
    p = build(*row)
    if p.exists() and p.stat().st_size > 8000:
        ok.append(f"{p.name}  {p.stat().st_size // 1024} KB")
    else:
        bad.append(p.name)

print(f"成功 {len(ok)} / {len(PAGES)}")
for line in ok:
    print("  " + line)
if bad:
    print("失敗：" + ", ".join(bad))
    sys.exit(1)
