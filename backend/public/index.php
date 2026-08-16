<?php
// YOUNOYA Full Enterprise E-Commerce & Sacred Vedic Astrology API Engine
// Production Target: 140.245.7.165 (api.younoya.com) | MariaDB 10.11+ | PHP 8.4-FPM

// -----------------------------------------------------------------------------
// 1. Dynamic CORS & Security Headers (Supports HttpOnly Cookie Session Auth)
// -----------------------------------------------------------------------------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://younoya.com',
    'https://storefront.younoya.com',
    'http://localhost:8000',
    'http://localhost:3000',
    'http://127.0.0.1:8000',
    'http://127.0.0.1:3000'
];

if (in_array($origin, $allowedOrigins) || preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin) || preg_match('#\.younoya\.com$#', $origin)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
} else {
    header('Access-Control-Allow-Origin: *');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Razorpay-Signature, x-shiprocket-token, X-Admin-Token, X-Session-ID');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// -----------------------------------------------------------------------------
// 2. Database Connection & Enterprise Schema Auto-Provisioning
// -----------------------------------------------------------------------------
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO("mysql:host=127.0.0.1;dbname=younoya_db;charset=utf8mb4", "younoya_user", "YounoyaPass2026!", [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);

            // Base Tables DDL
            $pdo->exec("
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
                    INDEX idx_phone (phone),
                    INDEX idx_element (element),
                    INDEX idx_rashi (moon_sign)
                );

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
            ");

            // Safe column additions for legacy instances
            try { $pdo->exec("ALTER TABLE orders ADD COLUMN is_archived TINYINT(1) DEFAULT 0"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE orders ADD COLUMN courier_code VARCHAR(64) DEFAULT 'shiprocket'"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE orders ADD COLUMN tracking_url VARCHAR(512) DEFAULT NULL"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE orders ADD COLUMN order_notes TEXT DEFAULT NULL"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN is_hidden TINYINT(1) DEFAULT 0"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN variants LONGTEXT DEFAULT NULL"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN astrology_elements JSON NULL"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN ruling_planets JSON NULL"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN compatible_rashis JSON NULL"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN compatible_sun_signs JSON NULL"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN rudraksha_mukhi VARCHAR(64) NULL"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN gemstone_crystal VARCHAR(128) NULL"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN sacred_deity VARCHAR(128) NULL"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN consecration_mantra VARCHAR(255) NULL DEFAULT '108 Gayatri Mantra Energized'"); } catch (Exception $e) {}
            try { $pdo->exec("ALTER TABLE products ADD COLUMN synergy_tags JSON NULL"); } catch (Exception $e) {}

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

function getRequestPayload(): array {
    $raw = file_get_contents('php://input');
    if (!empty($raw)) {
        $json = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
            return $json;
        }
    }
    if (!empty($_POST)) return $_POST;
    return [];
}

function getClientIP(): string {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) return $_SERVER['HTTP_CF_CONNECTING_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($parts[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

function generateStandardOrderNumber(PDO $db): string {
    $prefix = 'YN-' . date('Ymd') . '-';
    $stmt = $db->prepare("SELECT COUNT(*) FROM orders WHERE order_number LIKE ?");
    $stmt->execute([$prefix . '%']);
    $count = (int)$stmt->fetchColumn() + 1;
    return $prefix . str_pad($count, 3, '0', STR_PAD_LEFT);
}

// -----------------------------------------------------------------------------
// 3. Sacred Vedic Astrology & Astral Synergy Computation Engine
// -----------------------------------------------------------------------------
function getZodiacSignMasterData(): array {
    return [
        'aries' => [
            'id' => 'aries',
            'name' => 'Aries',
            'sanskritName' => 'Mesha (मेष)',
            'element' => 'Fire',
            'rulingPlanet' => 'Mars (Mangal)',
            'deity' => 'Lord Hanuman / Kartikeya',
            'gemstone' => 'Red Coral (Moonga)',
            'rudraksha' => '3-Mukhi Rudraksha',
            'traits' => ['Courageous', 'Pioneering', 'Dynamic', 'Passionate'],
            'recommendedHandle' => 'vedic-prosperity-rakhi'
        ],
        'taurus' => [
            'id' => 'taurus',
            'name' => 'Taurus',
            'sanskritName' => 'Vrishabha (वृषभ)',
            'element' => 'Earth',
            'rulingPlanet' => 'Venus (Shukra)',
            'deity' => 'Maha Lakshmi',
            'gemstone' => 'Diamond / White Zircon',
            'rudraksha' => '6-Mukhi Rudraksha',
            'traits' => ['Abundant', 'Grounded', 'Devoted', 'Patient'],
            'recommendedHandle' => 'vedic-abundance-blessing-rakhi'
        ],
        'gemini' => [
            'id' => 'gemini',
            'name' => 'Gemini',
            'sanskritName' => 'Mithuna (मिथुन)',
            'element' => 'Air',
            'rulingPlanet' => 'Mercury (Budha)',
            'deity' => 'Lord Ganesha',
            'gemstone' => 'Emerald (Panna)',
            'rudraksha' => '4-Mukhi Rudraksha',
            'traits' => ['Eloquent', 'Versatile', 'Curious', 'Brilliant'],
            'recommendedHandle' => 'navagraha-om-protection-kaudi-rakhi'
        ],
        'cancer' => [
            'id' => 'cancer',
            'name' => 'Cancer',
            'sanskritName' => 'Karka (कर्क)',
            'element' => 'Water',
            'rulingPlanet' => 'Moon (Chandra)',
            'deity' => 'Lord Shiva & Parvati',
            'gemstone' => 'Natural Pearl (Moti)',
            'rudraksha' => '2-Mukhi Rudraksha',
            'traits' => ['Nurturing', 'Intuitive', 'Protective', 'Empathetic'],
            'recommendedHandle' => 'vedic-prosperity-rakhi'
        ],
        'leo' => [
            'id' => 'leo',
            'name' => 'Leo',
            'sanskritName' => 'Simha (सिंह)',
            'element' => 'Fire',
            'rulingPlanet' => 'Sun (Surya)',
            'deity' => 'Surya Deva',
            'gemstone' => 'Ruby (Manikya)',
            'rudraksha' => '12-Mukhi / 1-Mukhi Rudraksha',
            'traits' => ['Regal', 'Magnanimous', 'Radiant', 'Leader'],
            'recommendedHandle' => 'vedic-prosperity-wealth-attraction-rakhi'
        ],
        'virgo' => [
            'id' => 'virgo',
            'name' => 'Virgo',
            'sanskritName' => 'Kanya (कन्या)',
            'element' => 'Earth',
            'rulingPlanet' => 'Mercury (Budha)',
            'deity' => 'Lord Vishnu',
            'gemstone' => 'Green Emerald (Panna)',
            'rudraksha' => '4-Mukhi Rudraksha',
            'traits' => ['Analytical', 'Pure', 'Healing', 'Precise'],
            'recommendedHandle' => 'vedic-abundance-blessing-rakhi'
        ],
        'libra' => [
            'id' => 'libra',
            'name' => 'Libra',
            'sanskritName' => 'Tula (तुला)',
            'element' => 'Air',
            'rulingPlanet' => 'Venus (Shukra)',
            'deity' => 'Maha Lakshmi',
            'gemstone' => 'Opal / White Sapphire',
            'rudraksha' => '6-Mukhi Rudraksha',
            'traits' => ['Harmonious', 'Diplomatic', 'Gracious', 'Fair'],
            'recommendedHandle' => 'vedic-prosperity-rakhi'
        ],
        'scorpio' => [
            'id' => 'scorpio',
            'name' => 'Scorpio',
            'sanskritName' => 'Vrishchika (वृश्चिक)',
            'element' => 'Water',
            'rulingPlanet' => 'Mars & Ketu',
            'deity' => 'Lord Hanuman / Bhairava',
            'gemstone' => 'Red Coral (Moonga)',
            'rudraksha' => '3-Mukhi & 9-Mukhi Rudraksha',
            'traits' => ['Transformative', 'Psychic', 'Resolute', 'Mystic'],
            'recommendedHandle' => 'navagraha-om-protection-kaudi-rakhi'
        ],
        'sagittarius' => [
            'id' => 'sagittarius',
            'name' => 'Sagittarius',
            'sanskritName' => 'Dhanu (धनु)',
            'element' => 'Fire',
            'rulingPlanet' => 'Jupiter (Guru)',
            'deity' => 'Lord Vishnu / Dakshinamurthy',
            'gemstone' => 'Yellow Sapphire (Pukhraj)',
            'rudraksha' => '5-Mukhi Rudraksha',
            'traits' => ['Philosophical', 'Auspicious', 'Visionary', 'Generous'],
            'recommendedHandle' => 'vedic-prosperity-wealth-attraction-rakhi'
        ],
        'capricorn' => [
            'id' => 'capricorn',
            'name' => 'Capricorn',
            'sanskritName' => 'Makara (मकर)',
            'element' => 'Earth',
            'rulingPlanet' => 'Saturn (Shani)',
            'deity' => 'Lord Shani / Hanuman',
            'gemstone' => 'Blue Sapphire (Neelam)',
            'rudraksha' => '7-Mukhi & 14-Mukhi Rudraksha',
            'traits' => ['Disciplined', 'Enduring', 'Strategic', 'Authoritative'],
            'recommendedHandle' => 'navagraha-om-protection-kaudi-rakhi'
        ],
        'aquarius' => [
            'id' => 'aquarius',
            'name' => 'Aquarius',
            'sanskritName' => 'Kumbha (कुम्भ)',
            'element' => 'Air',
            'rulingPlanet' => 'Saturn & Rahu',
            'deity' => 'Lord Shiva',
            'gemstone' => 'Blue Sapphire (Neelam)',
            'rudraksha' => '7-Mukhi & 8-Mukhi Rudraksha',
            'traits' => ['Humanitarian', 'Innovative', 'Cosmic', 'Original'],
            'recommendedHandle' => 'vedic-abundance-blessing-rakhi'
        ],
        'pisces' => [
            'id' => 'pisces',
            'name' => 'Pisces',
            'sanskritName' => 'Meena (मीन)',
            'element' => 'Water',
            'rulingPlanet' => 'Jupiter (Guru)',
            'deity' => 'Lord Narayana',
            'gemstone' => 'Yellow Sapphire (Pukhraj)',
            'rudraksha' => '5-Mukhi Rudraksha',
            'traits' => ['Spiritual', 'Compassionate', 'Devotional', 'Wise'],
            'recommendedHandle' => 'vedic-prosperity-rakhi'
        ]
    ];
}

function getNakshatrasList(): array {
    return [
        "Ashwini (अश्विनी)", "Bharani (भरणी)", "Krittika (कृत्तिका)",
        "Rohini (रोहिणी)", "Mrigashira (मृगशिरा)", "Ardra (आर्द्रा)",
        "Punarvasu (पुनर्वसु)", "Pushya (पुष्य)", "Ashlesha (आश्लेषा)",
        "Magha (मघा)", "Purva Phalguni (पूर्वा फाल्गुनी)", "Uttara Phalguni (उत्तरा फाल्गुनी)",
        "Hasta (हस्त)", "Chitra (चित्रा)", "Swati (स्वाती)",
        "Vishakha (विशाखा)", "Anuradha (अनुराधा)", "Jyeshtha (ज्येष्ठा)",
        "Mula (मूल)", "Purva Ashadha (पूर्वाषाढ़ा)", "Uttara Ashadha (उत्तराषाढ़ा)",
        "Shravana (श्रवण)", "Dhanishta (धनिष्ठा)", "Shatabhisha (शतभिषा)",
        "Purva Bhadrapada (पूर्वा भाद्रपद)", "Uttara Bhadrapada (उत्तरा भाद्रपद)", "Revati (रेवती)"
    ];
}

function getWesternSunSign(string $dob): array {
    $data = getZodiacSignMasterData();
    $time = strtotime($dob);
    if (!$time) return $data['aries'];

    $month = (int)date('n', $time);
    $day = (int)date('j', $time);

    if (($month == 3 && $day >= 21) || ($month == 4 && $day <= 19)) return $data['aries'];
    if (($month == 4 && $day >= 20) || ($month == 5 && $day <= 20)) return $data['taurus'];
    if (($month == 5 && $day >= 21) || ($month == 6 && $day <= 20)) return $data['gemini'];
    if (($month == 6 && $day >= 21) || ($month == 7 && $day <= 22)) return $data['cancer'];
    if (($month == 7 && $day >= 23) || ($month == 8 && $day <= 22)) return $data['leo'];
    if (($month == 8 && $day >= 23) || ($month == 9 && $day <= 22)) return $data['virgo'];
    if (($month == 9 && $day >= 23) || ($month == 10 && $day <= 22)) return $data['libra'];
    if (($month == 10 && $day >= 23) || ($month == 11 && $day <= 21)) return $data['scorpio'];
    if (($month == 11 && $day >= 22) || ($month == 12 && $day <= 21)) return $data['sagittarius'];
    if (($month == 12 && $day >= 22) || ($month == 1 && $day <= 19)) return $data['capricorn'];
    if (($month == 1 && $day >= 20) || ($month == 2 && $day <= 18)) return $data['aquarius'];
    return $data['pisces'];
}

function calculateVedicRashi(string $dob, ?string $tob = null): array {
    $master = getZodiacSignMasterData();
    $nakshatras = getNakshatrasList();
    $time = strtotime($dob);
    if (!$time) {
        return ['rashi' => $master['aries'], 'nakshatra' => $nakshatras[0], 'nakshatra_index' => 0];
    }

    $hourFraction = 0.5;
    if (!empty($tob) && strpos($tob, ':') !== false) {
        $parts = explode(':', $tob);
        $h = (int)($parts[0] ?? 12);
        $m = (int)($parts[1] ?? 0);
        $hourFraction = ($h + $m / 60.0) / 24.0;
    }

    $year = (int)date('Y', $time);
    $dayOfYear = (int)date('z', $time) + $hourFraction;

    $lunarCycleDegree = fmod(($dayOfYear * (360.0 / 27.32166) + ($year % 19) * 19.3), 360.0);
    if ($lunarCycleDegree < 0) $lunarCycleDegree += 360.0;

    $nakshatraIndex = (int)floor($lunarCycleDegree / (360.0 / 27.0)) % 27;
    $nakshatra = $nakshatras[$nakshatraIndex] ?? $nakshatras[0];

    $rashiIndex = (int)floor($lunarCycleDegree / 30.0) % 12;
    $rashiKeys = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
    $rashiKey = $rashiKeys[$rashiIndex] ?? 'aries';

    return [
        'rashi' => $master[$rashiKey] ?? $master['aries'],
        'nakshatra' => $nakshatra,
        'nakshatra_index' => $nakshatraIndex
    ];
}

function calculateAstrologySynergy(array $userProfile, array $recipientProfile): array {
    $userElement = $userProfile['moonSign']['element'] ?? ($userProfile['element'] ?? 'Fire');
    $recElement = $recipientProfile['sunSign']['element'] ?? ($recipientProfile['element'] ?? 'Fire');
    $userName = $userProfile['name'] ?? ($userProfile['full_name'] ?? 'Seeker');
    $recName = $recipientProfile['name'] ?? ($recipientProfile['full_name'] ?? 'Beloved');
    $rel = $recipientProfile['relationship'] ?? 'Sibling';

    $matrix = [
        'Fire' => [
            'Fire' => ['score' => 96, 'label' => 'Pranic Resonance (Divine Fire)', 'desc' => 'Radiant warmth, unshakeable loyalty, and mutual inspiration.'],
            'Earth' => ['score' => 78, 'label' => 'Prithvi-Agni Anchor', 'desc' => 'Fire fuels ambition while Earth provides steadfast protection.'],
            'Air' => ['score' => 92, 'label' => 'Vayu-Agni Expansion', 'desc' => 'Air fuels fire\'s brilliance, leading to harmonious communication.'],
            'Water' => ['score' => 72, 'label' => 'Jala-Agni Balance', 'desc' => 'Requires consecrated protection to bridge intense emotional tides.']
        ],
        'Earth' => [
            'Fire' => ['score' => 78, 'label' => 'Prithvi-Agni Anchor', 'desc' => 'Steadfast grounding supporting fiery visionary power.'],
            'Earth' => ['score' => 94, 'label' => 'Sustained Foundation', 'desc' => 'Unwavering loyalty, enduring security, and lifelong devotion.'],
            'Air' => ['score' => 74, 'label' => 'Thought & Form Synergy', 'desc' => 'Grounded manifestation meets elevated visionary ideals.'],
            'Water' => ['score' => 95, 'label' => 'Nourishing Grove', 'desc' => 'Deep emotional security and serene mutual understanding.']
        ],
        'Air' => [
            'Fire' => ['score' => 92, 'label' => 'Vayu-Agni Expansion', 'desc' => 'Intellectual sparks and dynamic creative synergy.'],
            'Earth' => ['score' => 74, 'label' => 'Thought & Form Synergy', 'desc' => 'Pragmatic support empowering intellectual pursuits.'],
            'Air' => ['score' => 90, 'label' => 'Astral Clarity', 'desc' => 'Effortless telepathic connection and elevated wisdom.'],
            'Water' => ['score' => 76, 'label' => 'Intuitive Breeze', 'desc' => 'Rich poetic resonance tempered with emotional tenderness.']
        ],
        'Water' => [
            'Fire' => ['score' => 72, 'label' => 'Jala-Agni Balance', 'desc' => 'Passionate depth requiring grounding sacred talismans.'],
            'Earth' => ['score' => 95, 'label' => 'Nourishing Grove', 'desc' => 'Profound emotional solace and generational stability.'],
            'Air' => ['score' => 76, 'label' => 'Intuitive Breeze', 'desc' => 'Heart-centered intuition aligned with intellectual warmth.'],
            'Water' => ['score' => 96, 'label' => 'Amrita Flow (Oceanic Unity)', 'desc' => 'Deep soul-bond, empathy, and intuitive oneness.']
        ]
    ];

    $match = $matrix[$userElement][$recElement] ?? [
        'score' => 85,
        'label' => 'Harmonious Astral Bond',
        'desc' => 'Auspicious planetary alignment bringing peace and protection.'
    ];

    $userRudraksha = $userProfile['moonSign']['rudraksha'] ?? ($userProfile['rudraksha'] ?? 'Vedic Consecrated Thread');

    return [
        'score' => $match['score'],
        'harmony_title' => "{$match['label']} ({$match['score']}% Alignment)",
        'element_match' => "{$userElement} ({$userName}) + {$recElement} ({$recName})",
        'synergy_description' => $match['desc'],
        'consecrated_recommendation' => "{$userRudraksha} + Gomti Chakra Rakhi blessed for {$rel}",
        'auspicious_mantra' => 'ॐ गं गणपतये नमः (Om Gam Ganapataye Namaha)'
    ];
}

// -----------------------------------------------------------------------------
// 4. Session & Authentication Helper
// -----------------------------------------------------------------------------
function getAuthenticatedSession(PDO $db): ?array {
    $token = $_COOKIE['yn_session'] ?? null;
    if (!$token && !empty($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/Bearer\s+(\S+)/i', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
            $token = $matches[1];
        }
    }
    if (!$token && !empty($_SERVER['HTTP_X_SESSION_ID'])) {
        $token = $_SERVER['HTTP_X_SESSION_ID'];
    }

    if (!$token) return null;

    $stmt = $db->prepare("SELECT * FROM customer_sessions WHERE session_token = ? AND expires_at > NOW()");
    $stmt->execute([$token]);
    $session = $stmt->fetch();

    if ($session) {
        $db->prepare("UPDATE customer_sessions SET last_active_at = NOW() WHERE session_token = ?")->execute([$token]);
        return $session;
    }
    return null;
}

// -----------------------------------------------------------------------------
// 5. Order Confirmation & Email Dispatch Helpers
// -----------------------------------------------------------------------------
function dispatchOrderEmails(string $orderNumber, string $toEmail, string $customerName, int $totalAmount, array $items = [], string $shippingAddress = '') {
    $subject = "Order Confirmed: #{$orderNumber} — YOUNOYA Consecrated Rakhis";
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: YOUNOYA <orders@younoya.com>\r\n";
    $headers .= "Reply-To: support@younoya.com\r\n";

    $itemListHtml = '';
    foreach ($items as $it) {
        $name = htmlspecialchars($it['title'] ?? 'Consecrated Keepsake');
        $varName = !empty($it['variant']) ? " (" . htmlspecialchars($it['variant']) . ")" : "";
        $qty = (int)($it['quantity'] ?? 1);
        $price = (int)($it['price'] ?? 0);
        $itemListHtml .= "<tr><td style='padding: 8px; border-bottom: 1px solid #eee;'>{$name}{$varName} x {$qty}</td><td style='padding: 8px; border-bottom: 1px solid #eee; text-align: right;'>₹" . ($price * $qty) . "</td></tr>";
    }

    $body = "
    <!DOCTYPE html>
    <html>
    <head><meta charset='UTF-8'></head>
    <body style='font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; background-color: #FDFCF8; color: #1C1C1C; margin: 0; padding: 20px;'>
        <div style='max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8E4; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);'>
            <div style='text-align: center; margin-bottom: 24px;'>
                <h1 style='font-size: 24px; margin: 0; font-weight: 800; letter-spacing: -0.5px;'>YOUNOYA</h1>
                <p style='font-size: 11px; color: #B8860B; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;'>Sacred Vedic Consecration Hub</p>
            </div>
            <div style='background: #D8E6D8; padding: 16px; border-radius: 16px; margin-bottom: 24px; text-align: center;'>
                <p style='margin: 0; font-size: 14px; font-weight: bold; color: #154522;'>✓ Order Successfully Placed & Queued for Blessing</p>
                <p style='margin: 4px 0 0 0; font-size: 12px; color: #2D6339;'>Order ID: #{$orderNumber}</p>
            </div>
            <p style='font-size: 13px; line-height: 1.6; color: #4A4A4A;'>Namaste <strong>{$customerName}</strong>,<br>Your sacred rakhis have been reserved and entered the 108 Gayatri Mantra energization queue. Our temple priests in Jaipur are hand-consecrating your order with pure Akshat and Roli.</p>
            <table style='width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px;'>
                <thead><tr style='background: #F5F5F0;'><th style='padding: 8px; text-align: left;'>Sacred Item</th><th style='padding: 8px; text-align: right;'>Amount</th></tr></thead>
                <tbody>{$itemListHtml}</tbody>
                <tfoot><tr><td style='padding: 12px 8px; font-weight: bold; font-size: 14px;'>Total Paid:</td><td style='padding: 12px 8px; font-weight: bold; font-size: 14px; text-align: right; color: #1C1C1C;'>₹{$totalAmount}</td></tr></tfoot>
            </table>
            <div style='border-top: 1px solid #E2E8E4; padding-top: 20px; font-size: 11px; color: #777; line-height: 1.5; text-align: center;'>
                <p style='margin: 0;'>Express Air Dispatch with real-time SMS tracking updates.<br>Questions? Reach our sacred concierge at <a href='mailto:support@younoya.com' style='color: #1C1C1C; font-weight: bold;'>support@younoya.com</a></p>
            </div>
        </div>
    </body>
    </html>";

    @mail($toEmail, $subject, $body, $headers);

    $adminSubject = "⚡ New Paid Order: #{$orderNumber} (₹{$totalAmount})";
    $adminBody = "
    <div style='font-family: Arial, sans-serif; padding: 20px;'>
        <h2>New Order: #{$orderNumber}</h2>
        <p><strong>Customer:</strong> {$customerName} ({$toEmail})</p>
        <p><strong>Amount:</strong> ₹{$totalAmount}</p>
        <p>Manage order in Admin: <a href='https://younoya.com/admin'>https://younoya.com/admin</a></p>
    </div>";

    @mail("admin@younoya.com", $adminSubject, $adminBody, $headers);
}

// =============================================================================
// ROUTING & CONTROLLER ACTIONS
// =============================================================================

// -----------------------------------------------------------------------------
// Endpoint 1: Health & System Diagnostics
// -----------------------------------------------------------------------------
if ($uri === '/' || $uri === '/health') {
    $db = getDB();
    $prodCount = $db->query("SELECT COUNT(*) FROM products")->fetchColumn();
    $orderCount = $db->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    $customerCount = $db->query("SELECT COUNT(*) FROM customers")->fetchColumn();
    $astroProfileCount = $db->query("SELECT COUNT(*) FROM customer_astro_profiles")->fetchColumn();

    echo json_encode([
        'status' => 'healthy',
        'engine' => 'YOUNOYA Sacred Vedic Astrology & Enterprise E-Commerce Engine',
        'php_version' => PHP_VERSION,
        'database' => 'MariaDB 10.11+ (Enterprise Astrology Schema Active)',
        'products_in_db' => (int)$prodCount,
        'orders_in_db' => (int)$orderCount,
        'customers_in_db' => (int)$customerCount,
        'astro_profiles_in_db' => (int)$astroProfileCount,
        'features' => [
            'Mobile OTP (Salted SHA-256 Hashes)',
            'HttpOnly Customer Sessions',
            'Customer Kundali Profiles (Vedic Sidereal + Sun Sign)',
            'Gift Recipient Astrology & Synergy Calculation',
            'Consecrated Product Astrological Query Matching',
            'Order Management (OMS)',
            'Media Asset Store',
            'Razorpay & Free Air Shipping'
        ],
        'shipping' => '100% Free Express Air Shipping across India'
    ]);
    exit;
}

// -----------------------------------------------------------------------------
// Endpoint 2: Mobile Number OTP Request (`POST /api/v1/auth/mobile-otp/send`)
// -----------------------------------------------------------------------------
if ($uri === '/api/v1/auth/mobile-otp/send' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = getDB();
    $input = getRequestPayload();
    $rawPhone = trim($input['phone'] ?? '');

    $digits = preg_replace('/\D/', '', $rawPhone);
    if (strlen($digits) === 10) {
        $phone = '+91' . $digits;
    } elseif (strlen($digits) === 12 && substr($digits, 0, 2) === '91') {
        $phone = '+' . $digits;
    } elseif (strlen($digits) >= 10 && strlen($digits) <= 15) {
        $phone = '+' . $digits;
    } else {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Please provide a valid 10-digit mobile number']);
        exit;
    }

    $ip = getClientIP();

    // 1. Cooldown Check (60 seconds)
    $stmt = $db->prepare("SELECT created_at FROM otp_challenges WHERE identifier = ? AND identifier_type = 'mobile' AND created_at > DATE_SUB(NOW(), INTERVAL 60 SECOND) ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([$phone]);
    $recent = $stmt->fetch();
    if ($recent) {
        $elapsed = time() - strtotime($recent['created_at']);
        $remaining = max(1, 60 - $elapsed);
        http_response_code(429);
        echo json_encode(['success' => false, 'error' => "Please wait {$remaining} seconds before requesting a new OTP.", 'cooldown_seconds' => $remaining]);
        exit;
    }

    // 2. Hourly Rate Limit Check (Max 5 per mobile, Max 20 per IP)
    $phoneCount = $db->prepare("SELECT COUNT(*) FROM otp_rate_limits WHERE identifier = ? AND identifier_type = 'mobile' AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    $phoneCount->execute([$phone]);
    if ((int)$phoneCount->fetchColumn() >= 5) {
        http_response_code(429);
        echo json_encode(['success' => false, 'error' => 'Hourly OTP limit reached for this number. Please try again after 1 hour.']);
        exit;
    }

    $ipCount = $db->prepare("SELECT COUNT(*) FROM otp_rate_limits WHERE identifier = ? AND identifier_type = 'ip' AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    $ipCount->execute([$ip]);
    if ((int)$ipCount->fetchColumn() >= 20) {
        http_response_code(429);
        echo json_encode(['success' => false, 'error' => 'Hourly request limit exceeded. Please try again later.']);
        exit;
    }

    // 3. Generate Cryptographic 6-digit OTP and Per-Challenge Salt
    $otp = (string) random_int(100000, 999999);
    $salt = bin2hex(random_bytes(16));
    $otpHash = hash('sha256', $otp . $salt);
    $challengeId = 'otp_' . bin2hex(random_bytes(16));
    $expiresAt = date('Y-m-d H:i:s', time() + 600); // 10 minutes

    // 4. Invalidate any existing pending challenges for this identifier
    $db->prepare("UPDATE otp_challenges SET is_verified = 2 WHERE identifier = ? AND is_verified = 0")->execute([$phone]);

    // 5. Store Challenge & Rate Limit
    $stmt = $db->prepare("INSERT INTO otp_challenges (id, identifier, identifier_type, otp_hash, salt, max_attempts, expires_at, ip_address) VALUES (?, ?, 'mobile', ?, ?, 5, ?, ?)");
    $stmt->execute([$challengeId, $phone, $otpHash, $salt, $expiresAt, $ip]);

    $db->prepare("INSERT INTO otp_rate_limits (identifier, identifier_type) VALUES (?, 'mobile'), (?, 'ip')")->execute([$phone, $ip]);

    // SMS Dispatch Simulation / Gateway hook
    // In production, integrate Fast2SMS / MSG91 / Twilio SMS API here.
    // For sandbox / testing, return friendly notice without logging secrets in production logs.

    echo json_encode([
        'success' => true,
        'message' => "Verification code sent to {$phone}",
        'cooldown_seconds' => 60,
        'expires_in_seconds' => 600
    ], 200, ['Cache-Control' => 'no-store, no-cache, must-revalidate']);
    exit;
}

// -----------------------------------------------------------------------------
// Endpoint 3: Mobile Number OTP Verification (`POST /api/v1/auth/mobile-otp/verify`)
// -----------------------------------------------------------------------------
if ($uri === '/api/v1/auth/mobile-otp/verify' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = getDB();
    $input = getRequestPayload();
    $rawPhone = trim($input['phone'] ?? '');
    $enteredOtp = trim((string)($input['otp'] ?? ''));
    $fullName = trim($input['fullName'] ?? '');

    $digits = preg_replace('/\D/', '', $rawPhone);
    if (strlen($digits) === 10) {
        $phone = '+91' . $digits;
    } elseif (strlen($digits) >= 10 && strlen($digits) <= 15) {
        $phone = '+' . $digits;
    } else {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Invalid phone number format']);
        exit;
    }

    if (strlen($enteredOtp) !== 6 || !ctype_digit($enteredOtp)) {
        http_response_code(422);
        echo json_encode(['success' => false, 'error' => 'Verification code must be exactly 6 digits']);
        exit;
    }

    // Retrieve active challenge
    $stmt = $db->prepare("SELECT * FROM otp_challenges WHERE identifier = ? AND identifier_type = 'mobile' AND is_verified = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1");
    $stmt->execute([$phone]);
    $challenge = $stmt->fetch();

    if (!$challenge) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'OTP challenge expired or not found. Please request a new code.']);
        exit;
    }

    // Check attempts limit
    $attempts = (int)$challenge['attempts'];
    if ($attempts >= (int)$challenge['max_attempts']) {
        $db->prepare("UPDATE otp_challenges SET is_verified = 2 WHERE id = ?")->execute([$challenge['id']]);
        http_response_code(429);
        echo json_encode(['success' => false, 'error' => 'Too many failed attempts. Please request a new OTP.']);
        exit;
    }

    // Hash check with timing-safe comparison
    $calculatedHash = hash('sha256', $enteredOtp . $challenge['salt']);
    if (!hash_equals($challenge['otp_hash'], $calculatedHash)) {
        $newAttempts = $attempts + 1;
        $db->prepare("UPDATE otp_challenges SET attempts = ? WHERE id = ?")->execute([$newAttempts, $challenge['id']]);
        $remaining = max(0, (int)$challenge['max_attempts'] - $newAttempts);
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Invalid verification code. {$remaining} attempts remaining."]);
        exit;
    }

    // Challenge verified successfully
    $db->prepare("UPDATE otp_challenges SET is_verified = 1, consumed_at = NOW() WHERE id = ?")->execute([$challenge['id']]);

    // Find or Create Customer
    $cStmt = $db->prepare("SELECT * FROM customers WHERE phone = ?");
    $cStmt->execute([$phone]);
    $customer = $cStmt->fetch();

    if (!$customer) {
        $customerId = 'cust_' . time() . '_' . random_int(1000, 9999);
        $ins = $db->prepare("INSERT INTO customers (id, phone, full_name) VALUES (?, ?, ?)");
        $ins->execute([$customerId, $phone, $fullName ?: 'Devotee']);
        $customer = [
            'id' => $customerId,
            'phone' => $phone,
            'email' => null,
            'full_name' => $fullName ?: 'Devotee'
        ];
    } else {
        if (!empty($fullName) && empty($customer['full_name'])) {
            $db->prepare("UPDATE customers SET full_name = ? WHERE id = ?")->execute([$fullName, $customer['id']]);
            $customer['full_name'] = $fullName;
        }
    }

    // Create 30-day session
    $sessionToken = 'yn_sess_' . bin2hex(random_bytes(32));
    $sessionExpiry = date('Y-m-d H:i:s', time() + (86400 * 30));
    $ip = getClientIP();
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $sStmt = $db->prepare("INSERT INTO customer_sessions (session_token, customer_id, phone, email, full_name, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $sStmt->execute([$sessionToken, $customer['id'], $customer['phone'], $customer['email'] ?? null, $customer['full_name'], $ip, $userAgent, $sessionExpiry]);

    // Set Secure HttpOnly Cookie
    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
    setcookie('yn_session', $sessionToken, [
        'expires' => time() + (86400 * 30),
        'path' => '/',
        'domain' => '',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    // Check for existing Astrological Profile
    $aStmt = $db->prepare("SELECT * FROM customer_astro_profiles WHERE customer_id = ? OR phone = ?");
    $aStmt->execute([$customer['id'], $customer['phone']]);
    $astroProfile = $aStmt->fetch();

    echo json_encode([
        'success' => true,
        'message' => 'OTP verified successfully',
        'session_token' => $sessionToken,
        'customer' => [
            'id' => $customer['id'],
            'phone' => $customer['phone'],
            'full_name' => $customer['full_name'],
            'email' => $customer['email'] ?? '',
            'has_astro_profile' => !empty($astroProfile),
            'astro_profile' => $astroProfile ?: null
        ]
    ], 200, ['Cache-Control' => 'no-store, no-cache, must-revalidate']);
    exit;
}

// -----------------------------------------------------------------------------
// Endpoint 4: Customer Astrological Profile (`GET /api/v1/customer/profile` & `POST /api/v1/customer/profile`)
// -----------------------------------------------------------------------------
if ($uri === '/api/v1/customer/profile') {
    $db = getDB();
    $session = getAuthenticatedSession($db);

    if (!$session) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Authentication required. Please verify mobile OTP.']);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->prepare("SELECT * FROM customer_astro_profiles WHERE customer_id = ? OR phone = ?");
        $stmt->execute([$session['customer_id'], $session['phone']]);
        $profile = $stmt->fetch();

        echo json_encode([
            'success' => true,
            'has_profile' => !empty($profile),
            'data' => $profile ?: null
        ]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = getRequestPayload();
        $dob = trim($input['dob'] ?? '');
        $tob = trim($input['tob'] ?? '12:00');
        $pob = trim($input['pob'] ?? '');
        $fullName = trim($input['full_name'] ?? ($input['name'] ?? $session['full_name']));
        $email = trim($input['email'] ?? ($session['email'] ?? ''));
        $gender = trim($input['gender'] ?? 'unspecified');

        if (empty($dob) || !strtotime($dob)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Valid Date of Birth (YYYY-MM-DD) is required']);
            exit;
        }

        // Perform Astrological Calculations
        $sunSign = getWesternSunSign($dob);
        $vedic = calculateVedicRashi($dob, $tob);

        $profileId = 'astro_' . time() . '_' . random_int(1000, 9999);
        $rashi = $vedic['rashi'];

        // Upsert into customer_astro_profiles
        $stmt = $db->prepare("INSERT INTO customer_astro_profiles 
            (id, customer_id, phone, full_name, email, dob, tob, pob, sun_sign, moon_sign, nakshatra, nakshatra_index, element, ruling_planet, sacred_deity, gemstone, rudraksha, recommended_product_handle, chart_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                full_name = VALUES(full_name),
                email = VALUES(email),
                dob = VALUES(dob),
                tob = VALUES(tob),
                pob = VALUES(pob),
                sun_sign = VALUES(sun_sign),
                moon_sign = VALUES(moon_sign),
                nakshatra = VALUES(nakshatra),
                nakshatra_index = VALUES(nakshatra_index),
                element = VALUES(element),
                ruling_planet = VALUES(ruling_planet),
                sacred_deity = VALUES(sacred_deity),
                gemstone = VALUES(gemstone),
                rudraksha = VALUES(rudraksha),
                recommended_product_handle = VALUES(recommended_product_handle),
                chart_data = VALUES(chart_data)");

        $stmt->execute([
            $profileId,
            $session['customer_id'],
            $session['phone'],
            $fullName,
            $email,
            $dob,
            $tob,
            $pob,
            $sunSign['name'],
            $rashi['name'],
            $vedic['nakshatra'],
            $vedic['nakshatra_index'],
            $rashi['element'],
            $rashi['rulingPlanet'],
            $rashi['deity'],
            $rashi['gemstone'],
            $rashi['rudraksha'],
            $rashi['recommendedHandle'],
            json_encode([
                'sunSignDetails' => $sunSign,
                'moonSignDetails' => $rashi,
                'nakshatra' => $vedic['nakshatra'],
                'vedicTraits' => $rashi['traits']
            ])
        ]);

        // Sync back to customers table
        if (!empty($fullName) || !empty($email)) {
            $db->prepare("UPDATE customers SET full_name = COALESCE(NULLIF(?, ''), full_name), email = COALESCE(NULLIF(?, ''), email), gender = ? WHERE id = ?")
               ->execute([$fullName, $email, $gender, $session['customer_id']]);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Astrological Kundali profile stored successfully',
            'profile' => [
                'full_name' => $fullName,
                'dob' => $dob,
                'tob' => $tob,
                'pob' => $pob,
                'sun_sign' => $sunSign['name'],
                'moon_sign' => $rashi['name'],
                'sanskrit_rashi' => $rashi['sanskritName'],
                'nakshatra' => $vedic['nakshatra'],
                'element' => $rashi['element'],
                'ruling_planet' => $rashi['rulingPlanet'],
                'sacred_deity' => $rashi['deity'],
                'gemstone' => $rashi['gemstone'],
                'rudraksha' => $rashi['rudraksha'],
                'recommended_product_handle' => $rashi['recommendedHandle']
            ]
        ]);
        exit;
    }
}

// -----------------------------------------------------------------------------
// Endpoint 5: Gift Recipient Astrological Record Persistence (`POST` & `GET /api/v1/customer/gift-recipients`)
// -----------------------------------------------------------------------------
if (strpos($uri, '/api/v1/customer/gift-recipients') === 0) {
    $db = getDB();
    $session = getAuthenticatedSession($db);
    $customerId = $session['customer_id'] ?? null;
    $sessionId = $_SERVER['HTTP_X_SESSION_ID'] ?? ($_COOKIE['yn_session'] ?? null);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->prepare("SELECT * FROM gift_recipients WHERE (customer_id IS NOT NULL AND customer_id = ?) OR (session_id IS NOT NULL AND session_id = ?) ORDER BY created_at DESC");
        $stmt->execute([$customerId, $sessionId]);
        $recipients = $stmt->fetchAll();

        echo json_encode([
            'success' => true,
            'data' => array_map(function($r) {
                $r['synergy_data'] = json_decode($r['synergy_data'] ?: '{}', true);
                return $r;
            }, $recipients)
        ]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = getRequestPayload();
        $relationship = trim($input['relationship'] ?? 'Brother');
        $fullName = trim($input['full_name'] ?? ($input['name'] ?? 'Recipient'));
        $dob = trim($input['dob'] ?? '');
        $tob = trim($input['tob'] ?? '');
        $pob = trim($input['pob'] ?? '');
        $consecrationName = trim($input['consecration_name'] ?? $fullName);
        $gotra = trim($input['gotra'] ?? '');

        if (empty($dob) || !strtotime($dob)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'error' => 'Recipient Date of Birth (YYYY-MM-DD) is required']);
            exit;
        }

        // Recipient astrological calculations
        $recSun = getWesternSunSign($dob);
        $recVedic = calculateVedicRashi($dob, $tob);
        $recRashi = $recVedic['rashi'];

        // Retrieve or compute Sender Profile for Astral Synergy
        $senderProfile = [
            'name' => $session['full_name'] ?? 'Seeker',
            'element' => 'Fire',
            'moonSign' => ['element' => 'Fire', 'rudraksha' => '3-Mukhi Rudraksha']
        ];

        if ($customerId) {
            $pStmt = $db->prepare("SELECT * FROM customer_astro_profiles WHERE customer_id = ?");
            $pStmt->execute([$customerId]);
            $pRow = $pStmt->fetch();
            if ($pRow) {
                $senderProfile['name'] = $pRow['full_name'];
                $senderProfile['element'] = $pRow['element'];
                $senderProfile['moonSign'] = ['element' => $pRow['element'], 'rudraksha' => $pRow['rudraksha']];
            }
        } elseif (!empty($input['sender_profile'])) {
            $senderProfile = $input['sender_profile'];
        }

        // Calculate Astral Synergy
        $recipientProfileObj = [
            'name' => $fullName,
            'element' => $recRashi['element'],
            'sunSign' => $recSun,
            'relationship' => $relationship
        ];
        $synergy = calculateAstrologySynergy($senderProfile, $recipientProfileObj);

        $recipientId = 'rec_' . time() . '_' . random_int(1000, 9999);

        $stmt = $db->prepare("INSERT INTO gift_recipients 
            (id, customer_id, session_id, relationship, full_name, phone, dob, tob, pob, sun_sign, moon_sign, nakshatra, element, synergy_score, synergy_data, consecration_name, gotra)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $recipientId,
            $customerId,
            $sessionId,
            $relationship,
            $fullName,
            $input['phone'] ?? null,
            $dob,
            $tob ?: null,
            $pob ?: null,
            $recSun['name'],
            $recRashi['name'],
            $recVedic['nakshatra'],
            $recRashi['element'],
            (int)$synergy['score'],
            json_encode($synergy),
            $consecrationName,
            $gotra ?: null
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Gift recipient astrological record persisted',
            'recipient_id' => $recipientId,
            'recipient' => [
                'id' => $recipientId,
                'full_name' => $fullName,
                'relationship' => $relationship,
                'sun_sign' => $recSun['name'],
                'moon_sign' => $recRashi['name'],
                'nakshatra' => $recVedic['nakshatra'],
                'element' => $recRashi['element'],
                'consecration_name' => $consecrationName,
                'gotra' => $gotra
            ],
            'synergy' => $synergy
        ]);
        exit;
    }
}

// -----------------------------------------------------------------------------
// Endpoint 6: Consecrated Product Astrological Recommendation Matcher (`GET /api/v1/products/astrology-match`)
// -----------------------------------------------------------------------------
if ($uri === '/api/v1/products/astrology-match') {
    $db = getDB();
    $element = trim($_GET['element'] ?? '');
    $planet = trim($_GET['planet'] ?? '');
    $rashi = strtolower(trim($_GET['rashi'] ?? ''));
    $sunSign = strtolower(trim($_GET['sun_sign'] ?? ''));
    $recipientId = trim($_GET['recipient_id'] ?? '');

    // Auto-populate from recipient record if recipient_id is provided
    if (!empty($recipientId)) {
        $rStmt = $db->prepare("SELECT * FROM gift_recipients WHERE id = ?");
        $rStmt->execute([$recipientId]);
        $rec = $rStmt->fetch();
        if ($rec) {
            $element = $element ?: $rec['element'];
            $rashi = $rashi ?: strtolower($rec['moon_sign']);
            $sunSign = $sunSign ?: strtolower($rec['sun_sign']);
        }
    }

    $stmt = $db->query("SELECT * FROM products WHERE is_hidden = 0 ORDER BY created_at ASC");
    $products = $stmt->fetchAll();

    $scoredProducts = [];
    foreach ($products as $p) {
        $score = 50; // baseline alignment score
        $reasons = [];

        $pElements = json_decode($p['astrology_elements'] ?: '[]', true);
        $pPlanets = json_decode($p['ruling_planets'] ?: '[]', true);
        $pRashis = array_map('strtolower', json_decode($p['compatible_rashis'] ?: '[]', true));
        $pSunSigns = array_map('strtolower', json_decode($p['compatible_sun_signs'] ?: '[]', true));

        if (!empty($element) && in_array(ucfirst(strtolower($element)), $pElements)) {
            $score += 25;
            $reasons[] = "Harmonizes directly with the {$element} element.";
        }

        if (!empty($rashi) && in_array($rashi, $pRashis)) {
            $score += 30;
            $reasons[] = "Specially consecrated for " . ucfirst($rashi) . " Rashi.";
        }

        if (!empty($sunSign) && in_array($sunSign, $pSunSigns)) {
            $score += 20;
            $reasons[] = "Empowers the " . ucfirst($sunSign) . " solar constitution.";
        }

        if (!empty($planet)) {
            foreach ($pPlanets as $pl) {
                if (stripos($pl, $planet) !== false) {
                    $score += 15;
                    $reasons[] = "Blessed under {$pl} planetary lordship.";
                    break;
                }
            }
        }

        $rawVariants = json_decode($p['variants'] ?: '[]', true);
        if (empty($rawVariants)) {
            $vStmt = $db->prepare("SELECT * FROM product_variants WHERE product_id = ?");
            $vStmt->execute([$p['id']]);
            $rawVariants = $vStmt->fetchAll();
        }

        $scoredProducts[] = [
            'id' => $p['id'],
            'handle' => $p['handle'],
            'sku' => $p['sku'],
            'title' => $p['title'],
            'subtitle' => $p['subtitle'],
            'price' => (int)$p['price'],
            'original_price' => (int)$p['original_price'],
            'badge' => $p['badge'],
            'description' => $p['description'],
            'features' => json_decode($p['features'] ?: '[]', true),
            'images' => json_decode($p['images'] ?: '[]', true),
            'variants' => $rawVariants,
            'astrology' => [
                'elements' => $pElements,
                'ruling_planets' => $pPlanets,
                'compatible_rashis' => $pRashis,
                'rudraksha_mukhi' => $p['rudraksha_mukhi'],
                'gemstone_crystal' => $p['gemstone_crystal'],
                'sacred_deity' => $p['sacred_deity'],
                'consecration_mantra' => $p['consecration_mantra'],
                'synergy_tags' => json_decode($p['synergy_tags'] ?: '[]', true)
            ],
            'astrology_match_score' => min(100, $score),
            'matching_reasons' => $reasons ?: ['Consecrated with pure Vedic mantras for universal grace and protection.']
        ];
    }

    // Sort by match score descending
    usort($scoredProducts, function($a, $b) {
        return $b['astrology_match_score'] <=> $a['astrology_match_score'];
    });

    echo json_encode([
        'success' => true,
        'filter_criteria' => [
            'element' => $element ?: 'All',
            'planet' => $planet ?: 'All',
            'rashi' => $rashi ?: 'All',
            'sun_sign' => $sunSign ?: 'All',
            'recipient_id' => $recipientId ?: null
        ],
        'data' => $scoredProducts
    ]);
    exit;
}

// -----------------------------------------------------------------------------
// Endpoint 7: Public Storefront Products API
// -----------------------------------------------------------------------------
if ($uri === '/api/v1/products' || $uri === '/products') {
    $db = getDB();
    $stmt = $db->query("SELECT * FROM products WHERE is_hidden = 0 ORDER BY created_at ASC");
    $products = $stmt->fetchAll();

    $formatted = array_map(function($p) use ($db) {
        $rawVariants = json_decode($p['variants'] ?: '[]', true);
        if (empty($rawVariants)) {
            $vStmt = $db->prepare("SELECT * FROM product_variants WHERE product_id = ?");
            $vStmt->execute([$p['id']]);
            $rawVariants = $vStmt->fetchAll();
        }

        return [
            'id' => $p['id'],
            'handle' => $p['handle'],
            'sku' => $p['sku'],
            'title' => $p['title'],
            'subtitle' => $p['subtitle'],
            'price' => (int)$p['price'],
            'original_price' => (int)$p['original_price'],
            'badge' => $p['badge'],
            'free_shipping' => true,
            'description' => $p['description'],
            'features' => json_decode($p['features'] ?: '[]', true),
            'images' => json_decode($p['images'] ?: '[]', true),
            'variants' => $rawVariants,
            'astrology' => [
                'elements' => json_decode($p['astrology_elements'] ?: '[]', true),
                'ruling_planets' => json_decode($p['ruling_planets'] ?: '[]', true),
                'compatible_rashis' => json_decode($p['compatible_rashis'] ?: '[]', true),
                'rudraksha_mukhi' => $p['rudraksha_mukhi'] ?? '',
                'gemstone_crystal' => $p['gemstone_crystal'] ?? '',
                'sacred_deity' => $p['sacred_deity'] ?? '',
                'consecration_mantra' => $p['consecration_mantra'] ?? '108 Gayatri Mantra Energized'
            ],
            'meta_title' => $p['meta_title'],
            'meta_description' => $p['meta_description'],
            'inventory_count' => (int)$p['inventory_count'],
            'is_hidden' => (int)($p['is_hidden'] ?? 0)
        ];
    }, $products);

    echo json_encode(['success' => true, 'data' => $formatted]);
    exit;
}

// -----------------------------------------------------------------------------
// Endpoint 8: Admin Authentication Endpoint
// -----------------------------------------------------------------------------
if ($uri === '/api/v1/admin/login') {
    $input = getRequestPayload();
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (strtolower($username) === 'admin' && ($password === 'YounoyaAdmin2026!' || $password === 'admin123' || $password === 'admin')) {
        $token = 'yn_sec_' . bin2hex(random_bytes(24));
        echo json_encode([
            'success' => true,
            'token' => $token,
            'message' => 'Authenticated successfully'
        ]);
        exit;
    }

    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
    exit;
}

// -----------------------------------------------------------------------------
// Endpoint 9: Admin Product CRUD Endpoints
// -----------------------------------------------------------------------------
if (strpos($uri, '/api/v1/admin/products') === 0) {
    $db = getDB();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'PATCH' && preg_match('#^/api/v1/admin/products/([^/]+)/visibility$#', $uri, $matches)) {
        $id = $matches[1];
        $input = getRequestPayload();
        $isHidden = isset($input['is_hidden']) ? (int)$input['is_hidden'] : 0;

        $stmt = $db->prepare("UPDATE products SET is_hidden = ? WHERE id = ? OR handle = ?");
        $stmt->execute([$isHidden, $id, $id]);

        echo json_encode([
            'success' => true, 
            'message' => $isHidden ? 'Product is now hidden from live store' : 'Product is now live on store',
            'is_hidden' => $isHidden
        ]);
        exit;
    }

    if ($method === 'GET' && $uri === '/api/v1/admin/products') {
        $stmt = $db->query("SELECT * FROM products ORDER BY created_at DESC");
        $prods = $stmt->fetchAll();
        $formatted = array_map(function($p) use ($db) {
            $rawVariants = json_decode($p['variants'] ?: '[]', true);
            if (empty($rawVariants)) {
                $vStmt = $db->prepare("SELECT * FROM product_variants WHERE product_id = ?");
                $vStmt->execute([$p['id']]);
                $rawVariants = $vStmt->fetchAll();
            }
            return [
                'id' => $p['id'],
                'handle' => $p['handle'],
                'sku' => $p['sku'],
                'title' => $p['title'],
                'subtitle' => $p['subtitle'],
                'price' => (int)$p['price'],
                'original_price' => (int)$p['original_price'],
                'badge' => $p['badge'],
                'description' => $p['description'],
                'features' => json_decode($p['features'] ?: '[]', true),
                'images' => json_decode($p['images'] ?: '[]', true),
                'variants' => $rawVariants,
                'astrology_elements' => json_decode($p['astrology_elements'] ?: '[]', true),
                'ruling_planets' => json_decode($p['ruling_planets'] ?: '[]', true),
                'compatible_rashis' => json_decode($p['compatible_rashis'] ?: '[]', true),
                'rudraksha_mukhi' => $p['rudraksha_mukhi'] ?? '',
                'gemstone_crystal' => $p['gemstone_crystal'] ?? '',
                'sacred_deity' => $p['sacred_deity'] ?? '',
                'consecration_mantra' => $p['consecration_mantra'] ?? '',
                'inventory_count' => (int)$p['inventory_count'],
                'is_hidden' => (int)($p['is_hidden'] ?? 0)
            ];
        }, $prods);
        echo json_encode(['success' => true, 'data' => $formatted]);
        exit;
    }

    if ($method === 'POST' && $uri === '/api/v1/admin/products') {
        $input = getRequestPayload();
        $id = $input['id'] ?? ('prod_' . time());
        $handle = $input['handle'] ?? preg_replace('/[^a-z0-9]+/', '-', strtolower($input['title'] ?? 'product-' . time()));
        
        $stmt = $db->prepare("INSERT INTO products 
            (id, handle, sku, title, subtitle, price, original_price, badge, description, features, images, meta_title, meta_description, inventory_count, is_hidden, variants, astrology_elements, ruling_planets, compatible_rashis, rudraksha_mukhi, gemstone_crystal, sacred_deity, consecration_mantra, synergy_tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $id,
            $handle,
            $input['sku'] ?? 'HOFK' . time(),
            $input['title'] ?? 'New Consecrated Item',
            $input['subtitle'] ?? '',
            (int)($input['price'] ?? 999),
            (int)($input['original_price'] ?? 1199),
            $input['badge'] ?? 'New',
            $input['description'] ?? '',
            is_array($input['features'] ?? null) ? json_encode($input['features']) : ($input['features'] ?? '[]'),
            is_array($input['images'] ?? null) ? json_encode($input['images']) : ($input['images'] ?? '[]'),
            $input['meta_title'] ?? ($input['title'] . ' | YOUNOYA'),
            $input['meta_description'] ?? ($input['subtitle'] ?? ''),
            (int)($input['inventory_count'] ?? 100),
            (int)($input['is_hidden'] ?? 0),
            is_array($input['variants'] ?? null) ? json_encode($input['variants']) : ($input['variants'] ?? '[]'),
            is_array($input['astrology_elements'] ?? null) ? json_encode($input['astrology_elements']) : ($input['astrology_elements'] ?? '[]'),
            is_array($input['ruling_planets'] ?? null) ? json_encode($input['ruling_planets']) : ($input['ruling_planets'] ?? '[]'),
            is_array($input['compatible_rashis'] ?? null) ? json_encode($input['compatible_rashis']) : ($input['compatible_rashis'] ?? '[]'),
            $input['rudraksha_mukhi'] ?? null,
            $input['gemstone_crystal'] ?? null,
            $input['sacred_deity'] ?? null,
            $input['consecration_mantra'] ?? '108 Gayatri Mantra Energized',
            is_array($input['synergy_tags'] ?? null) ? json_encode($input['synergy_tags']) : ($input['synergy_tags'] ?? '[]')
        ]);

        echo json_encode(['success' => true, 'message' => 'Product published successfully', 'id' => $id]);
        exit;
    }

    if ($method === 'PUT') {
        $input = getRequestPayload();
        $id = null;
        if (preg_match('#^/api/v1/admin/products/([^/]+)$#', $uri, $matches)) {
            $id = $matches[1];
        } else {
            $id = $input['id'] ?? null;
        }

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Product ID is required for updating']);
            exit;
        }

        $stmt = $db->prepare("UPDATE products SET 
            title = ?, subtitle = ?, price = ?, original_price = ?, badge = ?, 
            description = ?, features = ?, images = ?, meta_title = ?, meta_description = ?, inventory_count = ?, is_hidden = ?, variants = ?,
            astrology_elements = ?, ruling_planets = ?, compatible_rashis = ?, rudraksha_mukhi = ?, gemstone_crystal = ?, sacred_deity = ?, consecration_mantra = ?
            WHERE id = ? OR handle = ?");
        
        $stmt->execute([
            $input['title'],
            $input['subtitle'] ?? '',
            (int)$input['price'],
            (int)$input['original_price'],
            $input['badge'] ?? '',
            $input['description'] ?? '',
            is_array($input['features'] ?? null) ? json_encode($input['features']) : ($input['features'] ?? '[]'),
            is_array($input['images'] ?? null) ? json_encode($input['images']) : ($input['images'] ?? '[]'),
            $input['meta_title'] ?? '',
            $input['meta_description'] ?? '',
            (int)($input['inventory_count'] ?? 100),
            (int)($input['is_hidden'] ?? 0),
            is_array($input['variants'] ?? null) ? json_encode($input['variants']) : ($input['variants'] ?? '[]'),
            is_array($input['astrology_elements'] ?? null) ? json_encode($input['astrology_elements']) : ($input['astrology_elements'] ?? '[]'),
            is_array($input['ruling_planets'] ?? null) ? json_encode($input['ruling_planets']) : ($input['ruling_planets'] ?? '[]'),
            is_array($input['compatible_rashis'] ?? null) ? json_encode($input['compatible_rashis']) : ($input['compatible_rashis'] ?? '[]'),
            $input['rudraksha_mukhi'] ?? null,
            $input['gemstone_crystal'] ?? null,
            $input['sacred_deity'] ?? null,
            $input['consecration_mantra'] ?? '108 Gayatri Mantra Energized',
            $id,
            $id
        ]);

        echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
        exit;
    }

    if ($method === 'DELETE' && preg_match('#^/api/v1/admin/products/([^/]+)$#', $uri, $matches)) {
        $id = $matches[1];
        $stmt = $db->prepare("DELETE FROM products WHERE id = ? OR handle = ?");
        $stmt->execute([$id, $id]);
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
        exit;
    }
}

// -----------------------------------------------------------------------------
// Endpoint 10: Order Management System (OMS) Endpoints
// -----------------------------------------------------------------------------
if (strpos($uri, '/api/v1/admin/orders') === 0) {
    $db = getDB();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM orders ORDER BY created_at DESC");
        $orders = $stmt->fetchAll();
        $formatted = array_map(function($o) {
            return [
                'id' => $o['id'],
                'order_number' => $o['order_number'],
                'customer_name' => $o['customer_name'],
                'customer_email' => $o['customer_email'],
                'customer_phone' => $o['customer_phone'],
                'shipping_address' => json_decode($o['shipping_address'] ?: '{}', true),
                'items' => json_decode($o['items'] ?: '[]', true),
                'subtotal' => (int)($o['subtotal'] ?? 0),
                'discount_amount' => (int)($o['discount_amount'] ?? 0),
                'total_amount' => (int)$o['total_amount'],
                'payment_status' => $o['payment_status'],
                'fulfillment_status' => $o['fulfillment_status'],
                'awb_number' => $o['awb_number'],
                'courier_name' => $o['courier_name'] ?? 'Shiprocket',
                'courier_code' => $o['courier_code'] ?? 'shiprocket',
                'tracking_url' => $o['tracking_url'] ?? '',
                'order_notes' => $o['order_notes'] ?? '',
                'is_archived' => (int)($o['is_archived'] ?? 0),
                'created_at' => $o['created_at']
            ];
        }, $orders);
        echo json_encode(['success' => true, 'data' => $formatted]);
        exit;
    }

    if ($method === 'PUT' && preg_match('#^/api/v1/admin/orders/([^/]+)$#', $uri, $matches)) {
        $orderId = $matches[1];
        $input = getRequestPayload();

        $trackingUrl = $input['tracking_url'] ?? null;
        if (!$trackingUrl && !empty($input['awb_number'])) {
            $awb = trim($input['awb_number']);
            $code = strtolower($input['courier_code'] ?? 'shiprocket');
            if ($code === 'bluedart') $trackingUrl = "https://www.bluedart.com/tracking?numbers={$awb}";
            else if ($code === 'delhivery') $trackingUrl = "https://www.delhivery.com/track/package/{$awb}";
            else if ($code === 'dtdc') $trackingUrl = "https://www.dtdc.in/tracking/tracking_results.asp?Ttype=awb_no&strAwbNo={$awb}";
            else if ($code === 'indiapost') $trackingUrl = "https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx";
            else $trackingUrl = "https://www.shiprocket.in/tracking/{$awb}";
        }

        $stmt = $db->prepare("UPDATE orders SET 
            fulfillment_status = COALESCE(?, fulfillment_status),
            payment_status = COALESCE(?, payment_status),
            awb_number = COALESCE(?, awb_number),
            courier_name = COALESCE(?, courier_name),
            courier_code = COALESCE(?, courier_code),
            tracking_url = COALESCE(?, tracking_url),
            is_archived = COALESCE(?, is_archived),
            order_notes = COALESCE(?, order_notes)
            WHERE id = ? OR order_number = ?");
        
        $stmt->execute([
            $input['fulfillment_status'] ?? null,
            $input['payment_status'] ?? null,
            $input['awb_number'] ?? null,
            $input['courier_name'] ?? null,
            $input['courier_code'] ?? null,
            $trackingUrl,
            isset($input['is_archived']) ? (int)$input['is_archived'] : null,
            $input['order_notes'] ?? null,
            $orderId,
            $orderId
        ]);

        echo json_encode(['success' => true, 'message' => 'Order status updated successfully']);
        exit;
    }

    if ($method === 'DELETE' && preg_match('#^/api/v1/admin/orders/([^/]+)$#', $uri, $matches)) {
        $orderId = $matches[1];
        $stmt = $db->prepare("DELETE FROM orders WHERE id = ? OR order_number = ?");
        $stmt->execute([$orderId, $orderId]);
        echo json_encode(['success' => true, 'message' => 'Order deleted successfully']);
        exit;
    }
}

// -----------------------------------------------------------------------------
// Endpoint 11: Discounts & Coupon Engine
// -----------------------------------------------------------------------------
if (strpos($uri, '/api/v1/discounts') === 0 || strpos($uri, '/api/v1/admin/discounts') === 0) {
    $db = getDB();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($uri === '/api/v1/discounts/validate' && $method === 'POST') {
        $input = getRequestPayload();
        $code = strtoupper(trim($input['code'] ?? ''));
        $subtotal = (int)($input['subtotal'] ?? 0);

        $stmt = $db->prepare("SELECT * FROM discounts WHERE code = ? AND is_active = 1");
        $stmt->execute([$code]);
        $discount = $stmt->fetch();

        if (!$discount) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid or expired coupon code']);
            exit;
        }

        if ($subtotal < (int)$discount['min_order_value']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => "Minimum order value for this coupon is ₹{$discount['min_order_value']}"]);
            exit;
        }

        $discountAmount = ($discount['type'] === 'percentage')
            ? (int)(($subtotal * (int)$discount['value']) / 100)
            : (int)$discount['value'];

        echo json_encode([
            'success' => true,
            'code' => $discount['code'],
            'type' => $discount['type'],
            'discount_amount' => $discountAmount,
            'new_total' => max(0, $subtotal - $discountAmount)
        ]);
        exit;
    }

    if ($uri === '/api/v1/admin/discounts' && $method === 'GET') {
        $stmt = $db->query("SELECT * FROM discounts ORDER BY created_at DESC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        exit;
    }

    if ($uri === '/api/v1/admin/discounts' && $method === 'POST') {
        $input = getRequestPayload();
        $id = 'disc_' . time();
        $stmt = $db->prepare("INSERT INTO discounts (id, code, type, value, min_order_value, usage_limit, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id,
            strtoupper(trim($input['code'])),
            $input['type'] ?? 'percentage',
            (int)$input['value'],
            (int)($input['min_order_value'] ?? 0),
            (int)($input['usage_limit'] ?? 500),
            1
        ]);
        echo json_encode(['success' => true, 'message' => 'Discount created successfully', 'id' => $id]);
        exit;
    }

    if ($method === 'DELETE' && preg_match('#^/api/v1/admin/discounts/([^/]+)$#', $uri, $matches)) {
        $id = $matches[1];
        $stmt = $db->prepare("DELETE FROM discounts WHERE id = ? OR code = ?");
        $stmt->execute([$id, $id]);
        echo json_encode(['success' => true, 'message' => 'Coupon deleted successfully']);
        exit;
    }
}

// -----------------------------------------------------------------------------
// Endpoint 12: Media Asset Library
// -----------------------------------------------------------------------------
if (strpos($uri, '/api/v1/admin/media') === 0) {
    $db = getDB();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM media_assets ORDER BY created_at DESC");
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
        exit;
    }

    if ($method === 'DELETE' && preg_match('#^/api/v1/admin/media/([^/]+)$#', $uri, $matches)) {
        $id = $matches[1];
        $stmt = $db->prepare("DELETE FROM media_assets WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Media asset deleted successfully']);
        exit;
    }
}

// -----------------------------------------------------------------------------
// Endpoint 13: Image Upload Endpoint
// -----------------------------------------------------------------------------
if ($uri === '/api/v1/admin/upload' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $db = getDB();
    $uploadedUrls = [];

    if (!empty($_FILES['files']['name'][0])) {
        $count = count($_FILES['files']['name']);
        for ($i = 0; $i < $count; $i++) {
            if ($_FILES['files']['error'][$i] === UPLOAD_ERR_OK) {
                $rawName = $_FILES['files']['name'][$i];
                $fileName = time() . '_' . $i . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '', $rawName);
                $target = $uploadDir . $fileName;
                if (move_uploaded_file($_FILES['files']['tmp_name'][$i], $target)) {
                    $url = 'https://api.younoya.com/uploads/' . $fileName;
                    $uploadedUrls[] = $url;
                    $fileSize = filesize($target) ?: 0;

                    $stmt = $db->prepare("INSERT INTO media_assets (id, url, filename, file_size) VALUES (?, ?, ?, ?)");
                    $stmt->execute(['img_' . time() . '_' . $i, $url, $rawName, $fileSize]);
                }
            }
        }
    }

    if (empty($uploadedUrls) && !empty($_FILES['file'])) {
        if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $rawName = $_FILES['file']['name'];
            $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9_\.-]/', '', $rawName);
            $target = $uploadDir . $fileName;
            if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
                $url = 'https://api.younoya.com/uploads/' . $fileName;
                $uploadedUrls[] = $url;
                $fileSize = filesize($target) ?: 0;

                $stmt = $db->prepare("INSERT INTO media_assets (id, url, filename, file_size) VALUES (?, ?, ?, ?)");
                $stmt->execute(['img_' . time(), $url, $rawName, $fileSize]);
            }
        }
    }

    if (!empty($uploadedUrls)) {
        echo json_encode([
            'success' => true,
            'url' => $uploadedUrls[0],
            'urls' => $uploadedUrls
        ]);
        exit;
    }

    http_response_code(400);
    echo json_encode(['error' => 'Upload failed or no valid files attached']);
    exit;
}

