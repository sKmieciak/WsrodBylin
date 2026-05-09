param(
    [ValidateSet("frontend", "backend", "all")]
    [string]$Target = "all"
)

$VPS         = "Administrator@217.160.255.223"
$KEY         = "$env:USERPROFILE\.ssh\wsrodbylin_deploy"
$SSH_OPTS    = "-i `"$KEY`" -o StrictHostKeyChecking=no"
$VPS_DEPLOY  = "C:/inetpub/wwwroot/WsrodBylin_deploy"

$FRONTEND_SRC = "C:\Apki\WsrodBylin\Frontend\plant-store-frontend"
$BACKEND_SRC  = "C:\Apki\WsrodBylin\Backend\PlantStore.Api"

function Invoke-SSH($cmd) {
    Invoke-Expression "ssh $SSH_OPTS $VPS `"$cmd`""
}

function Deploy-Frontend {
    Write-Host "`n[FRONTEND] Building..." -ForegroundColor Cyan
    Push-Location $FRONTEND_SRC
    npm run build
    if ($LASTEXITCODE -ne 0) { Write-Error "npm build failed!"; Pop-Location; exit 1 }
    Pop-Location

    Write-Host "[FRONTEND] Uploading..." -ForegroundColor Cyan
    # Usuwamy tylko pliki frontendu (index.html + assets/), NIE ruszamy images/ ze zdjęciami produktów
    $WIN_WWWROOT = $VPS_DEPLOY.Replace('/','\') + "\wwwroot"
    Invoke-SSH "if not exist `"$WIN_WWWROOT`" mkdir `"$WIN_WWWROOT`""
    Invoke-SSH "del /q `"$WIN_WWWROOT\index.html`" 2>nul & rmdir /s /q `"$WIN_WWWROOT\assets`" 2>nul & exit 0"
    Invoke-Expression "scp $SSH_OPTS -r `"$FRONTEND_SRC\dist\.`" `"${VPS}:${VPS_DEPLOY}/wwwroot/`""
    Write-Host "[FRONTEND] Done!" -ForegroundColor Green
}

function Deploy-Backend {
    Write-Host "`n[BACKEND] Publishing..." -ForegroundColor Cyan
    Push-Location $BACKEND_SRC
    dotnet publish -c Release -r win-x64 --self-contained true -o "$BACKEND_SRC\publish" --nologo -v q
    if ($LASTEXITCODE -ne 0) { Write-Error "dotnet publish failed!"; Pop-Location; exit 1 }
    Pop-Location

    Write-Host "[BACKEND] Stopping IIS..." -ForegroundColor Cyan
    Invoke-SSH "iisreset /stop"

    Write-Host "[BACKEND] Uploading..." -ForegroundColor Cyan
    Invoke-Expression "scp $SSH_OPTS -r `"$BACKEND_SRC\publish\.`" `"${VPS}:${VPS_DEPLOY}/`""

    Write-Host "[BACKEND] Starting IIS..." -ForegroundColor Cyan
    Invoke-SSH "iisreset /start"
    Write-Host "[BACKEND] Done!" -ForegroundColor Green
}

switch ($Target) {
    "frontend" { Deploy-Frontend }
    "backend"  { Deploy-Backend }
    "all"      { Deploy-Frontend; Deploy-Backend }
}

Write-Host "`nDeploy complete! https://wsrodbylin.pl" -ForegroundColor Green
