USE younoya_db;

-- 1. Products Master Table with Consecrated Astrology Attributes
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
    is_hidden TINYINT(1) DEFAULT 0,
    variants LONGTEXT DEFAULT NULL,
    astrology_elements JSON NULL,
    ruling_planets JSON NULL,
    compatible_rashis JSON NULL,
    compatible_sun_signs JSON NULL,
    rudraksha_mukhi VARCHAR(64) NULL,
    gemstone_crystal VARCHAR(128) NULL,
    sacred_deity VARCHAR(128) NULL,
    consecration_mantra VARCHAR(255) NULL DEFAULT '108 Gayatri Mantra Energized',
    synergy_tags JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Product Variants (e.g. Set of 1, Set of 2, Keepsake Box Edition)
CREATE TABLE IF NOT EXISTS product_variants (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    sku VARCHAR(128) DEFAULT '',
    price INT NOT NULL,
    original_price INT NOT NULL DEFAULT 0,
    inventory_count INT DEFAULT 100,
    options JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 3. Collections / Categories
CREATE TABLE IF NOT EXISTS collections (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    handle VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Discount Codes & Coupons
CREATE TABLE IF NOT EXISTS discounts (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) UNIQUE NOT NULL,
    type ENUM('percentage', 'fixed_amount') NOT NULL DEFAULT 'percentage',
    value INT NOT NULL,
    min_order_value INT DEFAULT 0,
    usage_limit INT DEFAULT 100,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Customer Database
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    phone VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(255) NULL,
    full_name VARCHAR(255) DEFAULT '',
    gender VARCHAR(16) DEFAULT 'unspecified',
    orders_count INT DEFAULT 0,
    total_spent INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Customer Astrological Kundali Profiles
CREATE TABLE IF NOT EXISTS customer_astro_profiles (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    dob DATE NOT NULL,
    tob TIME NULL,
    pob VARCHAR(255) NULL,
    sun_sign VARCHAR(32) NOT NULL,
    moon_sign VARCHAR(32) NOT NULL,
    nakshatra VARCHAR(64) NULL,
    nakshatra_index INT NULL DEFAULT 0,
    element ENUM('Fire', 'Earth', 'Air', 'Water') NOT NULL,
    ruling_planet VARCHAR(64) NULL,
    sacred_deity VARCHAR(128) NULL,
    gemstone VARCHAR(128) NULL,
    rudraksha VARCHAR(128) NULL,
    recommended_product_handle VARCHAR(255) NULL,
    chart_data JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_phone (phone),
    INDEX idx_element (element),
    INDEX idx_rashi (moon_sign)
);

-- 7. Gift Recipient Astrological Records
CREATE TABLE IF NOT EXISTS gift_recipients (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NULL,
    session_id VARCHAR(128) NULL,
    relationship VARCHAR(64) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NULL,
    dob DATE NOT NULL,
    tob TIME NULL,
    pob VARCHAR(255) NULL,
    sun_sign VARCHAR(32) NOT NULL,
    moon_sign VARCHAR(32) NOT NULL,
    nakshatra VARCHAR(64) NULL,
    element ENUM('Fire', 'Earth', 'Air', 'Water') NOT NULL,
    synergy_score INT DEFAULT 85,
    synergy_data JSON NULL,
    consecration_name VARCHAR(255) NULL,
    gotra VARCHAR(128) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cust_recipient (customer_id),
    INDEX idx_session_recipient (session_id),
    INDEX idx_element_match (element)
);

-- 8. OTP Challenges & Rate Limiting
CREATE TABLE IF NOT EXISTS otp_challenges (
    id VARCHAR(64) PRIMARY KEY,
    identifier VARCHAR(64) NOT NULL,
    identifier_type ENUM('mobile', 'email') NOT NULL DEFAULT 'mobile',
    otp_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 5,
    is_verified TINYINT(1) DEFAULT 0,
    expires_at TIMESTAMP NOT NULL,
    consumed_at TIMESTAMP NULL DEFAULT NULL,
    ip_address VARCHAR(45) NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_identifier_status (identifier, identifier_type, is_verified, expires_at),
    INDEX idx_created (created_at)
);

CREATE TABLE IF NOT EXISTS otp_rate_limits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(64) NOT NULL,
    identifier_type ENUM('mobile', 'ip') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rate_lookup (identifier, identifier_type, created_at)
);

-- 9. Customer HttpOnly Sessions Table
CREATE TABLE IF NOT EXISTS customer_sessions (
    session_token VARCHAR(128) PRIMARY KEY,
    customer_id VARCHAR(64) NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255) NULL,
    full_name VARCHAR(255) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cust_session (customer_id),
    INDEX idx_phone_session (phone),
    INDEX idx_expiry (expires_at)
);

