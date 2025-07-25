import { getAllArticlesFromDrupal, getAllEventsFromDrupal } from '@/lib/drupal';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TagContent from '@/components/TagContent';

interface PageProps {
  params: {
    tag: string;
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `${tag} - Tags - Will's Tech Blog`,
    description: `Browse all content tagged with "${tag}" - posts and events.`,
  };
}

export async function generateStaticParams() {
  const articles = await getAllArticlesFromDrupal();
  
  const allTags = new Set<string>();
  
  articles.forEach(article => {
    article.tags?.forEach(tag => {
      const tagName = typeof tag === 'string' ? tag : tag.name;
      allTags.add(tagName.toLowerCase());
    });
  });
  
  return Array.from(allTags).map(tag => ({
    tag: tag,
  }));
}

export default async function TagPage({ params }: PageProps) {
  const tagParam = decodeURIComponent(params.tag);
  const articles = await getAllArticlesFromDrupal();
  const events = await getAllEventsFromDrupal();

  // Find content with this tag (case-insensitive)
  const taggedPosts = articles.filter(article => 
    article.tags?.some(tag => {
      const tagName = typeof tag === 'string' ? tag : tag.name;
      return tagName.toLowerCase() === tagParam.toLowerCase();
    })
  );
  
  const taggedEvents = events.filter(event => 
    (event as any).tags?.some((tag: any) => {
      const tagName = typeof tag === 'string' ? tag : tag.name;
      return tagName.toLowerCase() === tagParam.toLowerCase();
    })
  );

  // If no content found, return 404
  const totalItems = taggedPosts.length + taggedEvents.length;
  if (totalItems === 0) {
    notFound();
  }

  // Find the original case of the tag
  const originalTag = articles
    .flatMap(item => {
      const itemTags = item.tags || [];
      return itemTags.map(tag => typeof tag === 'string' ? tag : tag.name);
    })
    .find(tag => tag.toLowerCase() === tagParam.toLowerCase()) || tagParam;

  return (
    <TagContent
      taggedPosts={taggedPosts}
      taggedEvents={taggedEvents}
      originalTag={originalTag}
      totalItems={totalItems}
    />
  );
}