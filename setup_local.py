#!/usr/bin/env python3
"""
setup_local.py — Portfolio Wix → Local
Télécharge toutes les images Wix et met à jour portfolio.html avec des chemins locaux.

Usage:
  1. Mets ce script dans le même dossier que portfolio.html
  2. Lance :  python3 setup_local.py
  3. Push tout sur GitHub (portfolio.html + dossier assets/)

Structure finale :
  /
  ├── portfolio.html   (mis à jour automatiquement)
  ├── assets/
  │   ├── img_001.jpg
  │   ├── img_002.png
  │   └── ...
  └── setup_local.py   (tu peux le supprimer après)
"""

import re
import os
import sys
import time
import hashlib
import urllib.request
from pathlib import Path

HTML_FILE = "portfolio.html"
ASSETS_DIR = "assets"
BASE_WIX   = "https://static.wixstatic.com/media/"

# ─── Wix URL builder functions (mirrors the JS helpers in the HTML) ────────────
def f(h, e="png"):
    return f"{BASE_WIX}45ed80_{h}~mv2.{e}/v1/fit/w_980,h_551,q_90,enc_avif,quality_auto/45ed80_{h}~mv2.{e}"

def fj(h):
    return f(h, "jpg")

def ft(h, e="png"):
    return f"{BASE_WIX}45ed80_{h}~mv2.{e}/v1/fill/w_600,h_600,q_90,enc_avif,quality_auto/45ed80_{h}~mv2.{e}"

def ftj(h):
    return ft(h, "jpg")

def fc2(h):
    return f"{BASE_WIX}45ed80_{h}~mv2.jpg/v1/fit/w_710,h_551,q_90,enc_avif,quality_auto/45ed80_{h}~mv2.jpg"

