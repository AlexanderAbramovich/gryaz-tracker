# -*- coding: utf-8 -*-
"""Склейка src/ в один index.html. Деплоится ОДИН файл (закон 5 дорожной карты):
в зале без сети приложение обязано открыться целиком из кэша."""
import io, os, glob
ROOT = os.path.dirname(os.path.abspath(__file__))
def rd(p): return io.open(p, encoding="utf-8").read()
src = lambda n: os.path.join(ROOT, "src", n)
css = "\n".join(rd(f) for f in sorted(glob.glob(src("*.css"))))
js  = "\n".join(rd(f) for f in sorted(glob.glob(src("*.js"))) if not os.path.basename(f).startswith("_"))
html = rd(src("00_head.html")).rstrip() + "\n<style>\n" + css + "\n</style>\n</head>\n<body>\n\n" + rd(src("40_shell.html")).rstrip() + "\n\n<script>\n" + js + "\n</script>\n</body>\n</html>\n"
io.open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8", newline="\n").write(html)
print("index.html:", len(html.encode("utf-8")) // 1024, "KB")
