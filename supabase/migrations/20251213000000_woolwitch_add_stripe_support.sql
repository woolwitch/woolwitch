-- Add Stripe payment details support to payments table
-- Migration: Add stripe_details JSONB column for storing Stripe payment information

-- Add stripe_details column to payments table to store Stripe-specific payment data
ALTER TABLE woolwitch.payments 
ADD COLUMN IF NOT EXISTS stripe_details JSONB;

-- Create index for better query performance on stripe_details
CREATE INDEX IF NOT EXISTS idx_payments_stripe_details 
ON woolwitch.payments USING GIN (stripe_details);

-- Add comment to document the column purpose
COMMENT ON COLUMN woolwitch.payments.stripe_details IS 'Stores Stripe-specific payment metadata including payment_intent_id, payment_method_id, card details, etc.';

-- Update RLS policies to ensure stripe_details are handled properly
-- (The existing RLS policies should already cover this column)