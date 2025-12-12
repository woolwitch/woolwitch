const { createClient } = require('@supabase/supabase-js');

// In-memory cache for this function instance
const cache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const LIST_TTL = 2 * 60 * 1000; // 2 minutes for product lists

// Initialize Supabase client
let supabase = null;
function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    supabase = createClient(supabaseUrl, supabaseKey, {
      db: { schema: 'woolwitch' }
    });
  }
  return supabase;
}

// Cache helpers
function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.timestamp + entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data, ttl = DEFAULT_TTL) {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

// Data fetching functions
async function getProducts(options = {}) {
  const { category, search, limit = 50, offset = 0 } = options;
  const cacheKey = `products_${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const supabase = getSupabase();
    let query = supabase
      .from('products')
      .select('id, name, price, image_url, category, stock_quantity, delivery_charge, is_available')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%, category.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    const products = data || [];
    setCache(cacheKey, products, LIST_TTL);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

async function getCategories() {
  const cacheKey = 'categories';
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('is_available', true);

    if (error) throw error;

    const categories = [...new Set(data?.map(item => item.category) || [])];
    setCache(cacheKey, categories, DEFAULT_TTL);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  // Only handle GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const action = event.queryStringParameters?.action || 'products';

    if (action === 'health') {
      // Health check with environment status
      const hasUrl = !!process.env.VITE_SUPABASE_URL;
      const hasKey = !!process.env.VITE_SUPABASE_ANON_KEY;
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          status: 'ok',
          timestamp: new Date().toISOString(),
          environment: {
            supabase_configured: hasUrl && hasKey,
            has_url: hasUrl,
            has_key: hasKey
          }
        })
      };
    }

    let responseData;

    if (action === 'categories') {
      responseData = await getCategories();
    } else if (action === 'products') {
      const category = event.queryStringParameters?.category;
      const search = event.queryStringParameters?.search;
      const limit = event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit) : undefined;
      const offset = event.queryStringParameters?.offset ? parseInt(event.queryStringParameters.offset) : undefined;
      
      responseData = await getProducts({ category, search, limit, offset });
    } else {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid action parameter. Use: products, categories, or health' 
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
      body: JSON.stringify({
        success: true,
        data: responseData,
        cached: Date.now(),
        count: Array.isArray(responseData) ? responseData.length : null
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};