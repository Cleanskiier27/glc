# Scans for Bluetooth devices and writes public/bluetooth-devices.json for the overlay map.
# Requires Windows PowerShell 5.1 (uses WinRT projections).
param(
    [int]$ScanSeconds = 12,
    [string]$OutFile = (Join-Path $PSScriptRoot '..\public\bluetooth-devices.json')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[void][Windows.Devices.Geolocation.Geolocator, Windows.Devices.Geolocation, ContentType = WindowsRuntime]

function Format-Address([string]$hex) { ($hex -split '(..)' -ne '') -join ':' }

# Windows PowerShell can't subscribe to WinRT events, so await async operations through AsTask instead.
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() |
    Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } |
    Select-Object -First 1
function Wait-WinRT($operation, [type]$resultType, [int]$timeoutMs) {
    $task = $asTask.MakeGenericMethod($resultType).Invoke($null, @($operation))
    if (-not $task.Wait($timeoutMs)) { throw "Timed out after $timeoutMs ms" }
    $task.Result
}

# Paired / remembered devices (no signal strength available for these).
$paired = @(Get-PnpDevice -Class Bluetooth -ErrorAction SilentlyContinue |
    Where-Object { $_.InstanceId -match '^BTH(ENUM|LE)\\DEV_([0-9A-F]{12})' } |
    ForEach-Object {
        $null = $_.InstanceId -match 'DEV_([0-9A-F]{12})'
        [pscustomobject]@{
            name    = $_.FriendlyName
            address = Format-Address $Matches[1]
            type    = if ($_.InstanceId -like 'BTHLE*') { 'le' } else { 'classic' }
        }
    } | Sort-Object address -Unique)

# Devices in range right now: listen for Bluetooth LE advertisements (scripts/ble_scan.py, needs bleak).
# Classic-only devices do not advertise, so they only appear in the paired list.
$python = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'
if (-not (Test-Path $python)) { throw "Missing $python. Run: python -m venv scripts\.venv; scripts\.venv\Scripts\python -m pip install bleak" }
$raw = & $python (Join-Path $PSScriptRoot 'ble_scan.py') $ScanSeconds
if ($LASTEXITCODE -ne 0) { throw "ble_scan.py failed with exit code $LASTEXITCODE" }
$parsed = ($raw | Out-String) | ConvertFrom-Json
$nearby = @($parsed)

# This computer's position from Windows location services, if allowed.
$location = $null
try {
    $pos = Wait-WinRT ([Windows.Devices.Geolocation.Geolocator]::new().GetGeopositionAsync()) ([Windows.Devices.Geolocation.Geoposition]) 15000
    $c = $pos.Coordinate
    $location = [pscustomobject]@{
        lat            = $c.Point.Position.Latitude
        lng            = $c.Point.Position.Longitude
        accuracyMeters = [math]::Round($c.Accuracy)
        source         = "$($c.PositionSource)"
    }
} catch {
    $msg = if ($_.Exception.InnerException) { $_.Exception.InnerException.Message } else { $_.Exception.Message }
    Write-Warning "Windows location unavailable: $msg"
}

$result = [pscustomobject]@{
    scannedAt = (Get-Date).ToUniversalTime().ToString('o')
    location  = $location
    nearby    = $nearby
    paired    = $paired
}
$json = ConvertTo-Json -InputObject $result -Depth 5
[System.IO.File]::WriteAllText([System.IO.Path]::GetFullPath($OutFile), $json, [System.Text.UTF8Encoding]::new($false))
"in range: $($nearby.Count) | paired: $($paired.Count) | location: $(if ($location) { "$($location.source), +/-$($location.accuracyMeters) m" } else { 'unavailable' })"
