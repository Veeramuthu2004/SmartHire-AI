# Start backend and frontend for Windows (PowerShell)
# Usage: .\scripts\start-dev.ps1

$projectRoot = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

function Test-PortInUse {
    param([int]$Port)
    try {
        $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction Stop
        return $conn -ne $null
    }
    catch {
        return $false
    }
}

$backendPort = 8000
$frontendPort = 3000

if (-not (Test-Path (Join-Path $backendPath "venv\Scripts\python.exe"))) {
    Write-Error "Backend virtual environment not found at backend\\venv\\Scripts\\python.exe"
    exit 1
}

if (Test-PortInUse -Port $backendPort) {
    Write-Host "Backend port $backendPort is already in use. Reusing existing backend."
    $backend = $null
}
else {
    $backend = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port $backendPort --reload" -PassThru
}

if (Test-PortInUse -Port $frontendPort) {
    Write-Host "Frontend port $frontendPort is already in use. Starting on 5173 instead."
    $frontendPort = 5173
}

$frontend = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm run dev -- --host 127.0.0.1 --port $frontendPort" -PassThru

Write-Host "Started frontend on http://127.0.0.1:$frontendPort (pid=$($frontend.Id))."
if ($backend) {
    Write-Host "Started backend on http://127.0.0.1:$backendPort (pid=$($backend.Id))."
}
Write-Host "Close the spawned terminal windows to stop these processes."