# Pretty Party Sweets - Backup & Recovery Guide

## 🔄 Database Backup System

### Overview
- **Automatic Backups**: Daily at 2 AM (configure via cron/Task Scheduler)
- **Retention**: 30 days of backups kept
- **Compression**: All backups are compressed to save space
- **Formats**: Supports PostgreSQL and SQLite

---

## 📋 Quick Reference

### Create a Backup (Manual)
```powershell
# PowerShell
.\scripts\backup-database.ps1

# Or with custom path
.\scripts\backup-database.ps1 -BackupPath "D:\Backups\PrettyPartySweets"
```

### Restore from Backup
```powershell
# List available backups
Get-ChildItem .\backups -Filter "backup_*.zip" | Sort-Object CreationTime -Descending

# Restore (WILL OVERWRITE CURRENT DATA!)
.\scripts\restore-database.ps1 -BackupFile ".\backups\backup_20240115_120000.sql.zip"
```

### Reset Admin Credentials
```powershell
# Interactive reset
.\scripts\reset-admin-credentials.ps1

# Or with parameters
.\scripts\reset-admin-credentials.ps1 -NewEmail "admin@newdomain.com" -NewPassword "NewSecurePass123!"
```

---

## 🔧 Setup Instructions

### 1. Automated Daily Backups

#### Windows (Task Scheduler)
```powershell
# Create scheduled task for daily backups
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File H:\Naimah_Saas_Projects\Tasty Treats\scripts\backup-database.ps1"
$Trigger = New-ScheduledTaskTrigger -Daily -At "2:00 AM"
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName "PrettyPartySweets-Backup" -Action $Action -Trigger $Trigger -Settings $Settings
```

#### Linux/Mac (Cron)
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /path/to/pretty-party-sweets && ./scripts/backup-database.sh

# Or for specific backup path
0 2 * * * cd /path/to/pretty-party-sweets && ./scripts/backup-database.sh -p /var/backups/pretty-party-sweets
```

#### Vercel (Serverless)
For Vercel deployments, use your database provider's backup:
- **Vercel Postgres**: Automatic daily backups included
- **Supabase**: Enable Point-in-Time Recovery (PITR)
- **Neon**: Automatic backups with 7-day retention

### 2. Backup Storage Options

#### Local Storage
```powershell
# Default: ./backups directory
.\scripts\backup-database.ps1

# Custom local path
.\scripts\backup-database.ps1 -BackupPath "D:\DatabaseBackups"
```

#### Cloud Storage (AWS S3)
```powershell
# After backup, sync to S3
aws s3 sync .\backups s3://your-bucket/pretty-party-sweets/backups/ --exclude "*.log"
```

#### Cloud Storage (Google Drive)
```powershell
# Use rclone for Google Drive sync
rclone sync .\backups gdrive:PrettyPartySweets/Backups
```

---

## 🚨 Recovery Procedures

### Scenario 1: Accidental Data Deletion

1. **Stop the application** to prevent further changes
2. **Identify the last good backup**:
   ```powershell
   Get-ChildItem .\backups -Filter "backup_*.zip" | Sort-Object CreationTime -Descending | Select-Object -First 5
   ```
3. **Restore from backup**:
   ```powershell
   .\scripts\restore-database.ps1 -BackupFile ".\backups\backup_20240115_120000.sql.zip"
   ```
4. **Verify data integrity**
5. **Restart application**

### Scenario 2: Database Corruption

1. **Create emergency backup** of corrupted database (for forensics)
2. **Restore from last known good backup**
3. **Check application logs** for corruption cause
4. **Implement preventive measures**

### Scenario 3: Complete Server Failure

1. **Provision new server**
2. **Install dependencies** (Node.js, PostgreSQL client)
3. **Clone application code**
4. **Restore environment variables** from secure backup
5. **Restore database**:
   ```powershell
   # Download backup from cloud storage if needed
   aws s3 cp s3://your-bucket/pretty-party-sweets/backups/backup_20240115_120000.sql.zip .\backups\
   
   # Restore
   .\scripts\restore-database.ps1 -BackupFile ".\backups\backup_20240115_120000.sql.zip"
   ```
6. **Verify functionality**
7. **Update DNS** if needed

### Scenario 4: Admin Credentials Lost

1. **Access server directly** (SSH/RDP)
2. **Reset admin credentials**:
   ```powershell
   .\scripts\reset-admin-credentials.ps1
   ```
3. **Restart application**
4. **Login with new credentials**
5. **Update password manager**

---

## 📊 Monitoring & Alerts

### Backup Success Monitoring

Check backup logs:
```powershell
# View recent backup log
Get-Content .\backups\backup.log -Tail 20

