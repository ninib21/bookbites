# Pretty Party Sweets - Admin Credentials Recovery Script
# Usage: .\scripts\reset-admin-credentials.ps1
# This script generates new admin credentials and updates the .env file

param(
    [string]$EnvFile = ".\.env",
    [string]$NewEmail,
    [string]$NewPassword
)

Write-Host "Pretty Party Sweets - Admin Credentials Recovery" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (!(Test-Path $EnvFile)) {
    Write-Host "ERROR: .env file not found at $EnvFile" -ForegroundColor Red
    exit 1
}

# Read current .env content
$EnvContent = Get-Content $EnvFile -Raw

# Get new email if not provided
if ([string]::IsNullOrEmpty($NewEmail)) {
    $CurrentEmail = if ($EnvContent -match 'ADMIN_EMAIL="([^"]+)"') { $matches[1] } else { "" }
    Write-Host "Current admin email: $CurrentEmail"
    $NewEmail = Read-Host "Enter new admin email (or press Enter to keep current)"
    if ([string]::IsNullOrEmpty($NewEmail)) {
        $NewEmail = $CurrentEmail
    }
}

# Validate email
if ($NewEmail -notmatch '^[^@\s]+@[^@\s]+\.[^@\s]+$') {
    Write-Host "ERROR: Invalid email format" -ForegroundColor Red
    exit 1
}

# Get new password if not provided
if ([string]::IsNullOrEmpty($NewPassword)) {
    Write-Host ""
    Write-Host "Password requirements:" -ForegroundColor Yellow
    Write-Host "  - At least 12 characters"
    Write-Host "  - At least one uppercase letter"
    Write-Host "  - At least one lowercase letter"
    Write-Host "  - At least one number"
    Write-Host "  - At least one special character"
    Write-Host ""
    
    do {
        $SecurePassword = Read-Host "Enter new admin password" -AsSecureString
        $NewPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword))
        
        $ValidationErrors = @()
        
        if ($NewPassword.Length -lt 12) {
            $ValidationErrors += "Password must be at least 12 characters"
        }
        if ($NewPassword -notmatch '[A-Z]') {
            $ValidationErrors += "Password must contain at least one uppercase letter"
        }
        if ($NewPassword -notmatch '[a-z]') {
            $ValidationErrors += "Password must contain at least one lowercase letter"
        }
        if ($NewPassword -notmatch '[0-9]') {
            $ValidationErrors += "Password must contain at least one number"
        }
        if ($NewPassword -notmatch '[^a-zA-Z0-9]') {
            $ValidationErrors += "Password must contain at least one special character"
        }
        
        if ($ValidationErrors.Count -gt 0) {
            Write-Host ""
            Write-Host "Password validation failed:" -ForegroundColor Red
            $ValidationErrors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
            Write-Host ""
        }
    } while ($ValidationErrors.Count -gt 0)
}

# Confirm
Write-Host ""
Write-Host "New credentials will be:" -ForegroundColor Yellow
Write-Host "  Email: $NewEmail"
Write-Host "  Password: $($NewPassword.Substring(0, 3))$('*' * ($NewPassword.Length - 3))"
Write-Host ""
$Confirm = Read-Host "Type 'RESET' to confirm credential reset"

if ($Confirm -ne "RESET") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

# Generate password hash
Write-Host ""
Write-Host "Generating password hash..." -ForegroundColor Cyan

try {
    # Import bcryptjs (we'll use Node.js for this)
    $NodeScript = @"
const bcrypt = require('bcryptjs');
const password = process.argv[2];
bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});
"@
    
    $TempFile = [System.IO.Path]::GetTempFileName() + ".js"
    Set-Content -Path $TempFile -Value $NodeScript
    
    $Hash = node $TempFile $NewPassword
    Remove-Item $TempFile
    
    if ([string]::IsNullOrEmpty($Hash)) {
        throw "Failed to generate password hash"
    }
    
    Write-Host "Password hash generated successfully" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Failed to generate password hash. Make sure Node.js is installed." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Update .env file
Write-Host "Updating .env file..." -ForegroundColor Cyan

try {
    # Update or add ADMIN_EMAIL
    if ($EnvContent -match 'ADMIN_EMAIL="[^"]*"') {
        $EnvContent = $EnvContent -replace 'ADMIN_EMAIL="[^"]*"', "ADMIN_EMAIL=`"$NewEmail`""
    } else {
        $EnvContent += "`nADMIN_EMAIL=`"$NewEmail`""
    }
    
    # Update or add ADMIN_PASSWORD_HASH
    if ($EnvContent -match 'ADMIN_PASSWORD_HASH="[^"]*"') {
        $EnvContent = $EnvContent -replace 'ADMIN_PASSWORD_HASH="[^"]*"', "ADMIN_PASSWORD_HASH=`"$Hash`""
    } else {
        $EnvContent += "`nADMIN_PASSWORD_HASH=`"$Hash`""
    }
    
    # Remove ADMIN_PASSWORD if it exists (for security)
    $EnvContent = $EnvContent -replace '\n?ADMIN_PASSWORD="[^"]*"\n?', "`n"
    
    # Clean up multiple blank lines
    $EnvContent = $EnvContent -replace "`n`n`n+", "`n`n"
    
    # Save updated .env
    Set-Content -Path $EnvFile -Value $EnvContent
    
    Write-Host ""
    Write-Host "SUCCESS! Admin credentials have been reset." -ForegroundColor Green
    Write-Host ""
    Write-Host "New credentials:" -ForegroundColor Cyan
    Write-Host "  Email: $NewEmail"
    Write-Host "  Password: [hidden for security]"
    Write-Host ""
    Write-Host "IMPORTANT:" -ForegroundColor Yellow
    Write-Host "  1. Restart your application for changes to take effect"
    Write-Host "  2. Store the password securely (password manager)"
    Write-Host "  3. The .env file has been updated with the new hash"
    Write-Host "  4. Old sessions will remain valid until they expire"
    Write-Host ""
}
catch {
    Write-Host "ERROR: Failed to update .env file" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
