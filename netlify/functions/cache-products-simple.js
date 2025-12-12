exports.handler = async (event, context) => {
  console.log('Cache function called');
  
  // Simple health check without any external dependencies
  if (event.queryStringParameters && event.queryStringParameters.action === 'health') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        env_check: {
          has_supabase_url: !!process.env.VITE_SUPABASE_URL,
          has_supabase_key: !!process.env.VITE_SUPABASE_ANON_KEY
        }
      })
    };
  }

  // For now, return mock data for products
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ 
      success: true,
      data: [
        { id: '1', name: 'Mock Product', price: 10, category: 'Test' }
      ],
      message: 'Mock response - Supabase integration pending'
    })
  };
};