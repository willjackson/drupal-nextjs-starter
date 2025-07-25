import Link from 'next/link';
import Image from 'next/image';
import { getAllArticlesFromDrupal } from '@/lib/drupal';
import { formatDateShort } from '@/utils/date';
import { ImageWithFallback } from '@/components/ImageWithFallback';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  console.log('PostsPage component rendering...');
  console.log('Environment:', {
    NEXT_PUBLIC_DRUPAL_BASE_URL: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });
  
  let posts = [];
  let error = null;
  let debugInfo = {
    attempted: false,
    url: '',
    errorType: '',
    errorMessage: '',
  };

  try {
    debugInfo.attempted = true;
    debugInfo.url = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://drupal.d11-nextjs-starter.dev.kanopi.cloud'}/jsonapi/node/article`;
    
    posts = await getAllArticlesFromDrupal();
    console.log('Successfully fetched posts:', posts.length);
  } catch (err) {
    console.error('Error fetching posts:', err);
    error = err;
    debugInfo.errorType = err.constructor.name;
    debugInfo.errorMessage = err.message;
  }

  // If server-side fetch failed, show a client-side fetch option
  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Connection Issue Detected</h2>
            <p className="text-yellow-700 mb-4">
              Unable to connect to the Drupal backend from the Next.js server.
            </p>
            <details className="text-sm text-yellow-600">
              <summary className="cursor-pointer font-medium mb-2">Debug Information</summary>
              <pre className="bg-yellow-100 p-3 rounded mt-2 overflow-x-auto">
{JSON.stringify({
  drupalUrl: debugInfo.url,
  errorType: debugInfo.errorType,
  errorMessage: debugInfo.errorMessage,
  timestamp: new Date().toISOString(),
}, null, 2)}
              </pre>
            </details>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-2">Troubleshooting Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Verify Drupal is accessible at: <code className="bg-blue-100 px-2 py-1 rounded">{debugInfo.url}</code></li>
              <li>Check if JSON:API is enabled in Drupal</li>
              <li>Ensure CORS is configured if needed</li>
              <li>Try running: <code className="bg-blue-100 px-2 py-1 rounded">node diagnose-drupal.js</code> for detailed diagnostics</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
        <p className="text-gray-600 mb-8">
          Insights, tutorials, and thoughts on web development, Drupal, and technology.
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found.</p>
            <p className="text-sm text-gray-400 mt-2">Posts will appear here once they are created in Drupal.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Hero Image */}
                <div className="relative aspect-video">
                  {post.heroImage ? (
                    <Image
                      src={post.heroImage.url}
                      alt={post.heroImage.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                    />
                  ) : (
                    <ImageWithFallback
                      src={undefined}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      fallbackSeed={parseInt(post.id.replace(/\D/g, '') || '1') + 10}
                      width={800}
                      height={400}
                      fill
                    />
                  )}
                  
                  {/* Overlay for better text readability on mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <time className="text-sm text-gray-500">
                      {formatDateShort(post.createdDate)}
                    </time>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.tags
                          .filter((tag, index, self) => 
                            index === self.findIndex(t => t.id === tag.id)
                          )
                          .slice(0, 3)
                          .map((tag) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold mb-3">
                    <Link href={post.path} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h2>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  
                  <Link
                    href={post.path}
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                  >
                    Read more 
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: 'Blog Posts | Will Hetherington',
    description: 'Insights, tutorials, and thoughts on web development, Drupal, and technology.',
  };
}
