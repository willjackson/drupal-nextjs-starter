import { notFound } from 'next/navigation';
import { drupalFetch } from '@/lib/drupal-fetch';
import { transformDrupalPage, DrupalPageNode } from '@/lib/drupal';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import '@/styles/drupal-content.css';

interface NodePageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function NodePage({ params }: NodePageProps) {
  const { id } = await params;
  let page;
  
  try {
    // Try UUID first, then fallback to numeric ID filter
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let response;
    if (isUUID) {
      response = await drupalFetch(`/jsonapi/node/page/${id}?include=field_image`);
    } else {
      // Use filter for numeric node ID
      response = await drupalFetch(`/jsonapi/node/page?filter[drupal_internal__nid]=${id}&include=field_image`);
    }
    
    const jsonData = await response.json();
    
    if (!jsonData.data || (Array.isArray(jsonData.data) && jsonData.data.length === 0)) {
      notFound();
    }
    
    // Handle both single item and array responses
    const nodeData = Array.isArray(jsonData.data) ? jsonData.data[0] : jsonData.data;
    page = transformDrupalPage(nodeData, jsonData.included);
  } catch (error) {
    console.error(`Error fetching node ${id}:`, error);
    notFound();
  }

  return (
    <div className="min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold robot-text mb-6">
            {page.title}
          </h1>
        </header>

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

export async function generateMetadata({ params }: NodePageProps) {
  try {
    const { id } = await params;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let response;
    if (isUUID) {
      response = await drupalFetch(`/jsonapi/node/page/${id}`);
    } else {
      response = await drupalFetch(`/jsonapi/node/page?filter[drupal_internal__nid]=${id}`);
    }
    
    const jsonData = await response.json();
    
    if (!jsonData.data || (Array.isArray(jsonData.data) && jsonData.data.length === 0)) {
      return { title: 'Page Not Found' };
    }
    
    const nodeData = Array.isArray(jsonData.data) ? jsonData.data[0] : jsonData.data;
    const page = transformDrupalPage(nodeData);
    
    return {
      title: `${page.title} | Will Hetherington`,
      description: page.body?.replace(/<[^>]*>/g, '').substring(0, 160) || page.title,
    };
  } catch (error) {
    return { title: 'Page Not Found' };
  }
}