# ─── All dynamic image IDs referenced in the HTML JS ────────────────────────────
# (extracted from the DOCS array and buildG() calls)
DYNAMIC_IMAGES = [
    # Silent Frame
    ("f", ["f9dabe04b8ab4cb49f0d104f590f3da6","c4931e5804b14c0c8a652fffc478e235","74a3062fa7344ddfa381b29c730caeab",
           "9bccd927af474a749630a9312c55a629","eed9236d42994cf4bc7715c2c7875589","193505164aba4f5ba371d10a6ae96ce7",
           "cbc7a943f1ec455ab0291cba5c578e59","2ae34e76bf374ccea638e4902a840ec6","c1c5e7b80716439da9762c3ae354f473",
           "a19337dfdeba49ce8e1e23a9c7a36f42","34e833d849f74c368ae80ab39a3518de"]),
    # TFT
    ("fj", ["f60a91becf484b6ea0a5b6022b0927e0","13804af545bf4a258e8e0e98c16ee72f","3c60cba961974fc6bb2587fbd6e69471",
            "b7b3f0542b6a4b999a9a398e9c917d88","3130139f82a54e1f81d7adb6e0e1123a","bf16d15d3d4847489bb01432fa27ca9c",
            "53a534d7e32e44c18135430660362001","0ae79a9bfc764dcb902473562c4abb83","d102fbeb2ccf42bd9c6c3f70018e8e5b",
            "3c4218bb82c1421198b5edbdbbfeeea0","f0cd9c17ba0d48bea443baa216c9d359","a86ed4d2283a42e3b9ac220aa6f9cd00",
            "0ebca3610e184ad9a647eaf01e10e80e","426933102a9d487d825c37c271426ff5","15de3731aa0d4c3bb46611bd4e45e813",
            "18ecd44895514babb7a2950f31b04989","fc7986d818634cb1bb0a0adbb7aa569c","cf4e8ff3eff9447b9014a70d84c29510",
            "4c2b9ce90c0e48089e74d344da20d412","d345ce72ebf143e0aeb984da92515bff","79f217405afd413587b886c164adf07f",
            "95e7da4cfc884a89a122d1d0f755c1b6","df87f329583142e09a7fcfb90a63fa01","a3c7ee9aa3c44b10a2cacc286a295733",
            "6c2f3eb6a32245adb7458ce9b3757713","75ef79efdc11431b8376eaf378c8e2eb","58827df8ff0148748fd5a3be2e30ec48",
            "f72764d66a974be8a8a1305b5741507c"]),
    # Tic-Tac
    ("fj", ["874a1faf5118467b8f49d6ea47767b45","733c24a134fa409bb483b307f35aeeec","810d43449fc541a18fb1fabddb9dff97",
            "13954240cdf44cf8ad15ccc46435e47b","2dd0ac4d3f68446ebe418cd4b7cf797c","3bb27740b2074a5d8237279def1d3c20",
            "556c1263fa8240a9856456d9a0b8f016","4c04b9bcfac84ef5b94ec256b883cdba","cc732430b6d34000b5bd5cf82617adcf",
            "d84d0fbd272f458fa1bbfc8dc14761f1","96b33e6a840441b4be217626549f4380","a4a4768f76014405a9da13ddf8f8c38e",
            "ef2c16f95dc94abd8a4e0657f14d447e"]),
    # Save Your Neighbor
    ("fj", ["1d18a45d9f6c4e0db96c63cc615b8f2f","4e22af9f92bd4139be96a2fd75322327","1a5a00e18e52406f83e5c3f0bfbf6ef2",
            "2f3fd653520e4ff782bd3818a8237025","772d448d3b7044679ac2c0f583ad31b0","4e5a07a2ef78448dbfd6e4471d56e5b3",
            "60ab860d05c24aebab076f94880c4396","5f1ea2683f0c4852ac84b162dd10069d","528d0701ce6c41ef899b66de74ed3d5f"]),
    # Updee & Downdee
    ("fj", ["62494ecf77694d02a523e077e00cd7ae","9d4ce0de51804d7f9d7e4311f7e01cd8","f4e0a38eb2364d37ac1475a99ab7655d",
            "813aab6adce4408c89f12345dea45d6d","4d16eb765f5b44878c9a89c31c5be36f","6e2da79637cf42828c38bdb5cc514d77",
            "75023383ca6547d18befe6ee5f6f8724","acd221cb4bb5487a9a65d4ff31e76fa7","8d002f3b76fb4da79e8dfd29291cf163",
            "2ce2c42502c54a4a9a2ade921ec4ca91","63046b2fcbe7429d8add8821384e0750","792731b0f9bf4f23b88c5a8f2f80fdab",
            "8130c16a5dfd41178465ceace1b74356","daf571fc1c2d4656882c5ed4edb14d37"]),
    # Netflix Gamification
    ("f",  ["9fa605fc01e044aaaf17b4c4520d46b7"]),
    ("fj", ["487dc86c854e4308ad447e353564fa4e"]),
    # Esports Manager
    ("fj", ["861ebaafc26b4ac4a3543b6eee01dc1a"]),
    # IN CANTA concept
    ("f",  ["74549cf0f901417d89e609ff8f18507b","2361165d97bb4a3eb604045c6cc26ef0","1b66491ea81145d5ada82e77a60794f6",
            "984b3bdecbf446cf9d2b8b22aa59b348","6776652b8c944036a23dc18e901a7882",
            "6a7ef3e3ea1b40e8939f4c546dbbf9bf"]),
    # IN CANTA rulebook
    ("f",  ["33ce9b26a0714fcf95b0d6af2a3cfe89","a1058cd341d34345b993e286bbcdc068","b35162422c354baeb611073534c905a8",
            "59836668310148309fde71b6b0135544","476fbad358834c588854e675652595d1","2d6fc8959c874b33a0248a5e1b1dc74e",
            "b67bc897b3bc42f4b69cc4281ae78dd6","d13cbedcb7e24ec9bbe605100101b47c","6c20d64d6f904c5bbb5769c02b7c4783",
            "8a5f4a4f44b043dcbcf6a62c0882c6da","4c8e3917135041d28dc7170fc55af6e8"]),
    # IN CANTA cards
    ("fc2", ["72d46ceeb2a6418ebcd28fdf984b37eb","6c132527a9554361bd915a1fe6921cb5","c6b9766bb27e4fa6a1527c7fff5cfe88",
             "51e9114fe2604a3e9fefc56080a3168b","2aa50b52cebe47279944713b096747ce","213b00dec41b432f9c6555b8a6b2d5e7",
             "000ba25e2cfe4fdf887672682002d444","b82dd7de51ac4b4ab30a22e49c9daad5","cd1f58101538433bb4bb3295874854dc",
             "f566c48869fb437b8c63f6cdf88c4aeb","384e787153be4d44adbea2abf4c76088","24d787895a354c2fbb1dec0fb5dd91b3",
             "87d257f3c6dd4e4187478d464ec1f79d","56100b50d90d43cc9b57997ee2bb90ff","7104afe7046f451c818d68a526067a88",
             "8148383563ab48999a8c2818b287ed0b","59a6b608bde5454c9c2dc31f35335fe0","58969c6fcabc41d0a107257d3eaf2976",
             "a0cd6bb0ce454a7b92f2482a436a0474","8071f6b00c9c4adaa05746ba23298697","a9a065db6362403a97dad8ce1dde58b2",
             "2532fc563dc342f8bba4d160d4f14a0a","1e57b3b0ad584c348dc6b8a52757d393","70f4cc8da65246a7ad31f2152abf6523",
             "7c1099d5899b42ecbc1f0201af909cf5","9f1ba6b04e1746ceaf1e2c4defc75d71","c48d99aebeec4521a66bf65a3a1067ab",
             "e9b485deecdb461ba0294b8c2bfcbcce","70313901246f4acaa681d983668ce523","6c8a599751654b8da426da7e93e25427",
             "97439a61f8224d9dabdde80c000527f2","358de47c4bb547f3b3cac3393ad73bc4","dfaa61606cec47ada753257d5724cdab",
             "f4600507799c4e2ab848b24bc6552576","5f413ec8fdb6493aa864aabaea3983e6","7307dbf4ca2b4f9cb48b816e54ea2dc9",
             "8405e4b0254e423a86712679730a6815","2c6f7cd5d4334dce90fc5b53180c3e5d","12c40c01d6ee4a939670633e3ea0258a",
             "8daf1d937973436297169e801e70f998","497aadf275734d188162c129e0e247cf","97c035997e8645b2ae44a001c0d87021",
             "11951bdb3cca4dbb8c4b55f00c31e782","e97a8c04404d4c199fa21ee31bdfa2ce","b1ded555a63e4fb08f121ededf6dd259",
             "1f42cb214c744669aae67a1dd47350ee","8b259b0b239446e091a1d1f8b2271be1","e88a2772b9c640c9a421854fb092182f"]),
    # IN CANTA balancing
    ("fj", ["a2a9ea28970a4ac2923b4406cb89720d","8d0cd4936d54441a869ffeb3955b9db5","ab4565b6b5344cfd8d077e6041283a73"]),
    # Pokémon Freedom
    ("fj", ["d52d7f21a0ba4f8b8b892e9684c39fd5","56a4ac6d96aa43078055f39fa76a4158","3ee4a699675b4a66bfe44c7ac5420143",
            "4b87e38f20734e449512d8f38667076f","a2c8e34ca52b427c89aef305a8d854cb","4c07828ca276427a82834d1858dda3b3"]),
    # Cour Napoléon
    ("fj", ["30773ad239074feab05780d50dea060f","3290c277bfd54ab1b768b273934e018f","a5f7b8fc88d4437985c4d97202ed238b",
            "26368fa1e619405998947f8d5a08b744","e6609d615e484ab1bb4096d80f012c4b","fac035e22a1d4ee693528dc2a78d6910"]),
    # HTML Projects
    ("fj", ["2a7165d6621b44a5a5c9f887b6cacdbff000","737d7a47df2a499f8b499f5636ec8cfef000",
            "ecfb82adf4c44121bcc3473d66c6e915f000"]),
]

