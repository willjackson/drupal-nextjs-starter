# Drupal-NextJS Integration Project Instructions

## Overview

This project implements a **headless CMS architecture** where Drupal serves as the content management backend and NextJS provides the frontend presentation layer. Content is fetched from Drupal via JSON:API and transformed for optimal frontend consumption.

## Architecture Components

### 1. Content Integration Layer

#### Data Fetching (`/src/lib/drupal-fetch.ts`)
- **Custom HTTP client** with enhanced error handling
- Environment-based URL configuration via `NEXT_PUBLIC_DRUPAL_BASE_URL`
- Automatic JSON:API headers and content negotiation
- Built-in timeout handling for server-side requests
- Connection diagnostics and troubleshooting tools

#### Data Access & Transformation (`/src/lib/drupal.ts`)
- **TypeScript interfaces** for all Drupal JSON:API responses
- **Transformation functions** that convert Drupal data structures to normalized frontend objects
- **Content fetching functions** for retrieving single items and collections
- **Image processing logic** that handles Drupal file schemes and generates proper URLs

### 2. Content Type Integration Pattern

#### Drupal Field Mapping
Each Drupal content type follows a consistent mapping pattern:

```
Drupal Content Type → NextJS Data Structure
├── Core Fields (title, body, created, changed, status)
├── Custom Fields (mapped to relevant properties)
├── Entity References (relationships to other content)
├── File/Image Fields (transformed to image objects with metadata)
└── Taxonomy Terms (converted to tag/category arrays)
```

#### Data Transformation Process
1. **Fetch** raw JSON:API response from Drupal
2. **Extract** main data and included referenced entities
3. **Transform** Drupal field structure to normalized frontend format
4. **Process** file/image references into complete URL structures
5. **Handle** taxonomy relationships and entity references

#### Example Transformation Function Pattern
```typescript
export function transformDrupalContent(drupalNode: DrupalNodeType, included?: DrupalFileNode[]): ContentType {
  const { id, attributes, relationships } = drupalNode;
  
  return {
    id,
    title: attributes.title,
    body: attributes.body?.processed || attributes.body?.value,
    slug: generateSlugFromPath(attributes.path?.alias, id),
    // Transform custom fields
    customField: attributes.field_custom_name,
    // Process image relationships
    heroImage: processImageField(relationships?.field_image, included, attributes.title),
    // Handle taxonomy terms
    tags: processTaxonomyTerms(relationships?.field_tags, included),
    // Normalize dates
    createdDate: attributes.created,
    modifiedDate: attributes.changed,
    path: attributes.path?.alias || `/content/${slug}`
  };
}
```

### 3. Routing Architecture

#### Static Routes
- **Collection pages** (`/posts`, `/events`, etc.) - List all content of a specific type
- **Taxonomy pages** (`/tags`, `/categories`) - Browse content by classification
- **Static pages** (hardcoded routes for specific functionality)

#### Dynamic Routes
- **Individual content** (`/posts/[slug]`, `/events/[slug]`) - Single content item display
- **Filtered content** (`/tags/[tag]`, `/category/[category]`) - Content filtered by taxonomy
- **Generic node access** (`/node/[id]`) - Fallback route for direct node access

#### Catch-All Routes
- **Pages from Drupal** (`/[...slug]`) - Dynamically created pages that mirror Drupal's page structure

### 4. Page Content Integration (Special Case)

#### Drupal Page → NextJS Page Mapping
- **Direct route mapping**: Drupal pages with path aliases become NextJS routes
- **Automatic discovery**: `generateStaticParams()` fetches all Drupal pages during build
- **Dynamic rendering**: Pages can be rendered statically or dynamically based on configuration

#### Menu Integration
- **NextJS menu creation**: Create a menu in Drupal called "nextjs" (or your preferred name)
- **Menu item types**: Support for internal links, external links, and entity references
- **Navigation rendering**: Menu items automatically appear in NextJS navigation components
- **Link transformation**: Drupal menu links are converted to NextJS-compatible URLs

Example menu integration:
```typescript
// Fetch menu items from Drupal
const menuItems = await getMenuFromDrupal('nextjs');

// Transform menu structure
const navigationItems = menuItems.map(item => ({
  id: item.id,
  title: item.title,
  url: transformDrupalUrl(item.url),
  external: item.url.startsWith('http'),
  weight: item.weight
}));
```

