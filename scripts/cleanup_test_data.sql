BEGIN;

-- 1. Remove admin user owner@younoya.com
DELETE FROM provider_identity WHERE entity_id = 'owner@younoya.com';
DELETE FROM auth_identity WHERE app_metadata->>'user_id' IN (SELECT id FROM "user" WHERE email = 'owner@younoya.com');
DELETE FROM "user" WHERE email = 'owner@younoya.com';

-- 2. Remove test orders 1 to 5 (from 2026-10-09)
DELETE FROM commerce_operation WHERE order_id IN (
  SELECT id FROM "order" WHERE display_id IN (1, 2, 3, 4, 5)
);

DELETE FROM commerce_shipment WHERE order_id IN (
  SELECT id FROM "order" WHERE display_id IN (1, 2, 3, 4, 5)
);

DELETE FROM order_cart WHERE order_id IN (
  SELECT id FROM "order" WHERE display_id IN (1, 2, 3, 4, 5)
);

DELETE FROM order_payment_collection WHERE order_id IN (
  SELECT id FROM "order" WHERE display_id IN (1, 2, 3, 4, 5)
);

CREATE TEMP TABLE tmp_del_addrs AS
SELECT shipping_address_id AS addr_id FROM "order" WHERE display_id IN (1, 2, 3, 4, 5) AND shipping_address_id IS NOT NULL
UNION
SELECT billing_address_id AS addr_id FROM "order" WHERE display_id IN (1, 2, 3, 4, 5) AND billing_address_id IS NOT NULL;

DELETE FROM "order" WHERE display_id IN (1, 2, 3, 4, 5);

DELETE FROM order_address WHERE id IN (SELECT addr_id FROM tmp_del_addrs);
DROP TABLE tmp_del_addrs;

-- 3. Remove 8 dummy test customers (preserving savvysingh2000@gmail.com)
UPDATE cart SET customer_id = NULL WHERE customer_id IN (
  SELECT id FROM customer WHERE email <> 'savvysingh2000@gmail.com'
);

DELETE FROM customer WHERE email <> 'savvysingh2000@gmail.com';

COMMIT;
