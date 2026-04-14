# setup_local.ps1 — Portfolio Wix -> Local
# Double-clic ou : clic droit -> "Executer avec PowerShell"

# Auto-placement dans le dossier du script
Set-Location -Path $PSScriptRoot

$HTML_FILE  = "portfolio.html"
$ASSETS_DIR = "assets"
$BASE       = "https://static.wixstatic.com/media/"

# ── URL builders (prefixes WIX_ pour eviter les alias PS comme ft=Format-Table)
function WIX_f($h, $e = "png")  { "${BASE}45ed80_${h}~mv2.${e}/v1/fit/w_980,h_551,q_90,enc_avif,quality_auto/45ed80_${h}~mv2.${e}" }
function WIX_fj($h)             { WIX_f $h "jpg" }
function WIX_ft($h, $e = "png") { "${BASE}45ed80_${h}~mv2.${e}/v1/fill/w_600,h_600,q_90,enc_avif,quality_auto/45ed80_${h}~mv2.${e}" }
function WIX_ftj($h)            { WIX_ft $h "jpg" }
function WIX_fc2($h)            { "${BASE}45ed80_${h}~mv2.jpg/v1/fit/w_710,h_551,q_90,enc_avif,quality_auto/45ed80_${h}~mv2.jpg" }

# ── IDs des images ────────────────────────────────────────────────────────────
$ids_f = @(
    "f9dabe04b8ab4cb49f0d104f590f3da6","c4931e5804b14c0c8a652fffc478e235","74a3062fa7344ddfa381b29c730caeab",
    "9bccd927af474a749630a9312c55a629","eed9236d42994cf4bc7715c2c7875589","193505164aba4f5ba371d10a6ae96ce7",
    "cbc7a943f1ec455ab0291cba5c578e59","2ae34e76bf374ccea638e4902a840ec6","c1c5e7b80716439da9762c3ae354f473",
    "a19337dfdeba49ce8e1e23a9c7a36f42","34e833d849f74c368ae80ab39a3518de","9fa605fc01e044aaaf17b4c4520d46b7",
    "74549cf0f901417d89e609ff8f18507b","2361165d97bb4a3eb604045c6cc26ef0","1b66491ea81145d5ada82e77a60794f6",
    "984b3bdecbf446cf9d2b8b22aa59b348","6776652b8c944036a23dc18e901a7882","6a7ef3e3ea1b40e8939f4c546dbbf9bf",
    "33ce9b26a0714fcf95b0d6af2a3cfe89","a1058cd341d34345b993e286bbcdc068","b35162422c354baeb611073534c905a8",
    "59836668310148309fde71b6b0135544","476fbad358834c588854e675652595d1","2d6fc8959c874b33a0248a5e1b1dc74e",
    "b67bc897b3bc42f4b69cc4281ae78dd6","d13cbedcb7e24ec9bbe605100101b47c","6c20d64d6f904c5bbb5769c02b7c4783",
    "8a5f4a4f44b043dcbcf6a62c0882c6da","4c8e3917135041d28dc7170fc55af6e8"
)
$ids_fj = @(
    "f60a91becf484b6ea0a5b6022b0927e0","13804af545bf4a258e8e0e98c16ee72f","3c60cba961974fc6bb2587fbd6e69471",
    "b7b3f0542b6a4b999a9a398e9c917d88","3130139f82a54e1f81d7adb6e0e1123a","bf16d15d3d4847489bb01432fa27ca9c",
    "53a534d7e32e44c18135430660362001","0ae79a9bfc764dcb902473562c4abb83","d102fbeb2ccf42bd9c6c3f70018e8e5b",
    "3c4218bb82c1421198b5edbdbbfeeea0","f0cd9c17ba0d48bea443baa216c9d359","a86ed4d2283a42e3b9ac220aa6f9cd00",
    "0ebca3610e184ad9a647eaf01e10e80e","426933102a9d487d825c37c271426ff5","15de3731aa0d4c3bb46611bd4e45e813",
    "18ecd44895514babb7a2950f31b04989","fc7986d818634cb1bb0a0adbb7aa569c","cf4e8ff3eff9447b9014a70d84c29510",
    "4c2b9ce90c0e48089e74d344da20d412","d345ce72ebf143e0aeb984da92515bff","79f217405afd413587b886c164adf07f",
    "95e7da4cfc884a89a122d1d0f755c1b6","df87f329583142e09a7fcfb90a63fa01","a3c7ee9aa3c44b10a2cacc286a295733",
    "6c2f3eb6a32245adb7458ce9b3757713","75ef79efdc11431b8376eaf378c8e2eb","58827df8ff0148748fd5a3be2e30ec48",
    "f72764d66a974be8a8a1305b5741507c","874a1faf5118467b8f49d6ea47767b45","733c24a134fa409bb483b307f35aeeec",
    "810d43449fc541a18fb1fabddb9dff97","13954240cdf44cf8ad15ccc46435e47b","2dd0ac4d3f68446ebe418cd4b7cf797c",
    "3bb27740b2074a5d8237279def1d3c20","556c1263fa8240a9856456d9a0b8f016","4c04b9bcfac84ef5b94ec256b883cdba",
    "cc732430b6d34000b5bd5cf82617adcf","d84d0fbd272f458fa1bbfc8dc14761f1","96b33e6a840441b4be217626549f4380",
    "a4a4768f76014405a9da13ddf8f8c38e","ef2c16f95dc94abd8a4e0657f14d447e",
    "1d18a45d9f6c4e0db96c63cc615b8f2f","4e22af9f92bd4139be96a2fd75322327","1a5a00e18e52406f83e5c3f0bfbf6ef2",
    "2f3fd653520e4ff782bd3818a8237025","772d448d3b7044679ac2c0f583ad31b0","4e5a07a2ef78448dbfd6e4471d56e5b3",
    "60ab860d05c24aebab076f94880c4396","5f1ea2683f0c4852ac84b162dd10069d","528d0701ce6c41ef899b66de74ed3d5f",
    "62494ecf77694d02a523e077e00cd7ae","9d4ce0de51804d7f9d7e4311f7e01cd8","f4e0a38eb2364d37ac1475a99ab7655d",
    "813aab6adce4408c89f12345dea45d6d","4d16eb765f5b44878c9a89c31c5be36f","6e2da79637cf42828c38bdb5cc514d77",
    "75023383ca6547d18befe6ee5f6f8724","acd221cb4bb5487a9a65d4ff31e76fa7","8d002f3b76fb4da79e8dfd29291cf163",
    "2ce2c42502c54a4a9a2ade921ec4ca91","63046b2fcbe7429d8add8821384e0750","792731b0f9bf4f23b88c5a8f2f80fdab",
    "8130c16a5dfd41178465ceace1b74356","daf571fc1c2d4656882c5ed4edb14d37","861ebaafc26b4ac4a3543b6eee01dc1a",
    "487dc86c854e4308ad447e353564fa4e","a2a9ea28970a4ac2923b4406cb89720d","8d0cd4936d54441a869ffeb3955b9db5",
    "ab4565b6b5344cfd8d077e6041283a73","d52d7f21a0ba4f8b8b892e9684c39fd5","56a4ac6d96aa43078055f39fa76a4158",
    "3ee4a699675b4a66bfe44c7ac5420143","4b87e38f20734e449512d8f38667076f","a2c8e34ca52b427c89aef305a8d854cb",
    "4c07828ca276427a82834d1858dda3b3","30773ad239074feab05780d50dea060f","3290c277bfd54ab1b768b273934e018f",
    "a5f7b8fc88d4437985c4d97202ed238b","26368fa1e619405998947f8d5a08b744","e6609d615e484ab1bb4096d80f012c4b",
    "fac035e22a1d4ee693528dc2a78d6910",
    "2a7165d6621b44a5a5c9f887b6cacdbff000","737d7a47df2a499f8b499f5636ec8cfef000","ecfb82adf4c44121bcc3473d66c6e915f000"
)
$ids_fc2 = @(
    "72d46ceeb2a6418ebcd28fdf984b37eb","6c132527a9554361bd915a1fe6921cb5","c6b9766bb27e4fa6a1527c7fff5cfe88",
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
    "1f42cb214c744669aae67a1dd47350ee","8b259b0b239446e091a1d1f8b2271be1","e88a2772b9c640c9a421854fb092182f"
)

