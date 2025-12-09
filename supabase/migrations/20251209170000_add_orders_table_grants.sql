/*
  # Add Table Permissions for Orders System

  ## Problem
  The orders, order_items, and payments tables have RLS policies but no table-level
  GRANT permissions for anon and authenticated roles, causing "permission denied" errors.

  ## Solution
  Grant appropriate table-level permissions to anon and authenticated roles for:
  - INSERT on orders, order_items, payments
  - SELECT on orders, order_items, payments
  - UPDATE on orders, payments (for admins via RLS)
  - DELETE (for admins via RLS)
*/

-- Grant permissions on orders table
GRANT SELECT, INSERT, UPDATE, DELETE ON woolwitch.orders TO authenticated;
GRANT SELECT, INSERT ON woolwitch.orders TO anon;

-- Grant permissions on order_items table
GRANT SELECT, INSERT, UPDATE, DELETE ON woolwitch.order_items TO authenticated;
GRANT SELECT, INSERT ON woolwitch.order_items TO anon;

-- Grant permissions on payments table
GRANT SELECT, INSERT, UPDATE, DELETE ON woolwitch.payments TO authenticated;
GRANT SELECT, INSERT ON woolwitch.payments TO anon;

COMMENT ON TABLE woolwitch.orders IS 'Customer orders - RLS controls access, table grants enable basic operations';
COMMENT ON TABLE woolwitch.order_items IS 'Order line items - RLS controls access, table grants enable basic operations';
COMMENT ON TABLE woolwitch.payments IS 'Payment records - RLS controls access, table grants enable basic operations';
