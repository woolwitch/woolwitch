/*
  # Create Products Table for Woolwitch Craft Shop

  ## Overview
  Creates the products table to store handmade crochet items and craft goods
  for the Woolwitch online shop.

  ## New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for each product
      - `name` (text) - Product name
      - `description` (text) - Detailed product description
      - `price` (numeric) - Product price in GBP
      - `image_url` (text) - URL to product image
      - `category` (text) - Product category (e.g., 'Crochet', 'Knitted', 'Home Decor')
      - `stock_quantity` (integer) - Available stock count
      - `is_available` (boolean) - Whether product is available for purchase
      - `created_at` (timestamptz) - When the product was added

  ## Security
    - Enable RLS on `products` table
    - Add policy for public read access (anyone can view products)

  ## Sample Data
    Includes several sample crochet and handmade items to showcase the shop
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10, 2) NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  stock_quantity integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON products
  FOR SELECT
  USING (is_available = true);
