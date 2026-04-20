# Setup automated daily backups using Windows Task Scheduler
# Run as Administrator

$TaskName = "PrettyPartySweets-DailyBackup"
$ScriptPath = Resolve-Path ".\backup-database.ps1"
$ProjectPath = Split-Path -Parent (Split-Path -Parent $ScriptPath)

Write-Host "Setting up automated daily backups for Pretty Party Sweets" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$IsAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (!$IsAdmin) {
    Write-Host "WARNING: This script should be run as Administrator for Task Scheduler setup" -ForegroundColor Yellow
    Write-Host ""
}

# Create the action
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$ScriptPath`"" -WorkingDirectory (Split-Path -Parent $ScriptPath)

# Create the trigger (daily at 2:00 AM)
$Trigger = New-ScheduledTaskTrigger -Daily -At "2:00 AM"

# Create task settings
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable

# Create the task principal (run whether user is logged on or not)
$Principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType S4U -RunLevel Highest

# Register the task
try {
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Principal $Principal -Force
    Write-Host "SUCCESS! Automated backup task created." -ForegroundColor Green
    Write-Host ""
    Write-Host "Task Details:" -ForegroundColor Cyan
    Write-Host "  Name: $TaskName"
    Write-Host "  Schedule: Daily at 2:00 AM"
    Write-Host "  Script: $ScriptPath"
    Write-Host "  Backup Location: $ProjectPath\backups"
    Write-Host ""
    Write-Host "To verify the task:" -ForegroundColor Yellow
    Write-Host "  1. Open Task Scheduler (taskschd.msc)"
    Write-Host "  2. Look for '$TaskName'"
    Write-Host "  3. Right-click and select 'Run' to test"
    Write-Host ""
    Write-Host "To remove the task:" -ForegroundColor Yellow
    Write-Host "  Unregister-ScheduledTask -TaskName $TaskName -Confirm:`$false"
}
catch {
    Write-Host "ERROR: Failed to create scheduled task" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
