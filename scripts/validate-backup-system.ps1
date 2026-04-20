# Validate Backup System
Write-Host ""
Write-Host "BACKUP SYSTEM VALIDATION" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

$Passed = 0
$Total = 0

# Get paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Test 1
$Total++
if (Test-Path "$ProjectRoot\.env") {
    Write-Host "✓ Environment file exists" -ForegroundColor Green
    $Passed++
} else {
    Write-Host "✗ Environment file missing" -ForegroundColor Red
}

# Test 2
$Total++
if (Test-Path "$ProjectRoot\backups") {
    Write-Host "✓ Backup directory exists" -ForegroundColor Green
    $Passed++
} else {
    Write-Host "✗ Backup directory missing" -ForegroundColor Red
}

# Test 3
$Total++
$Backups = Get-ChildItem "$ProjectRoot\backups" -Filter "backup_*.zip" -ErrorAction SilentlyContinue
if ($Backups -and $Backups.Count -gt 0) {
    Write-Host "✓ Found $($Backups.Count) backup(s)" -ForegroundColor Green
    $Passed++
} else {
    Write-Host "✗ No backup files found" -ForegroundColor Red
}

# Test 4
if ($Backups -and $Backups.Count -gt 0) {
    $Total++
    $Latest = $Backups | Sort-Object CreationTime -Descending | Select-Object -First 1
    $Age = (Get-Date) - $Latest.CreationTime
    if ($Age.TotalHours -lt 24) {
        Write-Host "✓ Latest backup is current ($([math]::Round($Age.TotalHours, 1))h old)" -ForegroundColor Green
        $Passed++
    } else {
        Write-Host "✗ Latest backup is old ($([math]::Round($Age.TotalHours, 1))h old)" -ForegroundColor Red
    }
}

# Test 5
$Total++
if (Test-Path "$ScriptDir\backup-database.ps1") {
    Write-Host "✓ Backup script exists" -ForegroundColor Green
    $Passed++
} else {
    Write-Host "✗ Backup script missing" -ForegroundColor Red
}

# Test 6
$Total++
if (Test-Path "$ScriptDir\restore-database.ps1") {
    Write-Host "✓ Restore script exists" -ForegroundColor Green
    $Passed++
} else {
    Write-Host "✗ Restore script missing" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "========================" -ForegroundColor Cyan
Write-Host "RESULTS: $Passed / $Total passed" -ForegroundColor $(if ($Passed -eq $Total) { "Green" } else { "Yellow" })
Write-Host ""

if ($Passed -eq $Total) {
    Write-Host "✓ Backup system is ready!" -ForegroundColor Green
} else {
    Write-Host "✗ Some checks failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Quick Commands:" -ForegroundColor Cyan
Write-Host "  Test backup:    .\test-backup.ps1" -ForegroundColor Yellow
Write-Host "  Test restore:   .\test-restore.ps1" -ForegroundColor Yellow
Write-Host "  Setup auto:     .\setup-automated-backup.ps1" -ForegroundColor Yellow
Write-Host "  Sync to S3:     .\sync-to-s3.ps1 -Bucket your-bucket" -ForegroundColor Yellow
Write-Host ""