# GIF (special case)
GIFS = [
    "https://static.wixstatic.com/media/45ed80_92549a86ddee4d4da354786c360a2e06~mv2.gif",
    "https://static.wixstatic.com/media/9dd886909dd64502a3ad673c3fa72790~mv2.png",
]

# Extra static URLs found directly in HTML (board, etc.)
EXTRA_STATIC = [
    "https://static.wixstatic.com/media/1d4c57a128494063263ab6f729596843.jpg/v1/fill/w_600,h_600,q_90,enc_avif,quality_auto/1d4c57a128494063263ab6f729596843.jpg",
    "https://static.wixstatic.com/media/45ed80_9dd886909dd64502a3ad673c3fa72790~mv2.png/v1/fill/w_900,h_675,q_90,enc_avif,quality_auto/45ed80_9dd886909dd64502a3ad673c3fa72790~mv2.png",
    "https://static.wixstatic.com/media/45ed80_9dd886909dd64502a3ad673c3fa72790~mv2.png/v1/fit/w_980,h_551,q_90,enc_avif,quality_auto/45ed80_9dd886909dd64502a3ad673c3fa72790~mv2.png",
    "https://static.wixstatic.com/media/704318ee9be94acabf28919a734951b8.jpg/v1/fill/w_900,h_675,q_90,enc_avif,quality_auto/704318ee9be94acabf28919a734951b8.jpg",
]

