// Debug script to check product IDs and order creation
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://localhost:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  { db: { schema: 'woolwitch' } }
);

console.log('🔍 Debugging product IDs and order creation...');

try {
  // Check products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*');
  
  if (productsError) {
    console.error('❌ Error fetching products:', productsError);
    process.exit(1);
  }
  
  console.log('✅ Products found:', products.length);
  products.forEach(product => {
    console.log(`   - ${product.name} (ID: ${product.id})`);
  });

  // Test creating a simple order with the first product
  if (products.length > 0) {
    const testProduct = products[0];
    
    console.log(`\n🧪 Testing order creation with product: ${testProduct.name}`);
    
    // Create test order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        email: 'test@example.com',
        full_name: 'Test User',
        address: {
          address: 'Test Address',
          city: 'Test City', 
          postcode: 'TEST 123'
        },
        total: testProduct.price,
        subtotal: testProduct.price,
        delivery_total: 0,
        status: 'pending',
        payment_method: 'card'
      })
      .select()
      .single();
    
    if (orderError) {
      console.error('❌ Error creating order:', orderError);
      process.exit(1);
    }
    
    console.log('✅ Order created successfully:', order.id);
    
    // Create test order item
    const { data: orderItem, error: itemError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: testProduct.id,
        product_name: testProduct.name,
        product_price: testProduct.price,
        quantity: 1,
        delivery_charge: testProduct.delivery_charge || 0
      })
      .select()
      .single();
    
    if (itemError) {
      console.error('❌ Error creating order item:', itemError);
      console.error('   Order ID:', order.id);
      console.error('   Product ID:', testProduct.id);
      
      // Clean up the order
      await supabase.from('orders').delete().eq('id', order.id);
      process.exit(1);
    }
    
    console.log('✅ Order item created successfully:', orderItem.id);
    
    // Clean up
    await supabase.from('orders').delete().eq('id', order.id);
    console.log('🧹 Test data cleaned up');
  }

  console.log('\n🎉 All tests passed - product IDs are valid!');

} catch (error) {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
}