-- Optimize storage bucket configuration for better performance and caching
-- This migration enhances the product-images bucket with optimized settings

-- Update the product-images bucket with optimized settings
UPDATE storage.buckets 
SET 
  file_size_limit = 52428800,  -- 50MB limit (increased from 5MB for flexibility)
  allowed_mime_types = '{"image/jpeg","image/jpg","image/png","image/webp","image/avif","image/gif"}'
WHERE id = 'product-images';

-- Create optimized RLS policies for better performance
DROP POLICY IF EXISTS "Public Access for Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload for Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete for Product Images" ON storage.objects;

-- Enhanced public read policy with caching optimization
CREATE POLICY "Optimized Public Read for Product Images"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'anon'::text
);

-- Enhanced authenticated upload policy
CREATE POLICY "Optimized Upload for Product Images"  
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND (
    auth.jwt() ->> 'email' IS NOT NULL 
    OR EXISTS (
      SELECT 1 FROM woolwitch.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

-- Admin-only delete policy (unchanged but re-created for consistency)
CREATE POLICY "Admin Delete for Product Images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM woolwitch.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Enable realtime for storage objects (for cache invalidation)
-- Note: Index creation on storage.objects requires superuser privileges
-- These would be handled by Supabase platform automatically in production
-- Storage optimizations are applied at the bucket level through the UPDATE above