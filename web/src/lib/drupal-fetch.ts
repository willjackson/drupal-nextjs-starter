/**
 * Test Drupal connection and return diagnostic information
 */
export async function testDrupalConnection() {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 
                 process.env.DRUPAL_INTERNAL_URL;
  
  // Try multiple endpoints to test connection
  const testEndpoints = [
    '/jsonapi/node/article',
    '/jsonapi/node/page', 
    '/system/menu/nextjs/linkset',
    '/node/1?_format=json',
    '/'
  ];
  
  for (const endpoint of testEndpoints) {
    try {
      const response = await drupalFetch(endpoint);
      const data = await response.json();
      
      return {
        success: true,
        url: baseUrl,
        endpoint,
        data,
        suggestions: []
      };
    } catch (error) {
      // Continue to next endpoint
      continue;
    }
  }
  
  // If all endpoints fail
  const suggestions = [
    'Check if Drupal is running (docker ps, ddev status, or lando list)',
    'Verify DRUPAL_INTERNAL_URL in your .env.local file',
    'Ensure Drupal JSON:API module is enabled',
    'Check if the URL is accessible from your NextJS app'
  ];
  
  return {
    success: false,
    url: baseUrl,
    error: 'All test endpoints failed',
    suggestions
  };
}

/**
 * Custom fetch wrapper for Drupal API calls with better error handling
 * Automatically determines headers based on endpoint type
 */
export async function drupalFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 
                 process.env.DRUPAL_INTERNAL_URL || 
                 'http://drupal.d11-nextjs-starter.dev.kanopi.cloud';
  
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

  // Determine headers based on endpoint type
  const isJsonApiEndpoint = path.includes('/jsonapi/');
  const isDecoupledMenuEndpoint = path.includes('/system/menu/');
  
  let defaultHeaders: Record<string, string>;
  
  if (isJsonApiEndpoint) {
    // JSON:API specific headers
    defaultHeaders = {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'User-Agent': 'NextJS Drupal Client',
    };
  } else if (isDecoupledMenuEndpoint) {
    // Decoupled Menus linkset endpoint headers
    defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'NextJS Drupal Client',
    };
  } else {
    // Generic JSON endpoint headers
    defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'NextJS Drupal Client',
    };
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
    // Add timeout and other settings for server-side requests
    ...(typeof window === 'undefined' && {
      // Server-side specific options
      signal: AbortSignal.timeout(10000), // 10 second timeout
    }),
  };

  try {

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('drupalFetch: Error response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        errorText: errorText.slice(0, 200) // Limit error text length
      });
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    // Use different log levels based on the endpoint
    const isOptionalContent = path.includes('menu_link_content') || 
                             path.includes('node/page') || 
                             path.includes('/system/menu/');
    
    if (isOptionalContent) {
      console.warn('drupalFetch: Optional content request failed:', {
        url,
        error: error.message,
      });
    } else {
      console.error('drupalFetch: Request failed:', {
        url,
        error: error.message,
        stack: error.stack,
      });
    }
    
    // Re-throw with more context
    throw new Error(`Failed to fetch from Drupal: ${error.message}`);
  }
}