## Development Workflow

### 1. Adding New Content Types

#### In Drupal:
1. Create new content type with desired fields
2. Configure JSON:API permissions for the content type
3. Set up path aliases if custom URLs are needed
4. Configure image styles for any image fields

#### In NextJS:
1. **Define TypeScript interfaces** for the new content type
2. **Create transformation function** to normalize Drupal data
3. **Add fetching functions** for collections and individual items
4. **Create route handlers** and page components
5. **Update navigation** and linking as needed

### 2. Field Mapping Process

#### For Each Drupal Field:
- **Simple fields** (text, number, boolean) → Direct property mapping
- **Rich text fields** → Map `processed` value for HTML content
- **Entity references** → Transform to object references or arrays
- **File/Image fields** → Process through image transformation pipeline
- **Taxonomy terms** → Convert to simplified tag/category objects
- **Date fields** → Normalize to consistent date format

#### Image Field Processing:
```typescript
function processImageField(relationship: any, included: DrupalFileNode[], fallbackAlt: string) {
  if (!relationship?.data || !included) return undefined;
  
  const fileEntity = included.find(item => item.id === relationship.data.id);
  if (!fileEntity) return undefined;
  
  return {
    url: constructImageUrl(fileEntity.attributes.uri),
    alt: relationship.data.meta?.alt || fallbackAlt,
    width: relationship.data.meta?.width || 1200,
    height: relationship.data.meta?.height || 600
  };
}
```

### 3. Error Handling Strategy

#### Connection Resilience:
- **Graceful degradation** when Drupal is unavailable
- **Fallback content** for missing or failed API calls
- **Error boundaries** to prevent complete page failures
- **Debug information** for development troubleshooting

#### Implementation Pattern:
```typescript
async function safeDrupalCall<T>(fn: () => Promise<T>, fallback: T, name: string): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`Error fetching ${name} from Drupal:`, error);
    return fallback;
  }
}
```

## Configuration Requirements

### Environment Variables
```bash
# Required: Drupal base URL for API calls
NEXT_PUBLIC_DRUPAL_BASE_URL=https://your-drupal-site.com

# Optional: Internal URL for server-side requests (different from public URL)
DRUPAL_INTERNAL_URL=http://drupal-internal:8080

# Optional: Authentication credentials for draft mode
DRUPAL_CLIENT_ID=your-client-id
DRUPAL_CLIENT_SECRET=your-client-secret
```

### Drupal Configuration
- **JSON:API module** must be enabled
- **Content type permissions** configured for anonymous users
- **CORS settings** configured if frontend and backend are on different domains
- **Path aliases** configured for SEO-friendly URLs
- **Menu system** set up with "nextjs" menu for navigation

## Performance Optimizations

### Static Generation
- **Build-time generation** for all discoverable content
- **Incremental Static Regeneration** for content updates
- **Dynamic imports** for non-critical components

### Image Optimization
- **Next.js Image component** integration for automatic optimization
- **Responsive images** with proper sizing attributes
- **Fallback system** for missing or broken images

### Caching Strategy
- **Static page caching** for content that doesn't change frequently
- **API response caching** to reduce Drupal server load
- **Client-side caching** for repeated navigation

## Best Practices

### Code Organization
- **Separate concerns**: Keep data fetching, transformation, and presentation layers distinct
- **Type safety**: Use TypeScript interfaces for all data structures
- **Error handling**: Implement comprehensive error boundaries and fallbacks
- **Configuration**: Centralize all environment-dependent settings

### Content Management
- **URL consistency**: Ensure Drupal path aliases match desired NextJS URLs
- **Image optimization**: Use appropriate image styles in Drupal
- **Menu management**: Keep NextJS menu items organized and weighted properly
- **Content structure**: Design Drupal content types with frontend presentation in mind

### Deployment Considerations
- **Build process**: Ensure all content is discoverable during static generation
- **Environment parity**: Match development and production Drupal configurations
- **Monitoring**: Implement health checks for Drupal connectivity
- **Fallback strategies**: Plan for Drupal maintenance windows and outages