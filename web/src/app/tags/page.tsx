import { getAllArticlesFromDrupal, getAllEventsFromDrupal } from '@/lib/drupal';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Tags - Will\'s Tech Blog',
  description: 'Browse content by tags - discover posts and events organized by topics.',
};

interface TagCount {
  [key: string]: {
    count: number;
    types: Set<string>;
  };
}

export default async function TagsPage() {
  const articles = await getAllArticlesFromDrupal();
  const events = await getAllEventsFromDrupal();

  // Collect all tags and their counts
  const tagCounts: TagCount = {};

  // Add article tags
  articles.forEach(article => {
    article.tags?.forEach(tag => {
      const tagName = typeof tag === 'string' ? tag : tag.name;
      if (!tagCounts[tagName]) {
        tagCounts[tagName] = { count: 0, types: new Set() };
      }
      tagCounts[tagName].count++;
      tagCounts[tagName].types.add('articles');
    });
  });

  // Sort tags by count (descending) then alphabetically
  const sortedTags = Object.entries(tagCounts)
    .sort(([a, dataA], [b, dataB]) => {
      if (dataB.count !== dataA.count) {
        return dataB.count - dataA.count;
      }
      return a.localeCompare(b);
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-foreground">All Tags</h1>
        <p className="text-muted mb-8">
          Browse content by tags. Click any tag to see all related content.
        </p>

        <div className="grid gap-3">
          {sortedTags.map(([tag, data]) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
              className="group flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-lg group-hover:text-primary transition-colors text-foreground">
                  {tag}
                </span>
                <div className="flex gap-1">
                  {Array.from(data.types).map(type => (
                    <span
                      key={type}
                      className="text-xs px-2 py-1 bg-muted/50 text-muted rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-muted bg-muted/30 px-3 py-1 rounded-full">
                {data.count} {data.count === 1 ? 'item' : 'items'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}