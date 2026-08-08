CREATE USER IF NOT EXISTS 'younoya_user'@'localhost' IDENTIFIED BY 'YounoyaPass2026!';
GRANT ALL PRIVILEGES ON younoya_db.* TO 'younoya_user'@'localhost';
FLUSH PRIVILEGES;