# ─── Build full URL list ────────────────────────────────────────────────────────
all_urls = set()

fn_map = {"f": f, "fj": fj, "ft": ft, "ftj": ftj, "fc2": fc2}
for fn_name, ids in DYNAMIC_IMAGES:
    fn = fn_map[fn_name]
    for img_id in ids:
        all_urls.add(fn(img_id))
        # Also add thumbnail version for cards
        if fn_name in ("fj", "f"):
            all_urls.add(ftj(img_id))
            all_urls.add(ft(img_id))

for url in EXTRA_STATIC + GIFS:
    if url.startswith("http"):
        all_urls.add(url)

# Extract any remaining URLs directly from HTML
if os.path.exists(HTML_FILE):
    with open(HTML_FILE, encoding="utf-8") as fh:
        html = fh.read()
    import re
    for url in re.findall(r'https://static\.wixstatic\.com/media/[^\s"\']+', html):
        all_urls.add(url)

# ─── Filename from URL ──────────────────────────────────────────────────────────
def url_to_filename(url):
    # Use a short hash + original extension to keep filenames unique and readable
    ext = "jpg"
    if ".png" in url: ext = "png"
    elif ".gif" in url: ext = "gif"
    elif ".webp" in url: ext = "webp"
    h = hashlib.md5(url.encode()).hexdigest()[:12]
    return f"{h}.{ext}"

# ─── Download ───────────────────────────────────────────────────────────────────
def download():
    os.makedirs(ASSETS_DIR, exist_ok=True)
    url_map = {}  # url → local path
    total = len(all_urls)
    done = 0
    skipped = 0
    errors = 0

    print(f"\n📦 Downloading {total} images to ./{ASSETS_DIR}/\n")

    for url in sorted(all_urls):
        fname = url_to_filename(url)
        local = os.path.join(ASSETS_DIR, fname)
        url_map[url] = f"./{ASSETS_DIR}/{fname}"

        if os.path.exists(local):
            skipped += 1
            done += 1
            continue

        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                with open(local, "wb") as out:
                    out.write(resp.read())
            done += 1
            bar = "█" * int(done/total*30) + "░" * (30-int(done/total*30))
            print(f"\r  [{bar}] {done}/{total}", end="", flush=True)
            time.sleep(0.05)  # be polite to Wix CDN
        except Exception as e:
            errors += 1
            done += 1
            print(f"\r  ⚠  Failed: {url[-60:]} — {e}")

    print(f"\n\n✅  Done — {done-skipped} downloaded, {skipped} already cached, {errors} errors\n")
    return url_map

