# Test restore script that loads environment from .env file
$EnvFile = "..\.env"

# Load environment variables from .env file
if (Test-Path $EnvFile) {
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^([^#][^=]*)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            [Environment]::SetEnvironmentVariable($key, $value)
        }
    }
}

# Find latest backup
$BackupDir = "..\backups"
$LatestBackup = Get-ChildItem $BackupDir -Filter "backup_*.zip" | Sort-Object CreationTime -Descending | Select-Object -First 1

if (!$LatestBackup) {
    Write-Host "ERROR: No backup files found in $BackupDir" -ForegroundColor Red
    exit 1
}

Write-Host "Latest backup found: $($LatestBackup.Name)" -ForegroundColor Green
Write-Host "Created: $($LatestBackup.CreationTime)" -ForegroundColor Green
Write-Host "Size: $([math]::Round($LatestBackup.Length / 1KB, 2)) KB" -ForegroundColor Green
Write-Host ""

# Confirm restore
Write-Host "WARNING: This will OVERWRITE your current database!" -ForegroundColor Red
$Confirm = Read-Host "Type 'RESTORE' to test restore from this backup"

if ($Confirm -eq "RESTORE") {
    & .\restore-database.ps1 -BackupFile $LatestBackup.FullName
} else {
    Write-Host "Restore cancelled." -ForegroundColor Yellow
}
