# Pretty Party Sweets - Database Restore Script
# Usage: .\scripts\restore-database.ps1 -BackupFile "backups\backup_20240115_120000.sql.zip"
# Or for SQLite: .\scripts\restore-database.ps1 -BackupFile "backups\backup_20240115_120000.sql"

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    [string]$DatabaseUrl = $env:DATABASE_URL
)

$LogFile = ".\backups\restore.log"

# Logging function
function Write-Log {
    param([string]$Message)
    $LogEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $Message"
    Add-Content -Path $LogFile -Value $LogEntry
    Write-Host $Message
}

Write-Log "Starting database restore from: $BackupFile"

# Check if backup file exists
if (!(Test-Path $BackupFile)) {
    Write-Log "ERROR: Backup file not found: $BackupFile"
    exit 1
}

# Check if DATABASE_URL is set
if ([string]::IsNullOrEmpty($DatabaseUrl)) {
    Write-Log "ERROR: DATABASE_URL environment variable not set"
    exit 1
}

# Confirm restore
Write-Host ""
Write-Host "WARNING: This will OVERWRITE the current database!" -ForegroundColor Red
Write-Host "Database: $DatabaseUrl"
Write-Host "Backup: $BackupFile"
Write-Host ""
$Confirm = Read-Host "Type 'RESTORE' to confirm"

if ($Confirm -ne "RESTORE") {
    Write-Log "Restore cancelled by user"
    exit 0
}

# Parse database URL for PostgreSQL
if ($DatabaseUrl -match 'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(\w+)') {
    $DbUser = $matches[1]
    $DbPass = $matches[2]
    $DbHost = $matches[3]
    $DbPort = $matches[4]
    $DbName = $matches[5]
    
    Write-Log "Restoring PostgreSQL database: $DbName"
    
    # Handle compressed backup
    $SqlFile = $BackupFile
    if ($BackupFile -match '\.zip$') {
        Write-Log "Extracting compressed backup..."
        $ExtractPath = [System.IO.Path]::GetTempPath()
        Expand-Archive -Path $BackupFile -DestinationPath $ExtractPath -Force
        $SqlFile = Join-Path $ExtractPath ([System.IO.Path]::GetFileNameWithoutExtension($BackupFile))
    }
    
    # Set password environment variable
    $env:PGPASSWORD = $DbPass
    
    try {
        # Restore database
        psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -f $SqlFile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Database restored successfully"
            
            # Clean up extracted file if it was compressed
            if ($BackupFile -match '\.zip$') {
                Remove-Item $SqlFile -ErrorAction SilentlyContinue
            }
            
            exit 0
        } else {
            Write-Log "ERROR: psql restore failed with exit code $LASTEXITCODE"
            exit 1
        }
    }
    catch {
        Write-Log "ERROR: $($_.Exception.Message)"
        exit 1
    }
    finally {
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}
# SQLite restore
elseif ($DatabaseUrl -match 'file:(.+)') {
    $DbFile = $matches[1]
    if ($DbFile -eq './dev.db') {
        $DbFile = 'prisma\dev.db'
    }
    
    Write-Log "Restoring SQLite database: $DbFile"
    
    try {
        # Handle compressed backup
        $SourceFile = $BackupFile
        if ($BackupFile -match '\.zip$') {
            Write-Log "Extracting compressed backup..."
            $ExtractPath = [System.IO.Path]::GetTempPath()
            Expand-Archive -Path $BackupFile -DestinationPath $ExtractPath -Force
            $SourceFile = Join-Path $ExtractPath ([System.IO.Path]::GetFileNameWithoutExtension($BackupFile))
        }
        
        # Backup current database first
        $CurrentBackup = "$DbFile.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
        if (Test-Path $DbFile) {
            Write-Log "Creating safety backup of current database..."
            Copy-Item $DbFile $CurrentBackup
        }
        
        # Restore database
        Copy-Item $SourceFile $DbFile -Force
        
        Write-Log "Database restored successfully"
        Write-Log "Safety backup saved as: $CurrentBackup"
        
        # Clean up extracted file if it was compressed
        if ($BackupFile -match '\.zip$') {
            Remove-Item $SourceFile -ErrorAction SilentlyContinue
        }
        
        exit 0
    }
    catch {
        Write-Log "ERROR: $($_.Exception.Message)"
        exit 1
    }
}
else {
    Write-Log "ERROR: Unable to parse DATABASE_URL format"
    exit 1
}
