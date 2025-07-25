import { notFound } from 'next/navigation';
import { getPageFromDrupal, getAllPagesFromDrupal } from '@/lib/drupal';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import '@/styles/drupal-content.css';

interface PageProps {
  params: {
    slug: string[];
  };
}

export const dynamic = 'force-dynamic';

export default async function DynamicPage({ params }: PageProps) {
  // Reconstruct the full path from slug segments
  const fullPath = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const page = await getPageFromDrupal(fullPath);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold robot-text mb-6">
            {page.title}
          </h1>
        </header>

        {/* Hero Image */}
        {page.heroImage && (
          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden shadow-glow">
            <ImageWithFallback
              src={page.heroImage.url}
              alt={page.heroImage.alt}
              className="w-full h-full object-cover"
              width={1200}
              height={600}
              fill
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="space-card p-8 lg:p-12">
          {page.body && (
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
              dangerouslySetInnerHTML={{ __html: page.body }}
            />
          )}
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const pages = await getAllPagesFromDrupal();
    return pages.map((page) => {
      // Handle multi-level paths by splitting on '/' and removing empty segments
      const pathSegments = page.path.split('/').filter(segment => segment !== '');
      return {
        slug: pathSegments,
      };
    });
  } catch (error) {
    console.error('Error generating static params for pages:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const fullPath = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const page = await getPageFromDrupal(fullPath);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `${page.title} | Drupal+NextJS Starter`,
    description: page.body?.replace(/<[^>]*>/g, '').substring(0, 160) || page.title,
    openGraph: {
      title: page.title,
      description: page.body?.replace(/<[^>]*>/g, '').substring(0, 160) || page.title,
      images: page.heroImage ? [
        {
          url: page.heroImage.url,
          width: page.heroImage.width,
          height: page.heroImage.height,
          alt: page.heroImage.alt,
        }
      ] : [],
    },
  };
}