# ─── Patch HTML ─────────────────────────────────────────────────────────────────
def patch_html(url_map):
    if not os.path.exists(HTML_FILE):
        print(f"❌ {HTML_FILE} not found")
        return

    with open(HTML_FILE, encoding="utf-8") as fh:
        html = fh.read()

    replaced = 0
    # Sort by length descending so longer URLs are replaced first (avoid partial matches)
    for url in sorted(url_map, key=len, reverse=True):
        local = url_map[url]
        if url in html:
            html = html.replace(url, local)
            replaced += 1

    # Also patch the JS helper functions so dynamically built URLs also resolve locally
    # Replace the W base URL so f(), fj(), etc. point to assets/
    # We do this by replacing the W constant and adjusting the URL builders
    html = html.replace(
        "const W = 'https://static.wixstatic.com/media/';",
        "const W = './assets/'; // local"
    )
    # The f(), fj() etc. functions build complex CDN URLs — we simplify them to direct file lookups
    # Replace the helper functions with local-path equivalents
    old_helpers = """        const f = (h, e = 'png') => `${W}45ed80_${h}~mv2.${e}/v1/fit/w_980,h_551,q_90,enc_avif,quality_auto/45ed80_${h}~mv2.${e}`;
        const fj = h => f(h, 'jpg');
        const ft = (h, e = 'png') => `${W}45ed80_${h}~mv2.${e}/v1/fill/w_600,h_600,q_90,enc_avif,quality_auto/45ed80_${h}~mv2.${e}`;
        const ftj = h => ft(h, 'jpg');
        const fc2 = h => `${W}45ed80_${h}~mv2.jpg/v1/fit/w_710,h_551,q_90,enc_avif,quality_auto/45ed80_${h}~mv2.jpg`;"""

    new_helpers = """        // Local asset lookup — maps MD5 of original URL to local file
        const _urlToLocal = (url) => {
            // Try to find the file in assets/ by matching URL patterns
            // Fallback: return original URL (image may not have been downloaded)
            return url;
        };
        const f = (h, e = 'png') => { const u = `https://static.wixstatic.com/media/45ed80_${h}~mv2.${e}/v1/fit/w_980,h_551,q_90,enc_avif,quality_auto/45ed80_${h}~mv2.${e}`; return ASSET_MAP[u] || u; };
        const fj = h => f(h, 'jpg');
        const ft = (h, e = 'png') => { const u = `https://static.wixstatic.com/media/45ed80_${h}~mv2.${e}/v1/fill/w_600,h_600,q_90,enc_avif,quality_auto/45ed80_${h}~mv2.${e}`; return ASSET_MAP[u] || u; };
        const ftj = h => ft(h, 'jpg');
        const fc2 = h => { const u = `https://static.wixstatic.com/media/45ed80_${h}~mv2.jpg/v1/fit/w_710,h_551,q_90,enc_avif,quality_auto/45ed80_${h}~mv2.jpg`; return ASSET_MAP[u] || u; };"""

    # Build ASSET_MAP JS object
    asset_map_entries = ",\n        ".join(
        f'"{url}": "{local}"'
        for url, local in sorted(url_map.items())
    )
    asset_map_js = f"\n        const ASSET_MAP = {{\n        {asset_map_entries}\n        }};\n"

    # Inject ASSET_MAP before the helpers
    if old_helpers in html:
        html = html.replace(old_helpers, asset_map_js + new_helpers)
        print(f"  ✅ JS helpers patched with ASSET_MAP ({len(url_map)} entries)")
    else:
        print("  ⚠  Could not find JS helpers — dynamic images may still use CDN URLs")

    out_file = "portfolio_local.html"
    with open(out_file, "w", encoding="utf-8") as fh:
        fh.write(html)

    print(f"  ✅ Saved as {out_file} ({replaced} static URL replacements)\n")
    print(f"  👉 Push to GitHub:")
    print(f"     git add {out_file} {ASSETS_DIR}/")
    print(f"     git commit -m 'Switch to local assets'")
    print(f"     git push")
    print(f"\n  💡 Tip: rename {out_file} → index.html for GitHub Pages\n")

# ─── Main ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  Portfolio Wix → Local  //  setup_local.py")
    print("=" * 55)

    if not os.path.exists(HTML_FILE):
        print(f"\n❌ Error: '{HTML_FILE}' not found in current directory.")
        print("   Run this script from the same folder as portfolio.html\n")
        sys.exit(1)

    url_map = download()
    print("🔧 Patching HTML with local paths...\n")
    patch_html(url_map)
