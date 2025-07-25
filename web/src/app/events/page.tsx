import Link from 'next/link';
import { getAllEventsFromDrupal, Event } from '@/lib/drupal';
import { formatDate } from '@/utils/date';

export const metadata = {
  title: 'All Events',
  description: 'Browse upcoming and past events',
};

// Helper function to format location object into readable string
function formatLocation(location: any): string {
  if (!location) return 'Location TBD';

  // Handle string locations (fallback)
  if (typeof location === 'string') return location;

  // Handle object locations
  const parts: string[] = [];

  if (location.locality) parts.push(location.locality);
  if (location.administrative_area) parts.push(location.administrative_area);
  if (location.country_code) parts.push(location.country_code);

  return parts.length > 0 ? parts.join(', ') : 'Location TBD';
}

export default async function EventsPage() {
  // Fetch events from Drupal
  const events = await getAllEventsFromDrupal();

  const upcomingEvents = events.filter(event => !event.isPast);
  const pastEvents = events.filter(event => event.isPast);

  return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 robot-text">Events</h1>
            <p className="text-xl text-muted">
              Join me at conferences, meetups, and other events.
            </p>
          </header>

          {/* Upcoming Events */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 robot-text">Upcoming Events</h2>
            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} type="upcoming" />
              ))}
              {upcomingEvents.length === 0 && (
                  <p className="text-muted robot-text">No upcoming events scheduled at the moment.</p>
              )}
            </div>
          </section>

          {/* Past Events */}
          <section>
            <h2 className="text-3xl font-bold mb-6 robot-text">Past Events</h2>
            <div className="space-y-6">
              {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} type="past" />
              ))}
              {pastEvents.length === 0 && (
                  <p className="text-muted robot-text">No past events yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
  );
}

function EventCard({ event, type }: { event: Event; type: 'upcoming' | 'past' }) {
  return (
      <article className={`space-card overflow-hidden border-l-4 relative ${
          type === 'upcoming' ? 'border-l-accent' : 'border-l-muted'
      }`}>
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
        <div className="relative z-10 p-6" style={event.heroImage ? { backgroundColor: 'var(--card-list-overlay, rgba(255, 255, 255, 0.85))' } : {}}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">
                <Link
                    href={event.path}
                    className="hover:text-accent transition-colors"
                >
                  {event.title}
                </Link>
              </h3>
              <div className="space-y-1 text-muted robot-text text-sm">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(event.date)}
                </p>
                <p className="flex items-center">
                  {event.isVirtual ? (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                  ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                  )}
                  {formatLocation(event.location)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2 ml-4">
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full robot-text ${
                type === 'upcoming'
                    ? 'bg-accent text-white dark:text-card'
                    : 'bg-gray-600 dark:bg-muted text-white dark:text-card'
            }`}>
              {type === 'upcoming' ? 'Upcoming' : 'Past'}
            </span>
              {event.isVirtual && (
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-500 dark:bg-blue-600 text-white robot-text">
                Virtual
              </span>
              )}
              {event.videoUrl && (
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-red-500 dark:bg-red-600 text-white robot-text">
                Video
              </span>
              )}
            </div>
          </div>
          <Link
              href={event.path}
              className="inline-block mt-4 text-primary hover:text-accent transition-colors robot-text text-sm"
          >
            View details →
          </Link>
        </div>
      </article>
  );
}
