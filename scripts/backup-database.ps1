# Pretty Party Sweets - Database Backup Script
# Usage: .\scripts\backup-database.ps1
# Or with custom path: .\scripts\backup-database.ps1 -BackupPath "C:\Custom\Path"

param(
    [string]$BackupPath = ".\backups",
    [string]$DatabaseUrl = $env:DATABASE_URL
)

# Configuration
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "backup_$Timestamp.sql"
$BackupFullPath = Join-Path $BackupPath $BackupFile
$LogFile = Join-Path $BackupPath "backup.log"

# Ensure backup directory exists
if (!(Test-Path $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
    Write-Host "Created backup directory: $BackupPath" -ForegroundColor Green
}

# Logging function
function Write-Log {
    param([string]$Message)
    $LogEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $Message"
    Add-Content -Path $LogFile -Value $LogEntry
    Write-Host $Message
}

Write-Log "Starting database backup..."

# Check if DATABASE_URL is set
if ([string]::IsNullOrEmpty($DatabaseUrl)) {
    Write-Log "ERROR: DATABASE_URL environment variable not set"
    exit 1
}

# Parse database URL (PostgreSQL format: postgresql://user:pass@host:port/dbname)
if ($DatabaseUrl -match 'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(\w+)') {
    $DbUser = $matches[1]
    $DbPass = $matches[2]
    $DbHost = $matches[3]
    $DbPort = $matches[4]
    $DbName = $matches[5]
    
    Write-Log "Backing up database: $DbName from $DbHost"
    
    # Set password environment variable for pg_dump
    $env:PGPASSWORD = $DbPass
    
    # Perform backup
    try {
        pg_dump -h $DbHost -p $DbPort -U $DbUser -d $DbName -f $BackupFullPath
        
        if ($LASTEXITCODE -eq 0) {
            $FileSize = (Get-Item $BackupFullPath).Length / 1MB
            Write-Log "Backup completed successfully: $BackupFile ($([math]::Round($FileSize, 2)) MB)"
            
            # Compress backup
            $ZipFile = "$BackupFullPath.zip"
            Compress-Archive -Path $BackupFullPath -DestinationPath $ZipFile -Force
            Remove-Item $BackupFullPath
            
            $ZipSize = (Get-Item $ZipFile).Length / 1MB
            Write-Log "Backup compressed: backup_$Timestamp.sql.zip ($([math]::Round($ZipSize, 2)) MB)"
            
            # Clean up old backups (keep last 30 days)
            $CutoffDate = (Get-Date).AddDays(-30)
            Get-ChildItem $BackupPath -Filter "backup_*.zip" | Where-Object {
                $_.CreationTime -lt $CutoffDate
            } | ForEach-Object {
                Write-Log "Removing old backup: $($_.Name)"
                Remove-Item $_.FullName
            }
            
            Write-Log "Backup process completed successfully"
            exit 0
        } else {
            Write-Log "ERROR: pg_dump failed with exit code $LASTEXITCODE"
            exit 1
        }
    }
    catch {
        Write-Log "ERROR: $($_.Exception.Message)"
        exit 1
    }
    finally {
        # Clear password from environment
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}
# SQLite backup (for local development)
elseif ($DatabaseUrl -match 'file:(.+)') {
    $DbFile = $matches[1]
    if ($DbFile -eq './dev.db') {
        $DbFile = 'prisma\dev.db'
    }
    
    # Resolve relative path from script location
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $ProjectRoot = Split-Path -Parent $ScriptDir
    $DbFile = Join-Path $ProjectRoot $DbFile
    $BackupFullPath = Join-Path $ProjectRoot $BackupFullPath
    $LogFile = Join-Path $ProjectRoot $LogFile
    
    Write-Log "Backing up SQLite database: $DbFile"
    
    try {
        # Copy SQLite database file
        Copy-Item $DbFile $BackupFullPath -Force
        
        $FileSize = (Get-Item $BackupFullPath).Length / 1MB
        Write-Log "Backup completed: $BackupFile ($([math]::Round($FileSize, 2)) MB)"
        
        # Compress backup
        $ZipFile = "$BackupFullPath.zip"
        Compress-Archive -Path $BackupFullPath -DestinationPath $ZipFile -Force
        Remove-Item $BackupFullPath
        
        Write-Log "Backup compressed: backup_$Timestamp.sql.zip"
        
        # Clean up old backups (keep last 30 days)
        $CutoffDate = (Get-Date).AddDays(-30)
        Get-ChildItem $BackupPath -Filter "backup_*.zip" | Where-Object {
            $_.CreationTime -lt $CutoffDate
        } | ForEach-Object {
            Write-Log "Removing old backup: $($_.Name)"
            Remove-Item $_.FullName
        }
        
        Write-Log "Backup process completed successfully"
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
