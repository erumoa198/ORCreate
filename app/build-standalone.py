#!/usr/bin/env python3
"""
単一HTML版ビルダー
- CSS / JS / 診断データ / 英字フォント(base64) を 1ファイルに同梱する。
- 和文フォントは容量を抑えるため端末フォントにフォールバック
  （iPhone/Macはヒラギノ等で綺麗に表示される）。
- サーバー不要：出力ファイルは file:// で直接開いて動作する。

使い方:  python3 app/build-standalone.py   （または app/ 内で python3 build-standalone.py）
出力:    app/navi-beauty-standalone.html
"""
import base64, json, re, os

APP = os.path.dirname(os.path.abspath(__file__))

def b64(path):
    return base64.b64encode(open(path, "rb").read()).decode()

def woff2_face(family, weight, path):
    return ("@font-face{font-family:'%s';font-style:normal;font-weight:%s;"
            "font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2');}"
            % (family, weight, b64(os.path.join(APP, path))))

# 1) フォント（英字のみ同梱：和文は端末フォントへフォールバック）
fonts_css = "".join([
    woff2_face("Cormorant Garamond", "400", "fonts/cormorant-400.woff2"),
    woff2_face("Cormorant Garamond", "600", "fonts/cormorant-600.woff2"),
    woff2_face("Inter", "400", "fonts/inter-400.woff2"),
    woff2_face("Inter", "500", "fonts/inter-500.woff2"),
    woff2_face("Inter", "600", "fonts/inter-600.woff2"),
])

# 2) app.css（グレイン画像をdata URI化）
app_css = open(os.path.join(APP, "css/app.css"), encoding="utf-8").read()
grain = "data:image/png;base64," + b64(os.path.join(APP, "icons/grain.png"))
app_css = app_css.replace("url('../icons/grain.png')", "url(%s)" % grain)
style = "<style>\n" + fonts_css + "\n" + app_css + "\n</style>"

# 3) データ（loadData の DB 構造に合わせて整形）
def load(p): return json.load(open(os.path.join(APP, "data", p), encoding="utf-8"))
DATA = {
    "diagnoses": load("diagnoses.json")["diagnoses"],
    "menus":     load("menus.json"),
    "products":  load("products.json")["products"],
    "tips":      load("tips.json"),
    "news":      load("news.json")["news"],
}
data_js = "window.NAVI_DATA=" + json.dumps(DATA, ensure_ascii=False) + ";"

# 4) スクリプト
js = ""
for f in ["js/vendor/qrcode.js", "js/qr.js", "js/app.js"]:
    js += "\n;/* " + f + " */\n" + open(os.path.join(APP, f), encoding="utf-8").read() + "\n"
def guard(s): return s.replace("</script", "<\\/script")
scripts = "<script>\n" + guard(data_js) + "\n" + guard(js) + "\n</script>"

# 5) index.html を素にインライン化
html = open(os.path.join(APP, "index.html"), encoding="utf-8").read()
for pat in [r'\s*<link[^>]*rel="preload"[^>]*>',
            r'\s*<link[^>]*rel="manifest"[^>]*>',
            r'\s*<link[^>]*rel="icon"[^>]*>',
            r'\s*<link[^>]*rel="apple-touch-icon"[^>]*>',
            r'\s*<link[^>]*rel="stylesheet"[^>]*>',
            r'\s*<script src="[^"]*"></script>']:
    html = re.sub(pat, '', html)
html = html.replace("</head>", style + "\n</head>")
html = html.replace("</body>", scripts + "\n</body>")
html = html.replace("<title>Navi Beauty｜美容診断</title>",
                    "<title>Navi Beauty｜美容診断（単一HTML版）</title>")

out = os.path.join(APP, "navi-beauty-standalone.html")
open(out, "w", encoding="utf-8").write(html)
print("wrote", out, "size:", round(os.path.getsize(out) / 1024), "KB")
