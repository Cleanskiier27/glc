# Deploy Moonbase Alpha Infrastructure (Simulation)
Write-Host "🚀 Initializing Moonbase Alpha Infrastructure Deployment..." -ForegroundColor Cyan
Write-Host "📍 Target: Shackleton Crater, Lunar South Pole" -ForegroundColor Yellow

$modules = @("Command Center", "Data Core", "Solar Array", "Nuclear Reactor", "Life Support")

foreach ($module in $modules) {
    Write-Host "📦 Deploying $module..." -NoNewline
    Start-Sleep -Seconds 1
    Write-Host " [OK]" -ForegroundColor Green
}

Write-Host "📡 Establishing Earth Link (1.3s latency)..." -NoNewline
Start-Sleep -Seconds 2
Write-Host " [ESTABLISHED]" -ForegroundColor Green

Write-Host "🌕 Moonbase Alpha is now OPERATIONAL." -ForegroundColor Cyan
