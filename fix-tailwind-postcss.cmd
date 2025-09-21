@echo off
setlocal enabledelayedexpansion

echo [INFO] Fixing Tailwind/PostCSS setup for Next.js...

REM 1) pnpm vorhanden?
where pnpm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] pnpm nicht gefunden. Installiere mit: npm i -g pnpm
  exit /b 1
)

REM 2) Dev-Dependencies
echo [INFO] Installing dev deps: @tailwindcss/postcss tailwindcss postcss
pnpm add -D @tailwindcss/postcss tailwindcss postcss
if errorlevel 1 (
  echo [ERROR] Installation fehlgeschlagen. Netzwerk/Registry pruefen.
  exit /b 1
)

REM 3) postcss.config.js schreiben
echo [INFO] Writing postcss.config.js
> postcss.config.js (
  echo module.exports = {
  echo   plugins: {
  echo     "@tailwindcss/postcss": {},
  echo   },
  echo };
)

REM 4) tailwind.config.ts anlegen falls fehlt
if not exist tailwind.config.ts (
  echo [INFO] Writing tailwind.config.ts
  > tailwind.config.ts (
    echo import type ^{ Config ^} from "tailwindcss";
    echo.
    echo export default ^{
    echo   content: [
    echo     "./app/**/*.{ts,tsx,js,jsx,mdx}",
    echo     "./src/**/*.{ts,tsx,js,jsx,mdx}",
    echo     "./components/**/*.{ts,tsx,js,jsx,mdx}",
    echo   ],
    echo   theme: ^{ extend: ^{} ^},
    echo   plugins: [],
    echo ^} satisfies Config;
  )
) else (
  echo [SKIP] tailwind.config.ts existiert bereits.
)

REM 5) app\globals.css sicherstellen + Tailwind-Import
if not exist "app" mkdir "app"
if not exist "app\globals.css" (
  echo [INFO] Creating app\globals.css
  > "app\globals.css" echo @import "tailwindcss";
) else (
  findstr /C:"@import \"tailwindcss\"" "app\globals.css" >nul 2>&1
  if errorlevel 1 (
    echo [INFO] Adding Tailwind import to app\globals.css
    echo @import "tailwindcss";>>"app\globals.css"
  ) else (
    echo [SKIP] Tailwind-Import bereits vorhanden.
  )
)

REM 6) layout.tsx finden (app/ oder src/app/) und Import pruefen
set "LAYOUT_APP=app\layout.tsx"
set "LAYOUT_SRC=src\app\layout.tsx"
set "TARGET_LAYOUT="

if exist "%LAYOUT_APP%" set "TARGET_LAYOUT=%LAYOUT_APP%"
if exist "%LAYOUT_SRC%" set "TARGET_LAYOUT=%LAYOUT_SRC%"

if "%TARGET_LAYOUT%"=="" (
  echo [WARN] Keine layout.tsx gefunden. Fuege manuell hinzu: import "./globals.css";
) else (
  findstr /C:"import \"./globals.css\"" "%TARGET_LAYOUT%" >nul 2>&1
  if errorlevel 1 (
    echo [INFO] Appending import to %TARGET_LAYOUT%
    echo import "./globals.css";>>"%TARGET_LAYOUT%"
  ) else (
    echo [SKIP] Import bereits vorhanden.
  )
)

REM 7) Dev-Server starten (zuerst pnpm, sonst npm)
echo [INFO] Starte Dev-Server...
pnpm dev
if errorlevel 1 (
  echo [WARN] pnpm dev fehlgeschlagen. Versuche npm run dev...
  npm run dev
)

exit /b
