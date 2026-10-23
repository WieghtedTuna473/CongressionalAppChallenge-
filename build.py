# Builds one self-contained index.html from src/ so it can be hosted anywhere (for example GitHub Pages).
import re
src=open("src/index.src.html",encoding="utf-8").read()
css=open("src/css/style.css",encoding="utf-8").read()
src=src.replace('<link rel="stylesheet" href="css/style.css">',"<style>\n"+css+"</style>")
for f in ["data","analyzer","app"]:
    js=open("src/js/%s.js"%f,encoding="utf-8").read()
    src=src.replace('<script src="js/%s.js"></script>'%f,"<script>\n"+js+"</script>")
assert 'href="css/' not in src and 'src="js/' not in src
open("index.html","w",encoding="utf-8").write(src)
print("built index.html",len(src),"bytes")

import shutil
for f in ["sw.js","manifest.webmanifest","icon.svg"]:
    shutil.copy("src/pwa/"+f,f)
print("copied sw.js, manifest.webmanifest, icon.svg")
