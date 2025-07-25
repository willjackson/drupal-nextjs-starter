// Example: Add popular tags to navigation or sidebar
import { getAllPosts } from '@/lib/markdown';
import { TagList } from '@/components/Tag';

export function PopularTags({ limit = 10 }) {
  const posts = getAllPosts();
  
  // Count tag frequency
  const tagCounts = posts.reduce((acc, post) => {
    post.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  // Get most popular tags
  const popularTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([tag]) => tag);
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Popular Tags</h3>
      <TagList tags={popularTags} variant="pill" />
    </div>
  );
}

// Example: Add to main navigation
export function MainNav() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">Home</Link>
            <Link href="/posts">Posts</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/tags">Tags</Link>  {/* Add tags link */}
          </div>
        </div>
      </div>
    </nav>
  );
}