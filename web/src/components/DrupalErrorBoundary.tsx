'use client';

import React from 'react';
import { testDrupalConnection } from '@/lib/drupal-fetch';

interface DrupalErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface DrupalErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  connectionTest?: Awaited<ReturnType<typeof testDrupalConnection>>;
}

export class DrupalErrorBoundary extends React.Component<DrupalErrorBoundaryProps, DrupalErrorBoundaryState> {
  constructor(props: DrupalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DrupalErrorBoundaryState {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Drupal connection error:', error, errorInfo);
    
    // Test connection to provide better error info
    try {
      const connectionTest = await testDrupalConnection();
      this.setState({ connectionTest });
    } catch (e) {
      console.error('Failed to test connection:', e);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="space-card p-8">
              <h1 className="text-3xl font-bold text-destructive mb-4">Drupal Connection Error</h1>
              
              <p className="text-muted mb-6">
                The NextJS application cannot connect to the Drupal backend. This is typically a configuration issue.
              </p>

              <details className="mb-6">
                <summary className="cursor-pointer text-lg font-semibold mb-2">Error Details</summary>
                <pre className="bg-muted p-4 rounded overflow-auto text-sm">
                  {this.state.error?.message || 'Unknown error'}
                </pre>
              </details>

              {this.state.connectionTest && !this.state.connectionTest.success && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Suggested Solutions:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {this.state.connectionTest.suggestions?.map((suggestion, index) => (
                      <li key={index} className="text-sm">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-muted p-4 rounded mb-6">
                <h3 className="font-semibold mb-2">Quick Fix for Development:</h3>
                <p className="text-sm mb-2">Add this line to your <code>.env.local</code> file:</p>
                <code className="block bg-background p-2 rounded text-sm">
                  DRUPAL_INTERNAL_URL=http://localhost:8080
                </code>
                <p className="text-xs text-muted mt-2">
                  (Replace with your actual Drupal URL - check with: docker ps, ddev describe, or lando info)
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Retry
                </button>
                <a 
                  href="/api/health" 
                  target="_blank"
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
                >
                  Test API Health
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Fallback component for when Drupal data fails to load
export function DrupalDataFallback({ 
  title, 
  error, 
  showRetry = true 
}: { 
  title: string; 
  error?: string; 
  showRetry?: boolean;
}) {
  return (
    <div className="space-card p-6 text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted text-sm mb-4">
        Unable to load content from Drupal
      </p>
      {error && (
        <details className="mb-4">
          <summary className="cursor-pointer text-sm text-muted">Error Details</summary>
          <pre className="text-xs bg-muted p-2 rounded mt-2 text-left overflow-auto">
            {error}
          </pre>
        </details>
      )}
      {showRetry && (
        <button 
          onClick={() => window.location.reload()} 
          className="text-sm text-primary hover:text-accent transition-colors"
        >
          Retry Loading
        </button>
      )}
    </div>
  );
}
