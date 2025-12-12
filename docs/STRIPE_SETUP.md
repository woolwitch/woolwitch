# Stripe Card Payments Setup

This guide covers setting up Stripe card payments for the Wool Witch application in both local development and production environments.

## Overview

The application now supports both PayPal and Stripe card payments, giving customers flexibility in payment methods. Stripe integration includes:

- Secure card input using Stripe Elements
- PCI-compliant payment processing
- Real-time payment validation
- Support for various card types
- Test mode for development

## Local Development Setup

### 1. Install Dependencies

The required Stripe dependencies are already installed:
- `@stripe/stripe-js` - Stripe JavaScript SDK
- `@stripe/react-stripe-js` - React components for Stripe

### 2. Environment Configuration

For local development, the app uses Stripe's test keys by default. No additional configuration is needed for basic testing.

**Optional:** To use your own test keys, add them to `.env.local`:

```bash
# Stripe Test Keys (optional for local dev)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
```

### 3. Test Card Numbers

Use these test card numbers for development:

- **Successful Payment:** 4242 4242 4242 4242
- **Declined Payment:** 4000 0000 0000 0002
- **Authentication Required:** 4000 0000 0000 3220
- **Insufficient Funds:** 4000 0000 0000 9995

Use any future expiry date and any 3-digit CVC.

### 4. Local Testing

1. Start the development server: `task dev`
2. Navigate to checkout and select "Card" payment method
3. Fill in shipping information
4. Use test card number 4242 4242 4242 4242
5. Complete the test payment

## Production Setup

### 1. Create Stripe Account

1. Visit [stripe.com](https://stripe.com) and create an account
2. Complete account verification process
3. Navigate to Dashboard → Developers → API keys

### 2. Environment Variables

Add your production Stripe keys to your deployment platform:

```bash
# Production Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
```

**Security Note:** Never commit real secret keys to version control.

### 3. Deploy Supabase Edge Function

The app includes a Supabase Edge Function for secure payment intent creation:

```bash
# Deploy the payment intent function
supabase functions deploy create-payment-intent --project-ref your-project-ref

# Set the Stripe secret key as a function secret
supabase secrets set STRIPE_SECRET_KEY=sk_live_your_secret_key --project-ref your-project-ref
```

### 4. Update Production URLs

Ensure your production app calls the correct Supabase function URL:
- Local: `http://localhost:54321/functions/v1/create-payment-intent`
- Production: `https://your-project-ref.supabase.co/functions/v1/create-payment-intent`

### 5. Webhook Configuration (Optional)

For advanced payment tracking, configure Stripe webhooks:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe-webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Add webhook signing secret to environment variables

## Implementation Details

### Architecture

1. **Frontend:** Stripe Elements provide secure card input
2. **Backend:** Supabase Edge Function creates payment intents
3. **Database:** Payment details stored with order records
4. **Security:** PCI compliance through Stripe's secure infrastructure

### Payment Flow

1. User fills shipping information
2. Selects card payment method
3. Stripe Elements loads securely
4. User enters card details (never sent to our servers)
5. Payment intent created via backend function
6. Stripe processes payment securely
7. Success/failure communicated to frontend
8. Order created with payment reference

### Error Handling

The implementation includes comprehensive error handling:
- Network failures
- Invalid card details
- Insufficient funds
- Authentication requirements
- Server errors

### Testing in Development

- Uses mock payment intents for offline development
- Provides test card numbers for real Stripe testing
- Shows helpful development mode indicators
- Simulates processing delays realistically

## Troubleshooting

### Common Issues

1. **"Stripe not configured"** - Check environment variables
2. **Payment intent creation fails** - Verify backend function deployment
3. **Card element not loading** - Check publishable key validity
4. **Network errors** - Ensure proper CORS configuration

### Debug Mode

Set development environment variables to enable debug logging:

```bash
VITE_DEBUG_PAYMENTS=true
```

### Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For application-specific issues, check the browser console for detailed error messages.
