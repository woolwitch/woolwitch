# PayPal Integration Setup Guide

## Overview
Wool Witch now supports dual payment methods:
- **Card Payment** (existing mock system for testing)
- **PayPal Payment** (secure PayPal integration)

## PayPal Configuration

### 1. Get PayPal Sandbox Credentials
1. Visit [PayPal Developer Portal](https://developer.paypal.com/developer/applications/)
2. Create a sandbox application
3. Copy the **Client ID** from your sandbox app

### 2. Update Environment Variables
Add your PayPal credentials to `.env.local`:

```bash
# PayPal Configuration
VITE_PAYPAL_CLIENT_ID_SANDBOX=your_actual_sandbox_client_id
VITE_PAYPAL_CLIENT_ID_PRODUCTION=your_production_client_id
VITE_APP_ENV=development
```

### 3. Development Testing
- Use PayPal sandbox test accounts for testing
- Default test buyer: `buyer@example.com` / `test123456`
- All payments are in GBP currency
- Delivery charges are calculated per item

## Features Implemented

### ✅ Phase 1: Foundation
- [x] Database schema for orders, order items, and payments
- [x] PayPal SDK integration with TypeScript support
- [x] Order calculation utilities and database services
- [x] Environment configuration for sandbox/production

### ✅ Phase 2: Core Integration  
- [x] Payment method selector (Card vs PayPal)
- [x] PayPal button component with order creation
- [x] Updated checkout flow supporting both payment methods
- [x] Payment verification and order creation
- [x] Cart persistence with localStorage

### 🚧 Phase 3: Order Management (Next)
- [ ] User order history page
- [ ] Admin order management interface
- [ ] Order status tracking and updates
- [ ] Email notifications for order status

### 🚧 Phase 4: Testing & Polish (Next)
- [ ] Comprehensive PayPal sandbox testing
- [ ] Error handling improvements
- [ ] Mobile responsive design verification
- [ ] Production deployment preparation

## Database Schema

The PayPal integration adds three new tables:

```sql
-- Orders: Main customer order records
CREATE TABLE woolwitch.orders (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text NOT NULL,
  address jsonb NOT NULL,
  subtotal numeric(10, 2) NOT NULL,
  delivery_total numeric(10, 2) NOT NULL,
  total numeric(10, 2) NOT NULL,
  status text CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  payment_method text CHECK (payment_method IN ('card', 'paypal')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items: Individual products within orders
CREATE TABLE woolwitch.order_items (
  id uuid PRIMARY KEY,
  order_id uuid REFERENCES woolwitch.orders(id),
  product_id uuid REFERENCES woolwitch.products(id),
  product_name text NOT NULL,
  product_price numeric(10, 2) NOT NULL,
  quantity integer NOT NULL,
  delivery_charge numeric(10, 2) NOT NULL
);

-- Payments: Transaction audit trail
CREATE TABLE woolwitch.payments (
  id uuid PRIMARY KEY,
  order_id uuid REFERENCES woolwitch.orders(id),
  payment_method text CHECK (payment_method IN ('card', 'paypal')),
  payment_id text, -- PayPal transaction ID
  status text CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'GBP',
  paypal_details jsonb -- PayPal response data
);
```

## Usage

### Customer Experience
1. **Add items to cart** - Browse and select handmade products
2. **Proceed to checkout** - Enter shipping information
3. **Choose payment method** - Select Card or PayPal
4. **Complete payment** - Follow the selected payment flow
5. **Order confirmation** - Receive confirmation with order details

### Card Payment (Testing)
- Use card number: `4242 4242 4242 4242`
- Enter any future expiry date and CVC
- Order is created immediately

### PayPal Payment (Testing)
- Click PayPal button after filling shipping info
- Login to PayPal sandbox (buyer@example.com / test123456)
- Approve payment in PayPal window
- Return to site for order confirmation

## Development

### Start Development Environment
```bash
task dev          # Start Supabase + development server
task dev-only     # Start only dev server (DB must be running)
```

### Database Management
```bash
task db:reset     # Reset and apply migrations
task db:status    # Check database connection
```

### Testing
```bash
npm run test      # Run lint and typecheck
npm run typecheck # TypeScript validation only
```

## API Integration

### Order Creation
The `createOrder` function handles both card and PayPal payments:

```typescript
const orderData: CreateOrderData = {
  email: 'customer@example.com',
  fullName: 'John Doe',
  address: { address: '123 Main St', city: 'London', postcode: 'SW1A 1AA' },
  cartItems: [{ product, quantity: 2 }],
  paymentMethod: 'paypal',
  paymentId: 'PAYPAL_TRANSACTION_ID',
  paypalDetails: { /* PayPal response data */ }
};

const order = await createOrder(orderData);
```

### Order Retrieval
```typescript
// Get user's orders
const orders = await getUserOrders(limit);

// Get specific order
const order = await getOrderById(orderId);

// Admin: Get all orders with filters
const orders = await getAllOrders({
  status: 'pending',
  paymentMethod: 'paypal',
  limit: 50
});
```

## Security

- **Row Level Security** enabled on all order tables
- **Users can only access their own orders** (admin can access all)
- **PayPal payment verification** ensures order totals match payments
- **Environment-based configuration** for sandbox vs production
- **No sensitive data stored** - PayPal handles payment processing

## Troubleshooting

### PayPal Button Not Loading
1. Check browser console for PayPal SDK errors
2. Verify `VITE_PAYPAL_CLIENT_ID_SANDBOX` is set correctly
3. Ensure shipping information is filled before PayPal button appears

### Database Connection Issues
1. Run `task db:status` to check Supabase connection
2. Try `task db:reset` to refresh database
3. Check Docker is running for Supabase local development

### Type Errors
1. Run `npm run typecheck` to identify TypeScript issues
2. Regenerate types with `supabase gen types typescript --local`
3. Check database schema matches expected types

## Next Steps

1. **Set up real PayPal sandbox credentials** in `.env.local`
2. **Test complete checkout flow** with PayPal sandbox
3. **Implement order history pages** for users and admin
4. **Add email notifications** for order status changes
5. **Prepare production deployment** with live PayPal credentials
