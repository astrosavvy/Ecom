CREATE DATABASE IF NOT EXISTS younoya_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE younoya_db;

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    handle VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(128) DEFAULT '',
    title VARCHAR(512) NOT NULL,
    subtitle TEXT,
    price INT NOT NULL DEFAULT 999,
    original_price INT NOT NULL DEFAULT 1199,
    badge VARCHAR(64) DEFAULT 'New',
    description TEXT,
    features LONGTEXT,
    images LONGTEXT,
    meta_title VARCHAR(512) DEFAULT '',
    meta_description TEXT,
    inventory_count INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm')
ON DUPLICATE KEY UPDATE username=username;

-- Seed authentic Vedic Rakhis
INSERT INTO products (id, handle, sku, title, subtitle, price, original_price, badge, description, features, images, meta_title, meta_description, inventory_count)
VALUES 
('prod_001', 'vedic-prosperity-rakhi', 'HOFK0009275279', 'Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread', 'Sacred consecration for sibling grace and planetary harmony', 1099, 1299, 'Signature Edition', 'In cherished traditions, this designer handcrafted Vedic Rakhi set in vibrant colors tells a story of elegance and affection. Each intricately crafted rakhi celebrates the unique bond between siblings.', '["Designer Beads Rakhi Set: 1 N", "Sacred Symbolism & Vedic Elements: 1 N", "Almonds: 100 Gm", "Cashews: 100 Gm", "Complimentary Roli & Chawal Packets"]', '[]', 'Vedic Prosperity Rakhi | YOUNOYA', 'Consecrated Vedic Rakhi Set with dry fruit accompaniments.', 100),

('prod_002', 'vedic-prosperity-wealth-attraction-rakhi', 'HOFK0009275280', 'Vedic Prosperity & Wealth Attraction Rakhi', 'Astrologically selected crystal, oyster shells & sacred mauli', 999, 1199, 'Prosperity', 'Featuring an astrologically selected crystal, oyster shells, and sacred red-yellow mauli for protection and wealth attraction.', '["Astrologically Curated Crystal: 1 N", "Natural Conch & Oyster Shell Details", "Sacred Red-Yellow Mauli Thread", "Complimentary Roli & Chawal Packets"]', '[]', 'Vedic Wealth Attraction Rakhi | YOUNOYA', 'Consecrated gemstone & oyster shell Rakhi for abundance.', 100),

('prod_003', 'vedic-abundance-blessing-rakhi', 'HOFK0009275281', 'Vedic Abundance & Blessing Rakhi', 'A keepsake designed to be treasured long after the festive hour', 999, 1199, 'Abundance', 'Celebrate Raksha Bandhan with a handcrafted Vedic Rakhi where every element has been chosen with intention.', '["Handcrafted Vedic Thread: 1 N", "Sacred Symbolism", "Reusable Keepsake Box", "Complimentary Roli & Chawal Packets"]', '[]', 'Vedic Abundance Rakhi | YOUNOYA', 'Handcrafted consecrated blessing Rakhi.', 100),

('prod_004', 'navagraha-om-protection-kaudi-rakhi', 'HOFK0009275282', 'Navagraha Om Protection Kaudi Rakhi', 'Sacred kaudis, Om motif & Navagraha-inspired planetary harmony', 1099, 1299, 'Sacred Shield', 'Featuring astrologically selected crystal accents, sacred kaudis symbolising prosperity and Goddess Lakshmi blessings with an Om motif.', '["Navagraha-Inspired Crystal Accents", "Sacred Kaudi Detailing & Om Motif", "Evil Eye Protection Thread", "Complimentary Roli & Chawal Packets"]', '[]', 'Navagraha Protection Rakhi | YOUNOYA', 'Nine planet harmony Rakhi with Om motif.', 100)
ON DUPLICATE KEY UPDATE title=VALUES(title);
