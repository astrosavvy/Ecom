# YOUNOYA VPS Operational Runbook (1GB VPS)

## 1. System Health & Reload Commands
```bash
# Reload Nginx without dropping active connections
sudo nginx -t && sudo systemctl reload nginx

# Restart PHP-FPM pool
sudo systemctl restart php8.2-fpm || sudo systemctl restart php-fpm

# Restart MariaDB
sudo systemctl restart mariadb

# Check RAM consumption
free -h
```

## 2. Automated Database Backup & Restore Script
```bash
# Backup
mysqldump -u root -p younoya | gzip > /var/backups/younoya_$(date +%Y%m%d_%H%M%S).sql.gz

# Restore
gunzip < /var/backups/younoya_YYYYMMDD_HHMMSS.sql.gz | mysql -u root -p younoya
```

## 3. Zero-Downtime Rollback Procedure
```bash
# If a bad deployment occurs:
cd /var/www/younoya/backend
git reset --hard HEAD~1
composer install --no-dev --optimize-autoloader
php artisan config:cache && php artisan route:cache
sudo systemctl reload nginx
sudo systemctl restart younoya-worker
```
