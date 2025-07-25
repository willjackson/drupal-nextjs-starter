import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventFromDrupal, getAllEventsFromDrupal } from '@/lib/drupal';
import { formatDistanceToNow, format } from 'date-fns';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import '@/styles/drupal-content.css';

interface EventPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEventFromDrupal(params.slug);

  if (!event) {
    notFound();
  }

  // Helper function to format location object
  const formatLocation = (location: any) => {
    if (typeof location === 'string') {
      return location;
    }
    if (typeof location === 'object' && location) {
      const parts = [];
      if (location.locality) parts.push(location.locality);
      if (location.administrative_area) parts.push(location.administrative_area);
      if (location.country_code) parts.push(location.country_code);
      return parts.join(', ') || 'Location TBD';
    }
    return 'Location TBD';
  };

  // Ensure consistent date comparison
  const eventDate = new Date(event.date + 'T00:00:00Z');
  const today = new Date(new Date().toISOString().split('T')[0] + 'T00:00:00Z');
  const isPastEvent = event.isPast || eventDate < today;

  return (
    <div className="min-h-screen">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/events"
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
            Back to Events
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold robot-text mb-6">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted robot-text mb-6">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={event.date}>
                {format(new Date(event.date), 'MMMM d, yyyy')}
              </time>
            </div>
            <span>•</span>
            <div className="flex items-center">
              {event.isVirtual ? (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              <span>{formatLocation(event.location)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <span
              className={`px-3 py-1 rounded-md text-sm robot-text ${
                isPastEvent 
                  ? 'bg-gray-100 text-gray-800 border border-gray-300' 
                  : 'bg-green-100 text-green-800 border border-green-300'
              }`}
            >
              {isPastEvent ? 'Past Event' : 'Upcoming Event'}
            </span>
            
            {event.isVirtual && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-md text-sm robot-text">
                Virtual Event
              </span>
            )}
          </div>
        </header>

        {/* Hero Image */}
        {event.heroImage ? (
          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden shadow-glow">
            <Image
              src={event.heroImage.url}
              alt={event.heroImage.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        ) : event.image ? (
          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden shadow-glow">
            <Image
              src={event.image.url}
              alt={event.image.alt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        ) : (
          <div className="relative aspect-video mb-8 rounded-xl overflow-hidden shadow-glow">
            <ImageWithFallback
              src={undefined}
              alt={event.title}
              className="w-full h-full object-cover"
              fallbackSeed={parseInt(event.id.replace(/\D/g, '') || '1') + 30}
              width={1200}
              height={600}
            />
          </div>
        )}

        {/* Video Embed */}
        {event.videoEmbedUrl && (
          <div className="mb-12">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-glow">
              <iframe
                src={event.videoEmbedUrl}
                className="w-full h-full"
                allowFullScreen
                title={`${event.title} - Video`}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="space-card p-8 lg:p-12">
          {event.body && (
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
              dangerouslySetInnerHTML={{ __html: event.body || '' }}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex justify-between items-center">
            <Link
              href="/events"
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
              All Events
            </Link>
            
            <div className="text-sm text-muted robot-text">
              Event date: {format(new Date(event.date), 'MMMM d, yyyy')}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const events = await getAllEventsFromDrupal();
    return events.map((event) => ({
      slug: event.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for events:', error);
    return [];
  }
}

export async function generateMetadata({ params }: EventPageProps) {
  const event = await getEventFromDrupal(params.slug);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  // Helper function to format location for metadata
  const formatLocationForMeta = (location: any) => {
    if (typeof location === 'string') {
      return location;
    }
    if (typeof location === 'object' && location) {
      const parts = [];
      if (location.locality) parts.push(location.locality);
      if (location.administrative_area) parts.push(location.administrative_area);
      if (location.country_code) parts.push(location.country_code);
      return parts.join(', ') || 'Location TBD';
    }
    return 'Location TBD';
  };

  return {
    title: `${event.title} | Will Hetherington`,
    description: `${event.title} - ${formatLocationForMeta(event.location)}`,
    openGraph: {
      title: event.title,
      description: `${event.title} - ${formatLocationForMeta(event.location)}`,
      images: event.heroImage ? [
        {
          url: event.heroImage.url,
          width: event.heroImage.width,
          height: event.heroImage.height,
          alt: event.heroImage.alt,
        }
      ] : event.image ? [
        {
          url: event.image.url,
          width: event.image.width,
          height: event.image.height,
          alt: event.image.alt,
        }
      ] : [],
    },
  };
}