# Check for errors
Select-String -Path .\backups\backup.log -Pattern "ERROR"
```

### Set Up Failure Alerts

#### Email Alert on Backup Failure
Add to backup script or use monitoring tool:
```powershell
if ($LASTEXITCODE -ne 0) {
    Send-MailMessage -To "admin@yourdomain.com" -Subject "Backup Failed" -Body "Check backup logs"
}
```

#### Slack/Discord Webhook
```powershell
$WebhookUrl = "https://hooks.slack.com/services/..."
$Body = @{ text = "⚠️ Database backup failed for Pretty Party Sweets" } | ConvertTo-Json
Invoke-RestMethod -Uri $WebhookUrl -Method Post -Body $Body -ContentType "application/json"
```

---

## 🔐 Security Considerations

### Backup Encryption

#### Encrypt Backups (Recommended)
```powershell
# Using 7-Zip with password
7z a -p -mhe=on backup_20240115_120000.sql.zip backup_20240115_120000.sql

# Or using GPG
gpg --symmetric --cipher-algo AES256 backup_20240115_120000.sql
```

#### Secure Backup Storage
- Store backups in encrypted format
- Use separate credentials for backup storage
- Enable versioning on cloud storage
- Test restore from encrypted backups regularly

### Access Control

```powershell
# Restrict backup directory permissions (Windows)
icacls .\backups /inheritance:r
icacls .\backups /grant:r "Administrators:(OI)(CI)F"
icacls .\backups /grant:r "SYSTEM:(OI)(CI)F"

# Linux/Mac
chmod 700 ./backups
chown root:root ./backups
```

---

## 🧪 Testing Recovery

### Monthly Recovery Test

1. **Create test environment**:
   ```powershell
   # Clone production database to test
   pg_dump $PROD_DATABASE_URL | psql $TEST_DATABASE_URL
   ```

2. **Perform test restore**:
   ```powershell
   .\scripts\restore-database.ps1 -BackupFile ".\backups\latest.zip"
   ```

3. **Verify data integrity**:
   - Check record counts
   - Test critical queries
   - Verify application functionality

4. **Document results**

---

## 📈 Backup Strategy Recommendations

### For Small Sites (< 1000 bookings/month)
- **Frequency**: Daily
- **Retention**: 30 days
- **Storage**: Local + Cloud
- **Test**: Monthly

### For Medium Sites (1000-10000 bookings/month)
- **Frequency**: Daily + Weekly full
- **Retention**: 90 days
- **Storage**: Local + Cloud + Offsite
- **Test**: Bi-weekly
- **PITR**: Enable if using PostgreSQL

### For Large Sites (> 10000 bookings/month)
- **Frequency**: Continuous replication + Daily snapshots
- **Retention**: 1 year
- **Storage**: Multiple cloud providers
- **Test**: Weekly
- **PITR**: Required
- **DR Site**: Hot standby

---

## 🛠️ Troubleshooting

### Backup Fails

**Check:**
1. DATABASE_URL is set correctly
2. Disk space available
3. Database credentials valid
4. PostgreSQL client tools installed (`pg_dump`)

**Debug:**
```powershell
# Test database connection
$env:PGPASSWORD = "your-password"
pg_dump -h localhost -U postgres -d pretty_party_sweets --schema-only
```

### Restore Fails

**Check:**
1. Backup file not corrupted
2. Target database exists
3. Sufficient permissions
4. No active connections to target database

**Force restore (PostgreSQL):**
```sql
-- Drop and recreate database
DROP DATABASE pretty_party_sweets;
CREATE DATABASE pretty_party_sweets;
```

### Large Database Backups

For databases > 1GB:
```powershell
# Use compression and split
pg_dump -h localhost -U postgres -d pretty_party_sweets | gzip > backup.sql.gz

# Or use custom format (smaller, faster)
pg_dump -Fc -h localhost -U postgres -d pretty_party_sweets > backup.dump
```

---

## 📞 Emergency Contacts

**Keep this information secure and accessible:**

- Database Provider Support: ________________
- Hosting Provider Support: ________________
- Domain Registrar: ________________
- Backup Storage Provider: ________________
- Team Members: ________________

---

## ✅ Pre-Launch Checklist

- [ ] Backup script tested successfully
- [ ] Restore procedure tested successfully
- [ ] Automated backups configured
- [ ] Backup monitoring/alerting set up
- [ ] Admin credential recovery tested
- [ ] Recovery procedures documented
- [ ] Team trained on recovery process
- [ ] Offsite/cloud backup configured
- [ ] Backup encryption enabled (if required)
- [ ] Recovery time objective (RTO) defined
- [ ] Recovery point objective (RPO) defined

---

**Last Updated**: 2024
**Backup Version**: 1.0
**Test Schedule**: Monthly
**Review Schedule**: Quarterly
