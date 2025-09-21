@echo off
setlocal ENABLEDELAYEDEXPANSION

REM === Einstellungen (bei Bedarf anpassen) ================================
set "REPO=C:\workspace\bad_art-real_artist"
set "REMOTE_URL=https://github.com/t-wim/bad_art-real_artist.git"
REM =======================================================================

REM Commit-Message aus Parametern, sonst "update"
set "MSG=%*"
if "%MSG%"=="" set "MSG=update"

REM 1) Git vorhanden?
git --version >nul 2>&1
if errorlevel 1 (
  echo [FEHLER] Git ist nicht installiert oder nicht im PATH.
  echo Installiere Git: https://git-scm.com/download/win
  exit /b 1
)

REM 2) Ins Repo wechseln
if not exist "%REPO%\" (
  echo [FEHLER] Repo-Pfad nicht gefunden: "%REPO%"
  exit /b 1
)
cd /d "%REPO%"

REM 3) Ist es ein Git-Repo?
if not exist ".git" (
  echo [HINWEIS] Kein Git-Repo gefunden. Initialisiere...
  git init || (echo [FEHLER] git init fehlgeschlagen & exit /b 1)
)

REM 4) Remote "origin" sicherstellen/setzen
for /f "delims=" %%u in ('git remote get-url origin 2^>nul') do set "CUR_REMOTE=%%u"
if "%CUR_REMOTE%"=="" (
  echo [INFO] Setze Remote origin: %REMOTE_URL%
  git remote add origin "%REMOTE_URL%" || (echo [FEHLER] Remote setzen fehlgeschlagen & exit /b 1)
) else (
  REM Optional: falls URL abweicht, aktualisieren
  if /i not "%CUR_REMOTE%"=="%REMOTE_URL%" (
    echo [INFO] Aktualisiere Remote origin-URL
    git remote set-url origin "%REMOTE_URL%" || (echo [FEHLER] Remote-URL setzen fehlgeschlagen & exit /b 1)
  )
)

REM 5) Aktuellen Branch ermitteln (Fallback: main)
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "BR=%%b"
if "%BR%"=="" set "BR=main"
if /i "%BR%"=="HEAD" set "BR=main"

REM 6) Falls Branch lokal nicht existiert (z.B. frisches init), erstellen/umbenennen
git rev-parse --verify "%BR%" >nul 2>&1
if errorlevel 1 (
  REM wenn master existiert, auf main umbenennen; sonst neuen main erzeugen
  git rev-parse --verify master >nul 2>&1 && git branch -M master main
  for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "BR=%%b"
)

echo [INFO] Branch: %BR%

REM 7) Änderungen vormerken und committen
git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "%MSG%" || (echo [FEHLER] Commit fehlgeschlagen & exit /b 1)
) else (
  echo [INFO] Nichts zu committen (Index unveraendert).
)

REM 8) Upstream vorhanden? Wenn nicht, gleich bei push setzen
set "NEED_UPSTREAM=0"
git rev-parse --abbrev-ref --symbolic-full-name @{u} >nul 2>&1
if errorlevel 1 set "NEED_UPSTREAM=1"

REM 9) Zuerst Remote holen (verhindert Non-fast-forward)
git fetch origin

REM 10) Sauber integrieren (rebase)
git pull --rebase origin %BR%
if errorlevel 1 (
  echo.
  echo [KONFLIKT] Rebase-Konflikte aufgetreten.
  echo  - Bearbeite die markierten Dateien (<<<<<<< ======= >>>>>>>)
  echo  - Dann:   git add .   und   git rebase --continue
  echo  - Zum Abbrechen:       git rebase --abort
  exit /b 2
)

REM 11) Push (bei fehlendem Upstream mit -u)
if "%NEED_UPSTREAM%"=="1" (
  git push -u origin %BR%
) else (
  git push origin %BR%
)

if errorlevel 1 (
  echo.
  echo [FEHLER] Push fehlgeschlagen.
  echo  Moegliche Ursachen:
  echo   - Non-fast-forward: Remote hat neue Commits (erneut pullen/rebasen).
  echo   - Rechte/Token: HTTPS-Login bzw. Personal Access Token pruefen.
  exit /b 1
)

echo [OK] Push erfolgreich: %BR% -> origin
endlocal
exit /b 0
