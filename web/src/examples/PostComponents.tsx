// Example: Update your blog post cards to use clickable tags
import Link from 'next/link';
import { TagList } from '@/components/Tag';
import { formatDate } from '@/utils/date';

export function PostCard({ post }) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <Link href={`/posts/${post.slug}`} className="block">
        <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
          {post.title}
        </h2>
      </Link>
      
      {post.excerpt && (
        <p className="text-gray-600 mb-3">{post.excerpt}</p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <time>{formatDate(post.date)}</time>
        
        {post.tags && post.tags.length > 0 && (
          <TagList 
            tags={post.tags} 
            maxTags={3} 
            variant="default"
            className="ml-4"
          />
        )}
      </div>
    </article>
  );
}

// Example: Post detail page with prominent tags
export function PostDetail({ post }) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <time className="text-gray-600">{formatDate(post.date)}</time>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">Tagged:</span>
              <TagList tags={post.tags} variant="pill" />
            </div>
          )}
        </div>
        
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
        )}
      </header>
      
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.htmlContent }}
      />
      
      {/* Related tags section at bottom */}
      {post.tags && post.tags.length > 0 && (
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
          <TagList tags={post.tags} variant="large" />
        </footer>
      )}
    </article>
  );
}