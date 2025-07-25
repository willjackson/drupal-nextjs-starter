import Link from 'next/link';
import { config } from '@/lib/config';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="space-card p-8 md:p-12">
          {/* 404 Number */}
          <div className="text-8xl md:text-9xl font-bold text-primary/20 robot-text mb-4">
            404
          </div>
          
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground robot-text mb-4">
            Page Not Found
          </h1>
          
          {/* Description */}
          <p className="text-lg text-muted mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background hover:bg-foreground/90 rounded-lg transition-colors robot-text font-medium"
            >
              Go Home
            </Link>
            
            <Link 
              href="/posts"
              className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground hover:bg-card rounded-lg transition-colors robot-text font-medium"
            >
              Browse Posts
            </Link>
          </div>
          
          {/* Additional Help */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/posts" className="text-primary hover:text-accent transition-colors">
                All Posts
              </Link>
              <Link href="/events" className="text-primary hover:text-accent transition-colors">
                Events
              </Link>
              <Link href="/tags" className="text-primary hover:text-accent transition-colors">
                Tags
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