# ── Construire la liste des URLs ──────────────────────────────────────────────
$urls = [System.Collections.Generic.HashSet[string]]::new()

foreach ($h in $ids_f) {
    $null = $urls.Add((WIX_f   $h "png"))
    $null = $urls.Add((WIX_f   $h "jpg"))
    $null = $urls.Add((WIX_ft  $h "png"))
    $null = $urls.Add((WIX_ftj $h))
}
foreach ($h in $ids_fj)  { $null = $urls.Add((WIX_fj $h)); $null = $urls.Add((WIX_ftj $h)) }
foreach ($h in $ids_fc2) { $null = $urls.Add((WIX_fc2 $h)) }

@(
    "${BASE}45ed80_92549a86ddee4d4da354786c360a2e06~mv2.gif",
    "${BASE}45ed80_9dd886909dd64502a3ad673c3fa72790~mv2.png/v1/fill/w_900,h_675,q_90,enc_avif,quality_auto/45ed80_9dd886909dd64502a3ad673c3fa72790~mv2.png",
    "${BASE}45ed80_9dd886909dd64502a3ad673c3fa72790~mv2.png/v1/fit/w_980,h_551,q_90,enc_avif,quality_auto/45ed80_9dd886909dd64502a3ad673c3fa72790~mv2.png",
    "${BASE}1d4c57a128494063263ab6f729596843.jpg/v1/fill/w_600,h_600,q_90,enc_avif,quality_auto/1d4c57a128494063263ab6f729596843.jpg",
    "${BASE}704318ee9be94acabf28919a734951b8.jpg/v1/fill/w_900,h_675,q_90,enc_avif,quality_auto/704318ee9be94acabf28919a734951b8.jpg"
) | ForEach-Object { $null = $urls.Add($_) }

