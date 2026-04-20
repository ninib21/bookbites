# Test backup script that loads environment from .env file
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

# Run backup
& .\backup-database.ps1
