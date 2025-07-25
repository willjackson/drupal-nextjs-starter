import Link from 'next/link';
import { getAllEventsFromDrupal, getAllArticlesFromDrupal, getStickyArticlesFromDrupal } from '@/lib/drupal';
import { config } from '@/lib/config';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { formatDate } from '@/utils/date';
import { TagList } from '@/components/TagList';
import { DrupalDataFallback } from '@/components/DrupalErrorBoundary';

// Helper function to format location object into readable string
function formatLocation(location: any): string {
  if (!location) return 'Location TBD';
  if (typeof location === 'string') return location;
  
  const parts: string[] = [];
  if (location.locality) parts.push(location.locality);
  if (location.administrative_area) parts.push(location.administrative_area);
  if (location.country_code) parts.push(location.country_code);
  
  return parts.length > 0 ? parts.join(', ') : 'Location TBD';
}

// Safe wrapper for Drupal API calls
async function safeDrupalCall<T>(fn: () => Promise<T>, fallback: T, name: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`Error fetching ${name} from Drupal:`, error);
    return fallback;
  }
}

export default async function Home() {
  // Use safe wrappers for all Drupal calls to prevent page crashes
  const allDrupalArticles = await safeDrupalCall(
    () => getAllArticlesFromDrupal(),
    [],
    'articles'
  );
  
  const stickyArticles = await safeDrupalCall(
    () => getStickyArticlesFromDrupal(),
    [],
    'sticky articles'
  );
  
  const drupalEvents = await safeDrupalCall(
    () => getAllEventsFromDrupal(),
    [],
    'events'
  );

  // Process the data
  const events = drupalEvents.slice(0, 3);
  
  // Use sticky article as featured, fallback to first article
  const featuredArticle = stickyArticles[0] || allDrupalArticles[0];
  const latestArticles = allDrupalArticles.slice(0, 3);
  const moreArticles = allDrupalArticles.slice(3, 6);

  // Use the config hero image with a fallback
  const heroImageUrl = config?.site?.heroImage || "https://picsum.photos/id/10/1920/800";

  // Check if we have any Drupal data to show connectivity status
  const hasDrupalData = allDrupalArticles.length > 0 || drupalEvents.length > 0;

  return (
    <div className="min-h-screen">
      {/* Show connectivity warning if no Drupal data */}
      {!hasDrupalData && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-destructive">
                <strong>Drupal Connection Issue:</strong> Unable to load content from Drupal. 
                <Link href="/debug" className="underline ml-1">View debug information</Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full-page Hero Section */}
      <div className="relative w-full h-screen -mt-16">
        <ImageWithFallback
          src={heroImageUrl}
          alt={config.site.name}
          className="absolute inset-0 w-full h-full object-cover animate-fade-in"
          fallbackSeed={10}
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 robot-text animate-fade-in">
                {config.site.name}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 animate-fade-in-delay px-4">
                {config.site.description}
              </p>
              <div className="flex justify-center gap-8 md:gap-16 animate-fade-in-delay-2">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary robot-text">{allDrupalArticles.length}</div>
                  <div className="text-sm md:text-base text-gray-300 robot-text">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary robot-text">{drupalEvents.length}</div>
                  <div className="text-sm md:text-base text-gray-300 robot-text">Events</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* About Section */}
        <section className="mb-12 md:mb-16 text-center">
          <div className="space-card p-6 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 robot-text">About This Starter</h2>
            <p className="text-base md:text-lg text-muted leading-relaxed mb-4 md:mb-6">
              This is a production-ready starter kit that demonstrates the seamless integration between Drupal 11 and NextJS 14+. 
              Built with modern best practices, it provides a solid foundation for headless CMS applications with features like 
              dynamic menu integration, content management, and responsive design.
            </p>
            <p className="text-base md:text-lg text-muted leading-relaxed">
              The stack includes TypeScript, Tailwind CSS, JSON:API integration, and automated deployment workflows. 
              Perfect for developers looking to build scalable, performant web applications with a decoupled architecture 
              that leverages Drupal's content management capabilities with NextJS's modern frontend framework.
            </p>
          </div>
        </section>

        {/* Featured Post Section */}
        <section className="mb-12 md:mb-20">
          <h2 className="text-2xl md:text-3xl font-bold robot-text mb-6 md:mb-8">Featured Post</h2>
          {featuredArticle ? (
            <article className="grid md:grid-cols-2 gap-6 md:gap-8 space-card p-6 md:p-8">
              <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={featuredArticle.heroImage?.url || (typeof featuredArticle.heroImage === 'string' ? featuredArticle.heroImage : undefined)}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  fallbackSeed={21}
                  width={800}
                  height={600}
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl md:text-2xl font-semibold mb-3">
                  <Link href={featuredArticle.path || `/posts/${featuredArticle.slug}`} className="hover:text-accent transition-colors">
                    {featuredArticle.title}
                  </Link>
                </h3>
                <time className="text-muted text-sm robot-text mb-4">
                  {formatDate(featuredArticle.createdDate || featuredArticle.date)}
                </time>
                {featuredArticle.tags && (
                  <TagList tags={featuredArticle.tags} className="mb-4" />
                )}
                {featuredArticle.excerpt && (
                  <p className="text-muted mb-4">{featuredArticle.excerpt}</p>
                )}
                <Link 
                  href={featuredArticle.path || `/posts/${featuredArticle.slug}`} 
                  className="inline-flex items-center text-primary hover:text-accent transition-colors robot-text"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ) : (
            <DrupalDataFallback title="Featured Article" />
          )}
        </section>



        {/* Recent Posts Grid */}
        <section className="mb-12 md:mb-20">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold robot-text">Latest Posts</h2>
            <Link href="/posts" className="text-primary hover:text-accent transition-colors robot-text text-sm">
              View all posts →
            </Link>
          </div>
          {latestArticles.length === 0 ? (
            <DrupalDataFallback title="Latest Posts" />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((post, index) => (
                <article key={post.slug} className="space-card overflow-hidden hover:shadow-glow transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={post.heroImage?.url || (typeof post.heroImage === 'string' ? post.heroImage : undefined)}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      fallbackSeed={index + 22}
                      width={600}
                      height={400}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link href={post.path || `/posts/${post.slug}`} className="hover:text-accent transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <time className="text-muted text-sm robot-text">
                      {formatDate(post.createdDate || post.date)}
                    </time>
                    {post.tags && (
                      <TagList tags={post.tags} className="mt-2" />
                    )}
                    {post.excerpt && (
                      <p className="mt-3 text-muted text-sm line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>



        {/* Events & More Posts */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 lg:items-start">
          {/* Events */}
          <section className="lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold robot-text">Events</h2>
              <Link href="/events" className="text-primary hover:text-accent transition-colors robot-text text-sm">
                View all →
              </Link>
            </div>
            {events.length === 0 ? (
              <DrupalDataFallback title="Events" showRetry={false} />
            ) : (
              <div className="space-y-4 flex flex-col">
                {events.map((event) => (
                  <article key={event.slug} className="space-card hover:shadow-glow transition-all relative overflow-hidden flex-1">
                    {/* Background Hero Image */}
                    {event.heroImage && (
                      <div className="absolute inset-0 z-0">
                        <img
                          src={event.heroImage.url}
                          alt={event.heroImage.alt}
                          className="w-full h-full object-cover object-top blur-sm"
                        />
                        <div className="absolute inset-0" style={{ background: 'var(--hero-gradient)' }}></div>
                      </div>
                    )}
                    
                    {/* Content with overlay */}
                    <div className="relative z-10 p-6 h-full flex flex-col" style={event.heroImage ? { backgroundColor: 'var(--card-list-overlay, rgba(255, 255, 255, 0.85))' } : {}}>
                      <h3 className="font-semibold mb-3 text-lg flex-grow">
                        <Link href={event.path} className="hover:text-accent transition-colors">
                          {event.title}
                        </Link>
                      </h3>
                      <div className="space-y-2 text-sm text-muted robot-text mt-auto">
                        <p className="flex items-center">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(event.date)}
                        </p>
                        <p className="flex items-center">
                          {event.isVirtual ? (
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          {formatLocation(event.location)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* More Recent Posts */}
          <section className="lg:col-span-2">
            <h2 className="text-xl md:text-2xl font-bold robot-text mb-6">More Posts</h2>
            {moreArticles.length === 0 ? (
              <DrupalDataFallback title="More Posts" showRetry={false} />
            ) : (
              <div className="space-y-4 flex flex-col h-full">
                {moreArticles.map((post) => (
                  <article key={post.slug} className="space-card p-4 md:p-6 hover:shadow-glow transition-all flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1">
                    {post.heroImage && (
                      <div className="flex-shrink-0 w-full sm:w-32 h-32 sm:h-24 rounded overflow-hidden">
                        <ImageWithFallback
                          src={post.heroImage?.url || (typeof post.heroImage === 'string' ? post.heroImage : undefined)}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          fallbackSeed={parseInt(post.slug.replace(/\D/g, '') || '1') + 30}
                          width={200}
                          height={150}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold mb-1">
                        <Link href={`/posts/${post.slug}`} className="hover:text-accent transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <time className="text-muted text-sm robot-text">
                        {formatDate(post.createdDate)}
                      </time>
                      <TagList tags={post.tags} className="mt-2" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
