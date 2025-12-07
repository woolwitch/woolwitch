/*
  # Fix RLS Performance Issues
  
  This migration addresses Supabase performance advisor warnings:
  1. Auth RLS Initialization Plan - Fix auth.uid() re-evaluation
  2. Multiple Permissive Policies - Combine duplicate SELECT policies
  
  ## Changes:
  - Replace auth.uid() with (select auth.uid()) in user_roles policy
  - Combine the two products SELECT policies into one optimized policy
*/

-- ========================================
-- FIX AUTH RLS INITIALIZATION PLAN
-- ========================================

-- Drop the existing policy that re-evaluates auth.uid() for each row
DROP POLICY IF EXISTS "Users can view their own role" ON woolwitch.user_roles;

-- Create optimized policy using subquery to prevent re-evaluation
CREATE POLICY "Users can view their own role"
  ON woolwitch.user_roles
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

-- ========================================
-- FIX MULTIPLE PERMISSIVE POLICIES
-- ========================================

-- Drop the existing separate SELECT policies
DROP POLICY IF EXISTS "Anyone can view available products" ON woolwitch.products;
DROP POLICY IF EXISTS "Admins can view all products" ON woolwitch.products;

-- Create single combined policy that handles both cases efficiently
-- This policy allows:
-- 1. Anyone to view available products (is_available = true)
-- 2. Admins to view all products (regardless of availability)
CREATE POLICY "Product visibility policy"
  ON woolwitch.products
  FOR SELECT
  USING (
    is_available = true OR woolwitch.is_admin()
  );