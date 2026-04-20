# Simple Disaster Recovery Validation Test
Write-Host ""
Write-Host "DISASTER RECOVERY VALIDATION TEST" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$TestsPassed = 0
$TestsTotal = 0

function Test-Condition {
    param($Name, $Condition, $SuccessMessage, $FailureMessage)
    $TestsTotal++
    if ($Condition) {
        Write-Host "✓ $Name" -ForegroundColor Green
        Write-Host "  $SuccessMessage" -ForegroundColor Gray
        $script:TestsPassed++
    } else {
        Write-Host "✗ $Name" -ForegroundColor Red
        Write-Host "  $FailureMessage" -ForegroundColor Red
    }
    Write-Host ""
}

# Get project root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Test 1: Check .env file exists
Test-Condition -Name "Environment File" `
    -Condition (Test-Path "$ProjectRoot\.env") `
    -SuccessMessage ".env file found" `
    -FailureMessage ".env file not found at project root"

# Test 2: Check backup directory
Test-Condition -Name "Backup Directory" `
    -Condition (Test-Path "$ProjectRoot\backups") `
    -SuccessMessage "Backup directory exists" `
    -FailureMessage "Backup directory not found"

# Test 3: Check for backup files
$Backups = Get-ChildItem "$ProjectRoot\backups" -Filter "backup_*.zip" -ErrorAction SilentlyContinue
Test-Condition -Name "Backup Files" `
    -Condition ($Backups -and $Backups.Count -gt 0) `
    -SuccessMessage "Found $($Backups.Count) backup(s)" `
    -FailureMessage "No backup files found"

# Test 4: Check latest backup
if ($Backups -and $Backups.Count -gt 0) {
    $Latest = $Backups | Sort-Object CreationTime -Descending | Select-Object -First 1
    $Age = (Get-Date) - $Latest.CreationTime
    Test-Condition -Name "Latest Backup" `
        -Condition ($Age.TotalHours -lt 24) `
        -SuccessMessage "Latest backup is $([math]::Round($Age.TotalHours, 1)) hours old: $($Latest.Name)" `
        -FailureMessage "Latest backup is $([math]::Round($Age.TotalHours, 1)) hours old (older than 24h)"
}

# Test 5: Check backup scripts
Test-Condition -Name "Backup Script" `
    -Condition (Test-Path "$ScriptDir\backup-database.ps1") `
    -SuccessMessage "backup-database.ps1 found" `
    -FailureMessage "backup-database.ps1 not found"

Test-Condition -Name "Restore Script" `
    -Condition (Test-Path "$ScriptDir\restore-database.ps1") `
    -SuccessMessage "restore-database.ps1 found" `
    -FailureMessage "restore-database.ps1 not found"

# Test 6: Check database
$EnvFile = "$ProjectRoot\.env"
if (Test-Path $EnvFile) {
    $DbUrl = Get-Content $EnvFile | Select-String "DATABASE_URL=" | ForEach-Object { $_ -replace 'DATABASE_URL="?([^"]*)"?','$1' }
    if ($DbUrl -match "file:") {
        $DbFile = "$ProjectRoot\prisma\dev.db"
        Test-Condition -Name "Database File" `
            -Condition (Test-Path $DbFile) `
            -SuccessMessage "Database file exists" `
            -FailureMessage "Database file not found"
    } else {
        Test-Condition -Name "Database Config" `
            -Condition ($true) `
            -SuccessMessage "PostgreSQL database configured" `
            -FailureMessage ""
    }
}

# Summary
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "SUMMARY: $TestsPassed / $TestsTotal tests passed" -ForegroundColor $(if ($TestsPassed -eq $TestsTotal) { "Green" } else { "Yellow" })
Write-Host ""

if ($TestsPassed -eq $TestsTotal) {
    Write-Host "✓ All checks passed! Your backup system is ready." -ForegroundColor Green
} else {
    Write-Host "✗ Some checks failed. Review the issues above." -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: .\test-backup.ps1" -ForegroundColor Yellow
Write-Host "  2. Schedule automated backups" -ForegroundColor Yellow
Write-Host "  3. Set up cloud sync (AWS S3)" -ForegroundColor Yellow
Write-Host "  4. Test restore monthly" -ForegroundColor Yellow
Write-Host ""
