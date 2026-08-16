-- ============================================================================
-- YOUNOYA SACRED COMMERCE PLATFORM - DATABASE MIGRATION
-- Migration: Astrology Engine, Mobile OTP Challenges & Gift Recipient Persistence
-- Target DB: MariaDB 10.11+ / MySQL 8.0+
-- Database: younoya_db
-- ============================================================================

USE younoya_db;

-- 1. OTP Challenge Table (Zero Plain-Text OTP - Cryptographically Salted Hashes)
CREATE TABLE IF NOT EXISTS otp_challenges (
    id VARCHAR(64) PRIMARY KEY,
    identifier VARCHAR(64) NOT NULL COMMENT 'E.164 Mobile number e.g. +919876543210 or Email',
    identifier_type ENUM('mobile', 'email') NOT NULL DEFAULT 'mobile',
    otp_hash VARCHAR(255) NOT NULL COMMENT 'SHA-256 salted hash of OTP',
    salt VARCHAR(64) NOT NULL COMMENT 'Cryptographic salt unique to challenge',
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 5,
    is_verified TINYINT(1) DEFAULT 0 COMMENT '0=Pending, 1=Verified, 2=Max Attempts Exceeded/Invalidated',
    expires_at TIMESTAMP NOT NULL,
    consumed_at TIMESTAMP NULL DEFAULT NULL,
    ip_address VARCHAR(45) NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_identifier_status (identifier, identifier_type, is_verified, expires_at),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Sliding-Window Rate Limiting Table
CREATE TABLE IF NOT EXISTS otp_rate_limits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(64) NOT NULL COMMENT 'Mobile number or IP address',
    identifier_type ENUM('mobile', 'ip') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rate_lookup (identifier, identifier_type, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Secure HttpOnly Sessions Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Customer Master Table Adjustments
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Customer Kundali / Astrological Profiles Table
CREATE TABLE IF NOT EXISTS customer_astro_profiles (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) UNIQUE NOT NULL,
    phone VARCHAR(32) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    dob DATE NOT NULL COMMENT 'Date of Birth: YYYY-MM-DD',
    tob TIME NULL COMMENT 'Time of Birth: HH:MM:SS',
    pob VARCHAR(255) NULL COMMENT 'Place of Birth: City, State, Country',
    sun_sign VARCHAR(32) NOT NULL COMMENT 'Western Sun Sign (e.g. Aries, Leo, Sagittarius)',
    moon_sign VARCHAR(32) NOT NULL COMMENT 'Vedic Sidereal Moon Sign / Rashi (e.g. Mesha, Simha)',
    nakshatra VARCHAR(64) NULL COMMENT 'Vedic Lunar Mansion (e.g. Rohini, Ashwini, Magha)',
    nakshatra_index INT NULL DEFAULT 0,
    element ENUM('Fire', 'Earth', 'Air', 'Water') NOT NULL,
    ruling_planet VARCHAR(64) NULL,
    sacred_deity VARCHAR(128) NULL,
    gemstone VARCHAR(128) NULL,
    rudraksha VARCHAR(128) NULL,
    recommended_product_handle VARCHAR(255) NULL,
    chart_data JSON NULL COMMENT 'D1 Lagna / Navamsha astrological coordinates',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_phone (phone),
    INDEX idx_element (element),
    INDEX idx_rashi (moon_sign)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Gift Recipient Astrological Records Table
CREATE TABLE IF NOT EXISTS gift_recipients (
    id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NULL COMMENT 'Linked Customer if logged in',
    session_id VARCHAR(128) NULL COMMENT 'Linked Session for anonymous/guest checkout',
    relationship VARCHAR(64) NOT NULL COMMENT 'Brother, Sister, Bhabhi, Father, Mother, Spouse, Self, Friend',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NULL,
    dob DATE NOT NULL,
    tob TIME NULL,
    pob VARCHAR(255) NULL,
    sun_sign VARCHAR(32) NOT NULL,
    moon_sign VARCHAR(32) NOT NULL,
    nakshatra VARCHAR(64) NULL,
    element ENUM('Fire', 'Earth', 'Air', 'Water') NOT NULL,
    synergy_score INT DEFAULT 85 COMMENT '0 to 100 affinity score with sender',
    synergy_data JSON NULL COMMENT 'Full alignment breakdown, mantra, and rationale',
    consecration_name VARCHAR(255) NULL COMMENT 'Name to be chanted during temple Sankalpa',
    gotra VARCHAR(128) NULL COMMENT 'Family lineage gotra for temple energization',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cust_recipient (customer_id),
    INDEX idx_session_recipient (session_id),
    INDEX idx_element_match (element)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Extend Products Table with Sacred Astrological Taxonomy
ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS astrology_elements JSON NULL COMMENT 'Array of compatible elements e.g. ["Fire", "Air"]',
    ADD COLUMN IF NOT EXISTS ruling_planets JSON NULL COMMENT 'Array of governing planets e.g. ["Mars", "Sun"]',
    ADD COLUMN IF NOT EXISTS compatible_rashis JSON NULL COMMENT 'Array of compatible rashis e.g. ["aries", "leo", "sagittarius", "scorpio"]',
    ADD COLUMN IF NOT EXISTS compatible_sun_signs JSON NULL COMMENT 'Array of compatible Western signs',
    ADD COLUMN IF NOT EXISTS rudraksha_mukhi VARCHAR(64) NULL COMMENT 'e.g. 3-Mukhi & 5-Mukhi Rudraksha',
    ADD COLUMN IF NOT EXISTS gemstone_crystal VARCHAR(128) NULL COMMENT 'e.g. Red Coral, Natural Pearl, Oyster Shell',
    ADD COLUMN IF NOT EXISTS sacred_deity VARCHAR(128) NULL COMMENT 'e.g. Lord Hanuman & Kartikeya',
    ADD COLUMN IF NOT EXISTS consecration_mantra VARCHAR(255) NULL DEFAULT '108 Gayatri Mantra Energized',
    ADD COLUMN IF NOT EXISTS synergy_tags JSON NULL COMMENT 'Array of spiritual benefits e.g. ["protection", "prosperity", "bond_harmony"]';

-- 8. Seed Astrology Taxonomy on Existing Catalog Products
UPDATE products SET 
    astrology_elements = '["Fire", "Water"]',
    ruling_planets = '["Mars", "Moon", "Sun"]',
    compatible_rashis = '["aries", "cancer", "leo", "scorpio", "sagittarius", "pisces"]',
    compatible_sun_signs = '["aries", "cancer", "leo", "scorpio", "sagittarius", "pisces"]',
    rudraksha_mukhi = '3-Mukhi & 2-Mukhi Rudraksha',
    gemstone_crystal = 'Red Coral (Moonga) & Natural Pearl (Moti)',
    sacred_deity = 'Lord Hanuman & Goddess Parvati',
    consecration_mantra = '108 Gayatri Mantra & Hanuman Chalisa Consecrated',
    synergy_tags = '["protection", "prosperity", "sibling_grace", "planetary_harmony"]'
WHERE id = 'prod_001' OR handle = 'vedic-prosperity-rakhi';

UPDATE products SET 
    astrology_elements = '["Fire", "Water", "Earth"]',
    ruling_planets = '["Sun", "Jupiter", "Venus"]',
    compatible_rashis = '["leo", "sagittarius", "taurus", "libra", "pisces"]',
    compatible_sun_signs = '["leo", "sagittarius", "taurus", "libra", "pisces"]',
    rudraksha_mukhi = '12-Mukhi & 5-Mukhi Rudraksha',
    gemstone_crystal = 'Natural Crystal & Sacred Oyster Shell',
    sacred_deity = 'Maha Lakshmi & Surya Deva',
    consecration_mantra = '108 Shri Suktam & Lakshmi Kuber Mantra Blessed',
    synergy_tags = '["wealth_attraction", "abundance", "lakshmi_blessings", "financial_flow"]'
WHERE id = 'prod_002' OR handle = 'vedic-prosperity-wealth-attraction-rakhi';

UPDATE products SET 
    astrology_elements = '["Earth", "Air"]',
    ruling_planets = '["Venus", "Mercury", "Saturn"]',
    compatible_rashis = '["taurus", "virgo", "libra", "aquarius", "capricorn"]',
    compatible_sun_signs = '["taurus", "virgo", "libra", "aquarius", "capricorn"]',
    rudraksha_mukhi = '6-Mukhi & 4-Mukhi Rudraksha',
    gemstone_crystal = 'White Zircon & Green Emerald (Panna)',
    sacred_deity = 'Lord Vishnu & Maha Lakshmi',
    consecration_mantra = '108 Vishnu Sahasranama & Purusha Suktam Energized',
    synergy_tags = '["enduring_bond", "protection", "lifelong_affection", "reusable_keepsake"]'
WHERE id = 'prod_003' OR handle = 'vedic-abundance-blessing-rakhi';

UPDATE products SET 
    astrology_elements = '["Air", "Earth", "Water"]',
    ruling_planets = '["Saturn", "Mercury", "Rahu", "Ketu"]',
    compatible_rashis = '["gemini", "scorpio", "capricorn", "aquarius", "virgo"]',
    compatible_sun_signs = '["gemini", "scorpio", "capricorn", "aquarius", "virgo"]',
    rudraksha_mukhi = '4-Mukhi, 7-Mukhi & 9-Mukhi Rudraksha',
    gemstone_crystal = 'Sacred Kaudi & Evil-Eye Protective Crystal',
    sacred_deity = 'Navagraha Devatas & Lord Ganesha',
    consecration_mantra = '108 Navagraha Stotram & Maha Mrityunjaya Mantra Consecrated',
    synergy_tags = '["navagraha_shield", "evil_eye_protection", "planetary_remedy", "divine_om"]'
WHERE id = 'prod_004' OR handle = 'navagraha-om-protection-kaudi-rakhi';
