'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/utils/date';

interface TaggedContent {
  taggedPosts: any[];
  taggedEvents: any[];
}

type ContentType = 'posts' | 'events';

interface TagContentProps extends TaggedContent {
  originalTag: string;
  totalItems: number;
}

export default function TagContent({ 
  taggedPosts, 
  taggedEvents,
  originalTag,
  totalItems 
}: TagContentProps) {
  // Filter state
  const [activeFilters, setActiveFilters] = useState<ContentType[]>(['posts', 'events']);

  const toggleFilter = (type: ContentType) => {
    setActiveFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filterOptions = [
    { type: 'posts' as ContentType, label: 'Posts', count: taggedPosts.length, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { type: 'events' as ContentType, label: 'Events', count: taggedEvents.length, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  ].filter(option => option.count > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-muted mb-4">
            <Link href="/tags" className="hover:text-primary transition-colors">Tags</Link> / {originalTag}
          </nav>
          <h1 className="text-4xl font-bold mb-2 text-foreground">#{originalTag}</h1>
          <p className="text-muted mb-6">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} tagged with "{originalTag}"
          </p>
          
          {/* Filter toggles */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterOptions.map(option => (
              <button
                key={option.type}
                onClick={() => toggleFilter(option.type)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all robot-text ${
                  activeFilters.includes(option.type)
                    ? option.color
                    : 'bg-card border-border text-muted hover:bg-muted/50'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Posts */}
          {activeFilters.includes('posts') && taggedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm dark:bg-blue-900 dark:text-blue-200">Posts</span>
                Blog Posts ({taggedPosts.length})
              </h2>
              <div className="grid gap-4">
                {taggedPosts.map(post => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="block p-6 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 text-foreground hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-muted mb-3">{post.excerpt}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted">
                          <time>{formatDate(post.date)}</time>
                          <div className="flex gap-1">
                            {post.tags?.slice(0, 3).map((tag, tagIndex) => (
                              <span key={`${post.slug}-${typeof tag === 'string' ? tag : tag.id}-${tagIndex}`} className="bg-muted/50 px-2 py-1 rounded text-xs">
                                {typeof tag === 'string' ? tag : tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Events */}
          {activeFilters.includes('events') && taggedEvents.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm dark:bg-purple-900 dark:text-purple-200">Events</span>
                Events ({taggedEvents.length})
              </h2>
              <div className="grid gap-4">
                {taggedEvents.map(event => (
                  <Link
                    key={event.slug}
                    href={`/events/${event.slug}`}
                    className="block p-6 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 text-foreground hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted">
                          <time>{formatDate(event.date)}</time>
                          <span>{event.location}</span>
                          {event.isPast && <span className="text-green-600">Past Event</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}