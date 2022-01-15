$ErrorActionPreference = "Stop"

$ModulesPath = "../../modules"
$GitHub = "https://github.com/Tungsten78"

Write-Host "Checking for modules..."
if (-not (Test-Path -Path $ModulesPath)) {
    Write-Host "Expecting modules at $PWD/$ModulesPath, ensure layout is installed at `$ATTRACT_HOME/layouts/[layout]/"
    Exit 1
}

if (Test-Path -Path "$ModulesPath/gtc") {
    $HasGtc = $true
    Write-Host "Found existing gtc module"
}
if (Test-Path -Path "$ModulesPath/gtc-kb") {
    $HasGtcKb = $true
    Write-Host "Found existing gtc-kb module"
}
if (Test-Path -Path "$ModulesPath/gtc-pas") {
    $HasGtcPas = $true
    Write-Host "Found existing gtc-pas module"
}

if (($HasGtc -eq $true) -and ($HasGtcKb -eq $true) -and ($HasGtcPas -eq $true)) {
    Write-Host "All modules already present, exiting.."
    Exit 0
}

Write-Host "Creating scratch folder"
New-Item -ItemType directory scratch | Out-Null
cd scratch

if (-not $HasGtc) {
    Write-Host "gtc module - download and unzip"
    Remove-Item -Path * -Recurse
    Invoke-WebRequest -Uri $GitHub/gtc/archive/refs/heads/master.zip -OutFile master.zip
    Expand-Archive -Path master.zip -DestinationPath .
    Rename-Item -Path gtc-master -NewName gtc
    Move-Item -Path gtc -Destination ../$ModulesPath
}

if (-not $HasGtcKb) {
    Write-Host "gtc-kb module - download and unzip"
    Remove-Item -Path * -Recurse
    Invoke-WebRequest -Uri $GitHub/gtc-kb/archive/refs/heads/master.zip -OutFile master.zip
    Expand-Archive -Path master.zip -DestinationPath .
    Rename-Item -Path gtc-kb-master -NewName gtc-kb
    Move-Item -Path gtc-kb -Destination ../$ModulesPath
}

if (-not $HasGtcPas) {
    Write-Host "gtc-pas module - download and unzip"
    Remove-Item -Path * -Recurse
    Invoke-WebRequest -Uri $GitHub/gtc-pas/archive/refs/heads/master.zip -OutFile master.zip
    Expand-Archive -Path master.zip -DestinationPath .
    Rename-Item -Path gtc-pas-master -NewName gtc-pas
    Move-Item -Path gtc-pas -Destination ../$ModulesPath
}

Write-Host "Cleaning up..."
cd ..
Remove-Item -Path scratch -Recurse

Write-Host "Done"