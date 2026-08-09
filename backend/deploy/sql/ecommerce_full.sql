USE younoya_db;

-- 1. Product Variants (e.g. Set of 1, Set of 2, Keepsake Box Edition)
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

-- 2. Collections / Categories
CREATE TABLE IF NOT EXISTS collections (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    handle VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Discount Codes & Coupons
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

-- 4. Customer Database
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32) DEFAULT '',
    full_name VARCHAR(255) DEFAULT '',
    orders_count INT DEFAULT 0,
    total_spent INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Management System (OMS)
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
    fulfillment_status ENUM('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'unfulfilled',
    payment_method VARCHAR(64) DEFAULT 'Razorpay',
    razorpay_order_id VARCHAR(128) DEFAULT '',
    razorpay_payment_id VARCHAR(128) DEFAULT '',
    awb_number VARCHAR(128) DEFAULT '',
    courier_name VARCHAR(128) DEFAULT 'Bluedart Express',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed Initial Active Coupons
INSERT INTO discounts (id, code, type, value, min_order_value, usage_limit, is_active)
VALUES 
('disc_001', 'VEDIC10', 'percentage', 10, 500, 1000, TRUE),
('disc_002', 'FESTIVE100', 'fixed_amount', 100, 999, 500, TRUE)
ON DUPLICATE KEY UPDATE code=code;