-- 10. Order Management System (OMS)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    customer_id VARCHAR(64) NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    shipping_address JSON NOT NULL,
    items JSON NOT NULL,
    subtotal INT NOT NULL,
    discount_amount INT DEFAULT 0,
    total_amount INT NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    fulfillment_status ENUM('unfulfilled', 'Ordered', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'unfulfilled',
    payment_method VARCHAR(64) DEFAULT 'Razorpay',
    razorpay_order_id VARCHAR(128) DEFAULT '',
    razorpay_payment_id VARCHAR(128) DEFAULT '',
    awb_number VARCHAR(128) DEFAULT '',
    courier_name VARCHAR(128) DEFAULT 'Shiprocket',
    courier_code VARCHAR(64) DEFAULT 'shiprocket',
    tracking_url VARCHAR(512) DEFAULT NULL,
    order_notes TEXT DEFAULT NULL,
    is_archived TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 11. Media Assets & Store Settings
CREATE TABLE IF NOT EXISTS media_assets (
    id VARCHAR(64) PRIMARY KEY,
    url VARCHAR(512) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_size INT DEFAULT 0,
    mime_type VARCHAR(64) DEFAULT 'image/jpeg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS store_settings (
    setting_key VARCHAR(64) PRIMARY KEY,
    setting_value TEXT
);

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Admin User (admin / YounoyaAdmin2026!)
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm')
ON DUPLICATE KEY UPDATE username=username;

-- Seed Initial Active Coupons
INSERT INTO discounts (id, code, type, value, min_order_value, usage_limit, is_active)
VALUES 
('disc_001', 'VEDIC10', 'percentage', 10, 500, 1000, TRUE),
('disc_002', 'FESTIVE100', 'fixed_amount', 100, 999, 500, TRUE)
ON DUPLICATE KEY UPDATE code=code;

-- Seed Initial Consecrated Products
INSERT INTO products (id, handle, sku, title, subtitle, price, original_price, badge, description, features, images, meta_title, meta_description, inventory_count, astrology_elements, ruling_planets, compatible_rashis, compatible_sun_signs, rudraksha_mukhi, gemstone_crystal, sacred_deity, consecration_mantra, synergy_tags)
VALUES 
('prod_001', 'vedic-prosperity-rakhi', 'HOFK0009275279', 'Vedic Prosperity Rakhi Set with Dry Fruits & Consecrated Thread', 'Sacred consecration for sibling grace and planetary harmony', 1099, 1299, 'Signature Edition', 'In cherished traditions, this designer handcrafted Vedic Rakhi set in vibrant colors tells a story of elegance and affection.', '["Designer Beads Rakhi Set: 1 N", "Sacred Symbolism & Vedic Elements: 1 N", "Almonds: 100 Gm", "Cashews: 100 Gm", "Complimentary Roli & Chawal Packets"]', '[]', 'Vedic Prosperity Rakhi | YOUNOYA', 'Consecrated Vedic Rakhi Set with dry fruit accompaniments.', 100, '["Fire", "Water"]', '["Mars", "Moon", "Sun"]', '["aries", "cancer", "leo", "scorpio", "sagittarius", "pisces"]', '["aries", "cancer", "leo", "scorpio", "sagittarius", "pisces"]', '3-Mukhi & 2-Mukhi Rudraksha', 'Red Coral (Moonga) & Natural Pearl (Moti)', 'Lord Hanuman & Goddess Parvati', '108 Gayatri Mantra & Hanuman Chalisa Consecrated', '["protection", "prosperity", "sibling_grace", "planetary_harmony"]'),

('prod_002', 'vedic-prosperity-wealth-attraction-rakhi', 'HOFK0009275280', 'Vedic Prosperity & Wealth Attraction Rakhi', 'Astrologically selected crystal, oyster shells & sacred mauli', 999, 1199, 'Prosperity', 'Featuring an astrologically selected crystal, oyster shells, and sacred red-yellow mauli for protection and wealth attraction.', '["Astrologically Curated Crystal: 1 N", "Natural Conch & Oyster Shell Details", "Sacred Red-Yellow Mauli Thread", "Complimentary Roli & Chawal Packets"]', '[]', 'Vedic Wealth Attraction Rakhi | YOUNOYA', 'Consecrated gemstone & oyster shell Rakhi for abundance.', 100, '["Fire", "Water", "Earth"]', '["Sun", "Jupiter", "Venus"]', '["leo", "sagittarius", "taurus", "libra", "pisces"]', '["leo", "sagittarius", "taurus", "libra", "pisces"]', '12-Mukhi & 5-Mukhi Rudraksha', 'Natural Crystal & Sacred Oyster Shell', 'Maha Lakshmi & Surya Deva', '108 Shri Suktam & Lakshmi Kuber Mantra Blessed', '["wealth_attraction", "abundance", "lakshmi_blessings", "financial_flow"]'),

('prod_003', 'vedic-abundance-blessing-rakhi', 'HOFK0009275281', 'Vedic Abundance & Blessing Rakhi', 'A keepsake designed to be treasured long after the festive hour', 999, 1199, 'Abundance', 'Celebrate Raksha Bandhan with a handcrafted Vedic Rakhi where every element has been chosen with intention.', '["Handcrafted Vedic Thread: 1 N", "Sacred Symbolism", "Reusable Keepsake Box", "Complimentary Roli & Chawal Packets"]', '[]', 'Vedic Abundance Rakhi | YOUNOYA', 'Handcrafted consecrated blessing Rakhi.', 100, '["Earth", "Air"]', '["Venus", "Mercury", "Saturn"]', '["taurus", "virgo", "libra", "aquarius", "capricorn"]', '["taurus", "virgo", "libra", "aquarius", "capricorn"]', '6-Mukhi & 4-Mukhi Rudraksha', 'White Zircon & Green Emerald (Panna)', 'Lord Vishnu & Maha Lakshmi', '108 Vishnu Sahasranama & Purusha Suktam Energized', '["enduring_bond", "protection", "lifelong_affection", "reusable_keepsake"]'),

('prod_004', 'navagraha-om-protection-kaudi-rakhi', 'HOFK0009275282', 'Navagraha Om Protection Kaudi Rakhi', 'Sacred kaudis, Om motif & Navagraha-inspired planetary harmony', 1099, 1299, 'Sacred Shield', 'Featuring astrologically selected crystal accents, sacred kaudis symbolising prosperity and Goddess Lakshmi blessings with an Om motif.', '["Navagraha-Inspired Crystal Accents", "Sacred Kaudi Detailing & Om Motif", "Evil Eye Protection Thread", "Complimentary Roli & Chawal Packets"]', '[]', 'Navagraha Protection Rakhi | YOUNOYA', 'Nine planet harmony Rakhi with Om motif.', 100, '["Air", "Earth", "Water"]', '["Saturn", "Mercury", "Rahu", "Ketu"]', '["gemini", "scorpio", "capricorn", "aquarius", "virgo"]', '["gemini", "scorpio", "capricorn", "aquarius", "virgo"]', '4-Mukhi, 7-Mukhi & 9-Mukhi Rudraksha', 'Sacred Kaudi & Evil-Eye Protective Crystal', 'Navagraha Devatas & Lord Ganesha', '108 Navagraha Stotram & Maha Mrityunjaya Mantra Consecrated', '["navagraha_shield", "evil_eye_protection", "planetary_remedy", "divine_om"]')
ON DUPLICATE KEY UPDATE title=VALUES(title);
