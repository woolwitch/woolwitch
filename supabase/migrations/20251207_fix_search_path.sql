/*
  # Fix search_path Parameter for Security Functions

  ## Overview
  Updates the woolwitch.is_admin() and woolwitch.handle_new_user() functions
  to include the search_path parameter for improved security.

  ## Security Context
  Setting the search_path parameter prevents potential security issues by:
  - Ensuring functions operate within the intended schema context
  - Preventing schema injection attacks
  - Following PostgreSQL security best practices
  - Addressing Supabase console warnings about missing search_path

  ## Changes
  - Recreates woolwitch.is_admin() with search_path='woolwitch, auth'
  - Recreates woolwitch.handle_new_user() with search_path='woolwitch, auth'
  - Preserves all existing functionality and permissions
*/

-- ========================================
-- UPDATE is_admin() FUNCTION
-- ========================================

-- Recreate is_admin function with search_path (no drop needed, just replace)
CREATE OR REPLACE FUNCTION woolwitch.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM woolwitch.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER
   SET search_path = 'woolwitch, auth';

-- Grant execute permissions (in case they were reset)
GRANT EXECUTE ON FUNCTION woolwitch.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION woolwitch.is_admin() TO anon;

-- ========================================
-- UPDATE handle_new_user() FUNCTION
-- ========================================

-- Recreate handle_new_user function with search_path (no drop needed, just replace)
CREATE OR REPLACE FUNCTION woolwitch.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO woolwitch.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
   SECURITY DEFINER
   SET search_path = 'woolwitch, auth';

-- Grant execute permission to service_role for trigger execution
GRANT EXECUTE ON FUNCTION woolwitch.handle_new_user() TO service_role;