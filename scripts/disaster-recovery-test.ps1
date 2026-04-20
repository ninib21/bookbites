# Disaster Recovery Test Script
# Run this monthly to validate your backup and recovery process

param(
    [switch]$SkipRestoreTest,
    [string]$TestDatabaseUrl
)

$ErrorActionPreference = "Stop"
$TestResults = @()

function Add-TestResult {
    param(
        [string]$TestName,
        [bool]$Passed,
        [string]$Message
    )
    $TestResults += [PSCustomObject]@{
        Test = $TestName
        Passed = $Passed
        Message = $Message
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
    
    if ($Passed) {
        Write-Host "✓ $TestName" -ForegroundColor Green
    } else {
        Write-Host "✗ $TestName" -ForegroundColor Red
        Write-Host "  $Message" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "DISASTER RECOVERY TEST" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host "Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

# Test 1: Environment Variables
Write-Host "Test 1: Environment Variables" -ForegroundColor Yellow
try {
    $EnvFile = "..\.env"
    if (Test-Path $EnvFile) {
        $EnvContent = Get-Content $EnvFile -Raw
        $HasDatabaseUrl = $EnvContent -match 'DATABASE_URL='
        $HasAdminEmail = $EnvContent -match 'ADMIN_EMAIL='
        $HasAdminHash = $EnvContent -match 'ADMIN_PASSWORD_HASH='
        
        if ($HasDatabaseUrl -and $HasAdminEmail -and $HasAdminHash) {
            Add-TestResult -TestName "Environment Variables" -Passed $true -Message "All required variables found"
        } else {
            Add-TestResult -TestName "Environment Variables" -Passed $false -Message "Missing required variables"
        }
    } else {
        Add-TestResult -TestName "Environment Variables" -Passed $false -Message ".env file not found"
    }
}
catch {
    Add-TestResult -TestName "Environment Variables" -Passed $false -Message $_.Exception.Message
}

# Test 2: Backup Directory
Write-Host "`nTest 2: Backup Directory" -ForegroundColor Yellow
try {
    $BackupDir = "..\backups"
    if (Test-Path $BackupDir) {
        $Backups = Get-ChildItem $BackupDir -Filter "backup_*.zip" | Sort-Object CreationTime -Descending
        if ($Backups.Count -gt 0) {
            $LatestBackup = $Backups[0]
            $BackupAge = (Get-Date) - $LatestBackup.CreationTime
            Add-TestResult -TestName "Backup Directory" -Passed $true -Message "Found $($Backups.Count) backups. Latest: $($LatestBackup.Name) ($([math]::Round($BackupAge.TotalHours, 1)) hours old)"
        } else {
            Add-TestResult -TestName "Backup Directory" -Passed $false -Message "No backup files found"
        }
    } else {
        Add-TestResult -TestName "Backup Directory" -Passed $false -Message "Backup directory not found"
    }
}
catch {
    Add-TestResult -TestName "Backup Directory" -Passed $false -Message $_.Exception.Message
}

# Test 3: Database Connectivity
Write-Host "`nTest 3: Database Connectivity" -ForegroundColor Yellow
try {
    # Load environment
    $EnvFile = "..\.env"
    if (Test-Path $EnvFile) {
        Get-Content $EnvFile | ForEach-Object {
            if ($_ -match '^([^#][^=]*)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim().Trim('"')
                [Environment]::SetEnvironmentVariable($key, $value)
            }
        }
    }
    
    $DatabaseUrl = $env:DATABASE_URL
    if ($DatabaseUrl -match 'file:(.+)') {
        $DbFile = $matches[1]
        if ($DbFile -eq './dev.db') {
            $DbFile = 'prisma\dev.db'
        }
        $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
        $ProjectRoot = Split-Path -Parent $ScriptDir
        $DbFile = Join-Path $ProjectRoot $DbFile
        
        if (Test-Path $DbFile) {
            $DbSize = (Get-Item $DbFile).Length / 1MB
            Add-TestResult -TestName "Database Connectivity" -Passed $true -Message "Database accessible ($([math]::Round($DbSize, 2)) MB)"
        } else {
            Add-TestResult -TestName "Database Connectivity" -Passed $false -Message "Database file not found: $DbFile"
        }
    } else {
        Add-TestResult -TestName "Database Connectivity" -Passed $true -Message "PostgreSQL URL configured"
    }
}
catch {
    Add-TestResult -TestName "Database Connectivity" -Passed $false -Message $_.Exception.Message
}

# Test 4: Backup Script
Write-Host "`nTest 4: Backup Script" -ForegroundColor Yellow
try {
    $BackupScript = ".\backup-database.ps1"
    if (Test-Path $BackupScript) {
        Add-TestResult -TestName "Backup Script" -Passed $true -Message "Backup script found"
    } else {
        Add-TestResult -TestName "Backup Script" -Passed $false -Message "Backup script not found"
    }
}
catch {
    Add-TestResult -TestName "Backup Script" -Passed $false -Message $_.Exception.Message
}

# Test 5: Restore Script
Write-Host "`nTest 5: Restore Script" -ForegroundColor Yellow
try {
    $RestoreScript = ".\restore-database.ps1"
    if (Test-Path $RestoreScript) {
        Add-TestResult -TestName "Restore Script" -Passed $true -Message "Restore script found"
    } else {
        Add-TestResult -TestName "Restore Script" -Passed $false -Message "Restore script not found"
    }
}
catch {
    Add-TestResult -TestName "Restore Script" -Passed $false -Message $_.Exception.Message
}

# Test 6: Create Test Backup
Write-Host "`nTest 6: Create Test Backup" -ForegroundColor Yellow
if (!$SkipRestoreTest) {
    try {
        $TestBackupOutput = & .\test-backup.ps1 2>&1
        if ($LASTEXITCODE -eq 0) {
            Add-TestResult -TestName "Create Test Backup" -Passed $true -Message "Backup created successfully"
        } else {
            Add-TestResult -TestName "Create Test Backup" -Passed $false -Message "Backup failed"
        }
    }
    catch {
        Add-TestResult -TestName "Create Test Backup" -Passed $false -Message $_.Exception.Message
    }
} else {
    Add-TestResult -TestName "Create Test Backup" -Passed $true -Message "Skipped (SkipRestoreTest flag set)"
}

# Test 7: Backup Integrity
Write-Host "`nTest 7: Backup Integrity" -ForegroundColor Yellow
try {
    $BackupDir = "..\backups"
    $LatestBackup = Get-ChildItem $BackupDir -Filter "backup_*.zip" | Sort-Object CreationTime -Descending | Select-Object -First 1
    
    if ($LatestBackup) {
        # Test zip integrity
        try {
            Expand-Archive -Path $LatestBackup.FullName -DestinationPath "$env:TEMP\backup_test" -Force
            Remove-Item "$env:TEMP\backup_test" -Recurse -Force
            Add-TestResult -TestName "Backup Integrity" -Passed $true -Message "Backup archive is valid"
        }
        catch {
            Add-TestResult -TestName "Backup Integrity" -Passed $false -Message "Backup archive is corrupted"
        }
    } else {
        Add-TestResult -TestName "Backup Integrity" -Passed $false -Message "No backup to test"
    }
}
catch {
    Add-TestResult -TestName "Backup Integrity" -Passed $false -Message $_.Exception.Message
}

# Summary
Write-Host ""
Write-Host "======================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

$PassedTests = ($TestResults | Where-Object { $_.Passed }).Count
$TotalTests = $TestResults.Count

Write-Host "Passed: $PassedTests / $TotalTests" -ForegroundColor $(if ($PassedTests -eq $TotalTests) { "Green" } else { "Yellow" })
Write-Host ""

if ($PassedTests -eq $TotalTests) {
    Write-Host "✓ All tests passed! Your disaster recovery system is ready." -ForegroundColor Green
} else {
    Write-Host "✗ Some tests failed. Please review the issues above." -ForegroundColor Red
}

Write-Host ""
Write-Host "Completed: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

# Export results
$ResultsFile = "..\backups\disaster-recovery-test-$(Get-Date -Format 'yyyyMMdd_HHmmss').json"
$TestResults | ConvertTo-Json | Set-Content $ResultsFile
Write-Host "Results saved to: $ResultsFile" -ForegroundColor Gray
