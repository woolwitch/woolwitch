/*
  # Create Woolwitch Schema and Migrate Objects

  ## Overview
  Creates a dedicated 'woolwitch' schema for all application objects to improve
  security isolation and ensure that only woolwitch customers can access data.

  ## Changes
  - Create 'woolwitch' schema
  - Move 'products' and 'user_roles' tables to woolwitch schema
  - Update all functions and policies to use schema-qualified names
  - Grant appropriate permissions to authenticated and anonymous users
  - Update storage bucket policies to reference schema functions

  ## Security Benefits
  - Clear separation between application data and system data
  - Schema-level access control
  - Better organization and namespace isolation
  - Prevents accidental access to application objects from other schemas
*/

-- Create the woolwitch schema
CREATE SCHEMA IF NOT EXISTS woolwitch;

-- Grant usage on the schema to authenticated users
GRANT USAGE ON SCHEMA woolwitch TO authenticated;
GRANT USAGE ON SCHEMA woolwitch TO anon;

-- Move existing tables to woolwitch schema
ALTER TABLE IF EXISTS public.products SET SCHEMA woolwitch;
ALTER TABLE IF EXISTS public.user_roles SET SCHEMA woolwitch;

-- Drop existing policies from old locations
DROP POLICY IF EXISTS "Anyone can view available products" ON woolwitch.products;
DROP POLICY IF EXISTS "Admins can view all products" ON woolwitch.products;
DROP POLICY IF EXISTS "Admins can insert products" ON woolwitch.products;
DROP POLICY IF EXISTS "Admins can update products" ON woolwitch.products;
DROP POLICY IF EXISTS "Admins can delete products" ON woolwitch.products;
DROP POLICY IF EXISTS "Users can view their own role" ON woolwitch.user_roles;

-- Drop existing trigger and functions to recreate in woolwitch schema
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

-- Create schema-specific function to check if current user is admin
CREATE OR REPLACE FUNCTION woolwitch.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM woolwitch.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION woolwitch.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION woolwitch.is_admin() TO anon;

-- Create function to automatically assign user role when user signs up
CREATE OR REPLACE FUNCTION woolwitch.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO woolwitch.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION woolwitch.handle_new_user() TO service_role;

-- Create trigger to automatically assign user role on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION woolwitch.handle_new_user();

-- Recreate RLS policies for user_roles table
CREATE POLICY "Users can view their own role"
  ON woolwitch.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Recreate RLS policies for products table
CREATE POLICY "Anyone can view available products"
  ON woolwitch.products
  FOR SELECT
  USING (is_available = true);

CREATE POLICY "Admins can view all products"
  ON woolwitch.products
  FOR SELECT
  USING (woolwitch.is_admin());

CREATE POLICY "Admins can insert products"
  ON woolwitch.products
  FOR INSERT
  WITH CHECK (woolwitch.is_admin());

CREATE POLICY "Admins can update products"
  ON woolwitch.products
  FOR UPDATE
  USING (woolwitch.is_admin());

CREATE POLICY "Admins can delete products"
  ON woolwitch.products
  FOR DELETE
  USING (woolwitch.is_admin());

-- Grant table permissions to roles
GRANT SELECT ON woolwitch.products TO anon;
GRANT SELECT ON woolwitch.products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON woolwitch.products TO authenticated;

GRANT SELECT ON woolwitch.user_roles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON woolwitch.user_roles TO authenticated;

-- Grant sequence permissions for auto-generated IDs
GRANT USAGE ON ALL SEQUENCES IN SCHEMA woolwitch TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA woolwitch TO anon;

-- Update storage bucket policies to use schema-qualified admin check
-- First drop existing policies
DROP POLICY IF EXISTS "Admin Delete for Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update for Product Images" ON storage.objects;

-- Recreate storage policies with schema-qualified function calls
CREATE POLICY "Admin Delete for Product Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND woolwitch.is_admin());

CREATE POLICY "Admin Update for Product Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND woolwitch.is_admin())
WITH CHECK (bucket_id = 'product-images' AND woolwitch.is_admin());

-- Grant usage on woolwitch schema to storage operations
GRANT USAGE ON SCHEMA woolwitch TO postgres;