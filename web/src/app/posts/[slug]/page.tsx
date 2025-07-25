import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleFromDrupal, getAllArticlesFromDrupal } from '@/lib/drupal';
import { formatDistanceToNow, format } from 'date-fns';
import '@/styles/drupal-content.css';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: PostPageProps) {
  const post = await getArticleFromDrupal(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-6">
            <Link
              href="/posts"
              className="inline-flex items-center text-primary hover:text-accent text-sm font-medium robot-text transition-colors"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Posts
            </Link>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold robot-text mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted robot-text mb-6">
            <time dateTime={post.createdDate}>
              {format(new Date(post.createdDate), 'MMMM d, yyyy')}
            </time>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(post.createdDate), { addSuffix: true })}
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags
                .filter((tag, index, self) => 
                  index === self.findIndex(t => t.id === tag.id)
                )
                .map((tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-card border border-border rounded-md text-sm robot-text"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {post.excerpt && (
            <div className="text-lg text-muted leading-relaxed mb-8 p-6 space-card border-l-4 border-primary">
              {post.excerpt}
            </div>
          )}
        </header>

        {/* Hero Image */}
        {post.heroImage && (
          <div className="relative aspect-video mb-12 rounded-xl overflow-hidden shadow-glow">
            <Image
              src={post.heroImage.url}
              alt={post.heroImage.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}

        {/* Content */}
        <div className="space-card p-8 lg:p-12">
          <div 
            className="drupal-content prose prose-lg max-w-none
              prose-headings:text-foreground prose-headings:font-bold prose-headings:robot-text
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
              prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4
              prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-foreground prose-strong:font-semibold
              prose-em:text-foreground prose-em:italic
              prose-a:text-primary prose-a:underline hover:prose-a:text-accent
              prose-ul:text-foreground prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
              prose-ol:text-foreground prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
              prose-li:text-foreground prose-li:mb-1
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted
              prose-code:text-accent prose-code:bg-card prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-card prose-pre:text-foreground prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border prose-pre:border-border
              prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
              prose-table:border-collapse prose-table:border prose-table:border-border prose-table:w-full
              prose-th:border prose-th:border-border prose-th:bg-card prose-th:p-3 prose-th:text-left prose-th:font-semibold
              prose-td:border prose-td:border-border prose-td:p-3
              prose-hr:border-border prose-hr:my-8"
            dangerouslySetInnerHTML={{ __html: post.body || '' }}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex justify-between items-center">
            <Link
              href="/posts"
              className="inline-flex items-center px-4 py-2 border border-border rounded-md text-sm font-medium bg-card hover:bg-accent/10 transition-colors robot-text"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              All Posts
            </Link>
            
            <div className="text-sm text-muted robot-text">
              Last updated {formatDistanceToNow(new Date(post.modifiedDate), { addSuffix: true })}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const posts = await getAllArticlesFromDrupal();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await getArticleFromDrupal(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Will Hetherington`,
    description: post.excerpt || 'Blog post by Will Hetherington',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.heroImage ? [
        {
          url: post.heroImage.url,
          width: post.heroImage.width,
          height: post.heroImage.height,
          alt: post.heroImage.alt,
        }
      ] : [],
    },
  };
}
