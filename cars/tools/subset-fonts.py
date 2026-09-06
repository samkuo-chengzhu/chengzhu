#!/usr/bin/env python3
"""
產生公開官網（site/）專用的 IBM Plex Sans TC 子集字型。

用法：
    npm run build --prefix site      # 先建置，dist/ 內才有真實車輛資料
    python tools/subset-fonts.py

字元來源：
1. site/dist 的建置產出（含 D1 來的車款、車色、規格等動態文字）
2. 線上公開車源 API（涵蓋尚未建置進去的新車資料）
3. 基本 ASCII 與中文標點（見 ALWAYS）

新增車輛若出現子集外的字，該字會掉到後備字型（Noto Sans TC / PingFang TC），
不會破版；重跑本腳本即可補上。

需要 fontTools：pip install fonttools brotli
"""
import os
import re
import glob
import sys
import json
import tempfile
import urllib.request

# Windows 主控台預設 cp950，印不出部分符號；統一以 UTF-8 輸出。
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "site", "dist")
OUT_DIR = os.path.join(ROOT, "site", "public", "fonts")
CACHE = os.path.join(tempfile.gettempdir(), "plex-tc-src")
BASE_URL = "https://unpkg.com/@ibm/plex-sans-tc@1.1.1/fonts/complete/woff2/hinted"
API_URL = "https://cars.chengzhu.co/api/cars"
WEIGHTS = ["Regular", "Medium", "SemiBold", "Bold"]

ALWAYS = (
    "".join(chr(c) for c in range(0x20, 0x7F))
    + "　、。〈〉《》「」『』【】〔〕——…‧・"
    + "±×÷≈≠≤≥°′″※§©®™←↑→↓✔✓"
    + "‘’“”–—‰€£¥¢"
    + "０１２３４５６７８９"
)


def from_dist():
    chars = set()
    files = glob.glob(os.path.join(DIST, "**", "*.html"), recursive=True)
    for path in files:
        t = open(path, encoding="utf-8", errors="ignore").read()
        t = re.sub(r"<script.*?</script>", " ", t, flags=re.S | re.I)
        t = re.sub(r"<style.*?</style>", " ", t, flags=re.S | re.I)
        t = re.sub(r"<[^>]+>", " ", t)
        chars |= set(t)
    return files, chars


def from_api():
    chars = set()
    req = urllib.request.Request(API_URL, headers={
        "User-Agent": "chengzhu-cars-subset/1.0",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            data = json.load(r)
    except Exception as exc:
        print("  （略過線上 API：%s）" % exc)
        return 0, chars

    def walk(node):
        if isinstance(node, str):
            chars.update(node)
        elif isinstance(node, dict):
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for v in node:
                walk(v)

    walk(data)
    return len(data), chars


def fetch(weight):
    os.makedirs(CACHE, exist_ok=True)
    name = "IBMPlexSansTC-%s.woff2" % weight
    dest = os.path.join(CACHE, name)
    if not os.path.exists(dest):
        print("  下載 %s ..." % name)
        urllib.request.urlretrieve("%s/%s" % (BASE_URL, name), dest)
    return dest


def main():
    try:
        from fontTools.subset import main as subset_main
    except ImportError:
        sys.exit("缺少 fontTools，請先執行：pip install fonttools brotli")

    if not os.path.isdir(DIST):
        sys.exit("找不到 site/dist，請先執行：npm run build --prefix site")

    files, chars = from_dist()
    n_cars, api_chars = from_api()
    chars |= api_chars | set(ALWAYS)
    chars = {c for c in chars if c.isprintable() and not c.isspace()}
    han = sum(1 for c in chars if "一" <= c <= "鿿")
    print("建置頁面 %d 個、線上車輛 %d 台 → 字元 %d（漢字 %d）"
          % (len(files), n_cars, len(chars), han))

    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(CACHE, exist_ok=True)
    charset_path = os.path.join(CACHE, "cars-charset.txt")
    open(charset_path, "w", encoding="utf-8").write("".join(sorted(chars)))

    total = 0
    for weight in WEIGHTS:
        src = fetch(weight)
        out = os.path.join(OUT_DIR, "IBMPlexSansTC-%s.subset.woff2" % weight)
        subset_main([
            src,
            "--text-file=%s" % charset_path,
            "--output-file=%s" % out,
            "--flavor=woff2",
            "--layout-features=",
            "--no-hinting",
            "--desubroutinize",
        ])
        size = os.path.getsize(out)
        total += size
        print("  %-9s %7.1f KB" % (weight, size / 1024))
    print("合計 %.1f KB" % (total / 1024))
    report_coverage(chars)


def report_coverage(chars):
    """比對子集字型的 cmap 與頁面實際用字，區分「字型本來就沒有」與「字集漏掉」。"""
    from fontTools.ttLib import TTFont

    def cmap_of(path):
        cov = set()
        for t in TTFont(path)["cmap"].tables:
            cov |= set(t.cmap.keys())
        return cov

    sub = cmap_of(os.path.join(OUT_DIR, "IBMPlexSansTC-Regular.subset.woff2"))
    src = cmap_of(fetch("Regular"))
    missing = [c for c in sorted(chars) if ord(c) not in sub]
    if not missing:
        print("覆蓋檢查：全部字元皆已包含")
        return
    absent = [c for c in missing if ord(c) not in src]   # 原始字型就沒有 → 只能後備
    dropped = [c for c in missing if ord(c) in src]      # 字型有但沒進子集 → 需處理
    if dropped:
        print("⚠ 字型有、但子集漏掉 %d 字：%s" % (len(dropped), "".join(dropped)))
        print("  （通常是改過文案後沒重新 build，請先 npm run build --prefix site 再跑一次）")
    if absent:
        print("· IBM Plex Sans TC 本身無此 %d 個字元，將由後備字型顯示：%s"
              % (len(absent), "".join(absent)))


if __name__ == "__main__":
    main()