# URLs trouvees directement dans le HTML
if (Test-Path $HTML_FILE) {
    $rawHtml = [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot $HTML_FILE))
    $found = [regex]::Matches($rawHtml, 'https://static\.wixstatic\.com/media/[^\s"'']+')
    foreach ($m in $found) { $null = $urls.Add($m.Value) }
}

# ── Nom de fichier local ──────────────────────────────────────────────────────
function Get-LocalName($url) {
    $ext = if ($url -match '\.gif') { "gif" } elseif ($url -match '\.png') { "png" } else { "jpg" }
    $md5  = [System.Security.Cryptography.MD5]::Create()
    $hash = ($md5.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($url)) | ForEach-Object { $_.ToString("x2") }) -join ""
    return "$($hash.Substring(0,12)).$ext"
}

# ── Telechargement ────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Portfolio Wix -> Local" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Dossier : $PSScriptRoot" -ForegroundColor DarkGray
Write-Host ""

if (-not (Test-Path $HTML_FILE)) {
    Write-Host "ERREUR : '$HTML_FILE' introuvable." -ForegroundColor Red
    Write-Host "Verifie que portfolio.html est dans : $PSScriptRoot" -ForegroundColor Yellow
    Read-Host "Entree pour quitter"
    exit
}

New-Item -ItemType Directory -Force -Path $ASSETS_DIR | Out-Null

$urlMap  = @{}
$total   = $urls.Count
$done    = 0; $skipped = 0; $errors = 0

$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

Write-Host "Telechargement de $total images -> .\$ASSETS_DIR\" -ForegroundColor Yellow
Write-Host ""

foreach ($url in $urls) {
    $fname = Get-LocalName $url
    $local = Join-Path $ASSETS_DIR $fname
    $urlMap[$url] = "./$ASSETS_DIR/$fname"

    if (Test-Path $local) { $skipped++; $done++; continue }

    try {
        $wc.DownloadFile($url, (Join-Path $PSScriptRoot $local))
        $done++
    } catch {
        $errors++; $done++
    }
    $pct = [int]($done / $total * 100)
    Write-Progress -Activity "Telechargement" -Status "$done/$total  ($errors echecs)" -PercentComplete $pct
    Start-Sleep -Milliseconds 40
}

Write-Progress -Activity "Telechargement" -Completed
Write-Host "Telecharges : $($done - $skipped - $errors)  |  Deja presents : $skipped  |  Echecs : $errors" -ForegroundColor Green

# ── Patch HTML ────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "Mise a jour des chemins dans $HTML_FILE ..." -ForegroundColor Yellow

$html = [System.IO.File]::ReadAllText((Join-Path $PSScriptRoot $HTML_FILE))
$replaced = 0

foreach ($url in ($urlMap.Keys | Sort-Object { $_.Length } -Descending)) {
    if ($html.Contains($url)) {
        $html = $html.Replace($url, $urlMap[$url])
        $replaced++
    }
}

$outFile = Join-Path $PSScriptRoot "portfolio_local.html"
[System.IO.File]::WriteAllText($outFile, $html, [System.Text.Encoding]::UTF8)

Write-Host "$replaced URLs remplacees -> portfolio_local.html" -ForegroundColor Green
Write-Host ""
Write-Host "Etapes suivantes :" -ForegroundColor Cyan
Write-Host "  1. git add portfolio_local.html assets/" -ForegroundColor White
Write-Host "  2. git commit -m 'local assets'" -ForegroundColor White
Write-Host "  3. git push" -ForegroundColor White
Write-Host ""
Write-Host "Pour GitHub Pages : renomme portfolio_local.html -> index.html" -ForegroundColor Yellow
Write-Host ""
Read-Host "Appuie sur Entree pour quitter"
