[CmdletBinding()]
param(
  [string]$Root = ".\src",
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $Root)) {
  Write-Error "Root-Pfad '$Root' nicht gefunden."
  exit 1
}

Write-Host "[INFO] Scanne TSX unter $Root ..." 

# Regex, die stark für Client-Komponenten sprechen
$patterns = @(
  'from\s+["'']framer-motion["'']',            # Import framer-motion
  '\bmotion\.[A-Za-z_]+\b',                    # motion.div etc.
  '\buse(State|Effect|Ref|LayoutEffect|Memo|Callback|Reducer|Transition)\s*\(', # React Hooks
  '\b(window|document|localStorage|navigator|matchMedia)\b',                    # Browser APIs
  '\buseRouter\s*\(', '\buseSearchParams\s*\(', '\busePathname\s*\('            # Next client hooks
)

# Dateien sammeln
$files = Get-ChildItem -Path $Root -Filter *.tsx -Recurse -File

if (-not $files) {
  Write-Host "[INFO] Keine .tsx-Dateien gefunden."
  exit 0
}

# Pfade, die i.d.R. Server bleiben sollen
$specialServerFiles = @(
  '\\app\\layout\.tsx$',
  '\\app\\page\.tsx$',
  '\\app\\not-found\.tsx$'
)

$changed = 0
$skipped = 0
$serverOk = 0
$warned = 0

foreach ($f in $files) {
  $path = $f.FullName
  $rel  = Resolve-Path -Relative $path
  $name = $f.Name.ToLowerInvariant()

  $content = Get-Content $path -Raw

  # bereits client?
  if ($content -match '^\s*["'']use client["'']') {
    Write-Host "[SKIP] already client -> $rel"
    $skipped++
    continue
  }

  # 'use server' oben? dann nicht anfassen
  if ($content -match '^\s*["'']use server["'']') {
    Write-Warning "[WARN] hat 'use server' -> $rel (übersprungen)"
    $warned++
    continue
  }

  # spezielle App-Router-Dateien nicht clientisieren
  $isSpecial = $false
  foreach ($rx in $specialServerFiles) {
    if ($rel -replace '/', '\' -match $rx) { $isSpecial = $true; break }
  }

  $needsClient = $false

  # error.tsx MUSS client sein
  if ($name -eq 'error.tsx') {
    $needsClient = $true
  } else {
    foreach ($p in $patterns) {
      if ($content -match $p) { $needsClient = $true; break }
    }
  }

  if (-not $needsClient) {
    Write-Host "[INFO] server-ok      -> $rel"
    $serverOk++
    continue
  }

  if ($isSpecial) {
    Write-Warning "[WARN] special server file -> $rel (nicht geändert)"
    $warned++
    continue
  }

  # Einfügen
  $new = "'use client';`r`n" + $content
  if ($DryRun) {
    Write-Host "[DRY]  would add      -> $rel"
  } else {
    Set-Content -Path $path -Value $new -Encoding UTF8
    Write-Host "[OK]   added          -> $rel"
    $changed++
  }
}

Write-Host ""
Write-Host ("[SUMMARY] changed={0} skipped={1} server-ok={2} warned={3}" -f $changed, $skipped, $serverOk, $warned)
Write-Host "Fertig. Starte jetzt: pnpm dev"
