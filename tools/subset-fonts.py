#!/usr/bin/env python3
"""
產生 IBM Plex Sans TC 的網站專用子集字型。

用法：
    python tools/subset-fonts.py

流程：
1. 掃描全站 HTML 的可見文字，取出實際用到的字元
2. 從 unpkg 下載 IBM Plex Sans TC 完整字重（快取在系統暫存目錄）
3. 依字元集切出子集，輸出到 assets/fonts/

改動文案後請重跑，否則新字會掉到後備字型。
需要 fontTools：pip install fonttools brotli
"""
import os
import re
import glob
import sys
import tempfile
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "assets", "fonts")
CACHE = os.path.join(tempfile.gettempdir(), "plex-tc-src")
BASE_URL = "https://unpkg.com/@ibm/plex-sans-tc@1.1.1/fonts/complete/woff2/hinted"
WEIGHTS = {"Regular": 400, "Medium": 500, "SemiBold": 600, "Bold": 700}

# 除了站內實際用字，一律保留這些基本字元，避免小改動就要重跑
ALWAYS = (
    "".join(chr(c) for c in range(0x20, 0x7F))            # ASCII
    + "　、。〈〉《》「」『』【】〔〕〖〗——…‧・"        # 中文標點
    + "±×÷≈≠≤≥∞°′″※§¶†‡№"                              # 常見符號
    + "←↑→↓↔⇒⇔∀∂∃∅∈∉∋∏∑√∝∠∧∨∩∪∫∴∵"
    + "‘’“”‚„‹›«»–—―‰€£¥¢©®™"
    + "０１２３４５６７８９"
)


def collect_chars():
    chars = set(ALWAYS)
    files = [
        f for f in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True)
        if ".git" not in f.replace(os.sep, "/").split("/")
    ]
    for path in files:
        text = open(path, encoding="utf-8", errors="ignore").read()
        text = re.sub(r"<script.*?</script>", " ", text, flags=re.S | re.I)
        text = re.sub(r"<style.*?</style>", " ", text, flags=re.S | re.I)
        text = re.sub(r"<[^>]+>", " ", text)
        chars |= set(text)
    return files, {c for c in chars if c.isprintable() and not c.isspace()}


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

    files, chars = collect_chars()
    han = sum(1 for c in chars if "一" <= c <= "鿿")
    print("掃描 %d 個 HTML，取得 %d 個字元（漢字 %d）" % (len(files), len(chars), han))

    os.makedirs(OUT_DIR, exist_ok=True)
    charset_path = os.path.join(CACHE, "charset.txt")
    os.makedirs(CACHE, exist_ok=True)
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


if __name__ == "__main__":
    main()
