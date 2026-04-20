# Sync backups to AWS S3
# Requires AWS CLI to be installed and configured
# Usage: .\sync-to-s3.ps1 -Bucket "your-backup-bucket"

param(
    [Parameter(Mandatory=$true)]
    [string]$Bucket,
    [string]$BackupPath = "..\backups",
    [string]$S3Prefix = "pretty-party-sweets/backups"
)

Write-Host "Syncing backups to AWS S3..." -ForegroundColor Cyan
Write-Host "Bucket: $Bucket" -ForegroundColor Cyan
Write-Host "Source: $BackupPath" -ForegroundColor Cyan
Write-Host "Destination: s3://$Bucket/$S3Prefix/" -ForegroundColor Cyan
Write-Host ""

# Check if AWS CLI is installed
try {
    $AwsVersion = aws --version 2>&1
    Write-Host "AWS CLI found: $AwsVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: AWS CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "  https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html" -ForegroundColor Yellow
    exit 1
}

# Check if AWS credentials are configured
try {
    $AwsIdentity = aws sts get-caller-identity 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Not authenticated"
    }
    Write-Host "AWS credentials configured" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: AWS credentials not configured. Run:" -ForegroundColor Red
    Write-Host "  aws configure" -ForegroundColor Yellow
    exit 1
}

# Sync to S3 (only .zip files, exclude logs)
Write-Host "Starting sync..." -ForegroundColor Cyan
try {
    aws s3 sync $BackupPath s3://$Bucket/$S3Prefix/ --exclude "*.log" --storage-class STANDARD_IA
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! Backups synced to S3" -ForegroundColor Green
        Write-Host ""
        Write-Host "To verify:" -ForegroundColor Yellow
        Write-Host "  aws s3 ls s3://$Bucket/$S3Prefix/" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To set up automated sync, add to Task Scheduler:" -ForegroundColor Yellow
        Write-Host "  Command: PowerShell.exe" -ForegroundColor Yellow
        Write-Host "  Arguments: -File `"$PSScriptRoot\sync-to-s3.ps1`" -Bucket `"$Bucket`"" -ForegroundColor Yellow
    } else {
        throw "AWS S3 sync failed with exit code $LASTEXITCODE"
    }
}
catch {
    Write-Host "ERROR: Sync failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
