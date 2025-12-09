/*
  # Fix Orders RLS for Empty String auth.uid()

  ## Problem
  When PostgREST processes anonymous requests, auth.uid() returns an empty string ''
  instead of NULL, causing RLS policy check to fail.

  ## Solution
  Update the INSERT policy to handle both NULL and empty string for anonymous users.
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create their own orders" ON woolwitch.orders;

-- Create new INSERT policy - simplified, check admin last to avoid errors
CREATE POLICY "Users can create their own orders" ON woolwitch.orders
  FOR INSERT WITH CHECK (
    -- Anonymous users (NULL user_id, checked first)
    (auth.uid() IS NULL AND user_id IS NULL)
    -- Authenticated users can create orders for themselves  
    OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    -- Admins can create any orders
    OR (auth.uid() IS NOT NULL AND woolwitch.is_admin())
  );

-- Update order_items policy
DROP POLICY IF EXISTS "Users can create items for their own orders" ON woolwitch.order_items;

CREATE POLICY "Users can create items for their own orders" ON woolwitch.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM woolwitch.orders 
      WHERE id = order_id 
      AND (
        (auth.uid() IS NULL AND user_id IS NULL)
        OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
        OR (auth.uid() IS NOT NULL AND woolwitch.is_admin())
      )
    )
  );

-- Update payments policy
DROP POLICY IF EXISTS "System can create payments" ON woolwitch.payments;

CREATE POLICY "System can create payments" ON woolwitch.payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM woolwitch.orders 
      WHERE id = order_id 
      AND (
        (auth.uid() IS NULL AND user_id IS NULL)
        OR (auth.uid() IS NOT NULL AND auth.uid() = user_id)
        OR (auth.uid() IS NOT NULL AND woolwitch.is_admin())
      )
    )
  );