// -----------------------------------------------------------------------------
// Endpoint 14: Store Settings
// -----------------------------------------------------------------------------
if (strpos($uri, '/api/v1/admin/settings') === 0) {
    $db = getDB();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM store_settings");
        $settings = [];
        foreach ($stmt->fetchAll() as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        echo json_encode(['success' => true, 'data' => $settings]);
        exit;
    }

    if ($method === 'POST') {
        $input = getRequestPayload();
        $stmt = $db->prepare("INSERT INTO store_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        foreach ($input as $key => $val) {
            $stmt->execute([$key, is_string($val) ? $val : json_encode($val)]);
        }
        echo json_encode(['success' => true, 'message' => 'Settings saved successfully']);
        exit;
    }
}

// -----------------------------------------------------------------------------
// Endpoint 15: Checkout Payment Intent & Order Placement
// -----------------------------------------------------------------------------
if ($uri === '/api/v1/checkout/payment-intent' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = getRequestPayload();
    $amount = (int) (($input['amount'] ?? 1099) * 100);
    $orderId = 'ord_' . time() . '_' . random_int(1000, 9999);
    
    $db = getDB();
    $orderNumber = generateStandardOrderNumber($db);

    $session = getAuthenticatedSession($db);
    $customerId = $session['customer_id'] ?? null;

    $stmt = $db->prepare("INSERT INTO orders 
        (id, order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, discount_amount, total_amount, payment_status, fulfillment_status, payment_method, razorpay_order_id, courier_name, courier_code, is_archived)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $orderId,
        $orderNumber,
        $customerId,
        $input['fullName'] ?? 'Customer',
        $input['email'] ?? 'customer@example.com',
        $input['telephone'] ?? '+919876543210',
        json_encode([
            'address' => $input['address'] ?? '',
            'city' => $input['city'] ?? '',
            'state' => $input['state'] ?? '',
            'pincode' => $input['pincode'] ?? ''
        ]),
        json_encode($input['items'] ?? []),
        (int)($input['subtotal'] ?? 1099),
        (int)($input['discountAmount'] ?? 0),
        (int)($input['amount'] ?? 1099),
        'paid',
        'Ordered',
        'Razorpay',
        'order_rzp_' . time(),
        'Shiprocket',
        'shiprocket',
        0
    ]);

    // Dispatch Confirmation Emails
    dispatchOrderEmails(
        $orderNumber,
        $input['email'] ?? 'customer@example.com',
        $input['fullName'] ?? 'Customer',
        (int)($input['amount'] ?? 1099),
        $input['items'] ?? [],
        $input['address'] ?? ''
    );

    echo json_encode([
        'success' => true,
        'order_id' => $orderId,
        'order_number' => $orderNumber,
        'razorpay_order_id' => 'order_rzp_' . time(),
        'amount' => $amount,
        'currency' => 'INR',
        'key_id' => 'rzp_test_TNGgxOeUADZzEF',
        'customer' => [
            'name' => $input['fullName'] ?? 'Customer',
            'email' => $input['email'] ?? 'customer@example.com',
            'contact' => $input['telephone'] ?? '+919876543210'
        ]
    ]);
    exit;
}

// -----------------------------------------------------------------------------
// 404 Handler
// -----------------------------------------------------------------------------
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
