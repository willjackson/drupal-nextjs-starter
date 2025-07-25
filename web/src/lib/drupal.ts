import { drupalFetch } from './drupal-fetch';

// JSON:API Single Event response interface
export interface DrupalSingleEventResponse {
  jsonapi: {
    version: string;
    meta: {
      links: {
        self: { href: string };
      };
    };
  };
  data: DrupalEventNode;
  included?: DrupalFileNode[];
  links?: {
    self: { href: string };
  };
}

// JSON:API Event response interface
export interface DrupalEventResponse {
  jsonapi: {
    version: string;
    meta: {
      links: {
        self: { href: string };
      };
    };
  };
  data: DrupalEventNode[];
  included?: DrupalFileNode[];
  links?: {
    self: { href: string };
  };
}

// JSON:API Single Article response interface
export interface DrupalSingleArticleResponse {
  jsonapi: {
    version: string;
    meta: {
      links: {
        self: { href: string };
      };
    };
  };
  data: DrupalArticleNode;
  included?: DrupalFileNode[];
  links?: {
    self: { href: string };
  };
}

// JSON:API Article response interface
export interface DrupalArticleResponse {
  jsonapi: {
    version: string;
    meta: {
      links: {
        self: { href: string };
      };
    };
  };
  data: DrupalArticleNode[];
  included?: DrupalFileNode[];
  links?: {
    self: { href: string };
  };
}

export interface DrupalPageNode {
  type: string;
  id: string;
  links: {
    self: { href: string };
  };
  attributes: {
    drupal_internal__nid: number;
    drupal_internal__vid: number;
    langcode: string;
    revision_timestamp: string;
    revision_log: string | null;
    status: boolean;
    title: string;
    created: string;
    changed: string;
    promote: boolean;
    sticky: boolean;
    default_langcode: boolean;
    revision_translation_affected: boolean;
    path: {
      alias: string | null;
      pid: number | null;
      langcode: string;
    };
    body?: {
      value: string;
      format: string;
      processed: string;
      summary?: string;
    };
  };
  relationships: {
    node_type: any;
    revision_uid: any;
    uid: any;
    field_image?: {
      data: {
        type: string;
        id: string;
        meta?: {
          alt: string;
          title: string;
          width: number;
          height: number;
        };
      } | null;
    };
  };
}
export interface DrupalFileNode {
  type: string;
  id: string;
  attributes: {
    drupal_internal__fid: number;
    langcode: string;
    filename: string;
    uri: {
      value: string;
      url: string;
    };
    filemime: string;
    filesize: number;
    status: boolean;
    created: string;
    changed: string;
  };
  links: {
    self: { href: string };
  };
}

export interface DrupalEventNode {
  type: string;
  id: string;
  links: {
    self: { href: string };
  };
  attributes: {
    drupal_internal__nid: number;
    drupal_internal__vid: number;
    langcode: string;
    revision_timestamp: string;
    revision_log: string | null;
    status: boolean;
    title: string;
    created: string;
    changed: string;
    promote: boolean;
    sticky: boolean;
    default_langcode: boolean;
    revision_translation_affected: boolean;
    path: {
      alias: string | null;
      pid: number | null;
      langcode: string;
    };
    body?: {
      value: string;
      format: string;
      processed: string;
      summary?: string;
    };
    field_event_date: string;
    field_location: string | null;
    field_virtual_event: boolean;
  };
  relationships: {
    node_type: any;
    revision_uid: any;
    uid: any;
    field_event_hero?: {
      data: {
        type: string;
        id: string;
        meta?: {
          alt: string;
          title: string;
          width: number;
          height: number;
        };
      } | null;
    };
  };
}

export interface DrupalArticleNode {
  type: string;
  id: string;
  links: {
    self: { href: string };
  };
  attributes: {
    drupal_internal__nid: number;
    drupal_internal__vid: number;
    langcode: string;
    revision_timestamp: string;
    revision_log: string | null;
    status: boolean;
    title: string;
    created: string;
    changed: string;
    promote: boolean;
    sticky: boolean;
    default_langcode: boolean;
    revision_translation_affected: boolean;
    path: {
      alias: string | null;
      pid: number | null;
      langcode: string;
    };
    body?: {
      value: string;
      format: string;
      processed: string;
      summary?: string;
    };
  };
  relationships: {
    node_type: any;
    revision_uid: any;
    uid: any;
    field_image?: {
      data: {
        type: string;
        id: string;
        meta?: {
          alt: string;
          title: string;
          width: number;
          height: number;
        };
      } | null;
    };
    field_tags?: {
      data: {
        type: string;
        id: string;
        attributes?: {
          name: string;
          description?: string;
        };
      }[];
    };
  };
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  body?: string;
  heroImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  isVirtual: boolean;
  isPast: boolean;
  path: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  body?: string;
  createdDate: string;
  modifiedDate: string;
  path: string;
  heroImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
}

// MenuItem interface moved to menu-utils.ts
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  createdDate: string;
  modifiedDate: string;
  heroImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  tags: {
    id: string;
    name: string;
  }[];
  path: string;
  sticky?: boolean;
  promoted?: boolean;
}

// Helper function to process direct image field
function processDirectImageField(
  imageRelationship: any,
  included: DrupalFileNode[] | undefined,
  fallbackAlt: string
): { url: string; alt: string; width: number; height: number } | undefined {
  if (!imageRelationship?.data || !included) {
    return undefined;
  }

  const fileId = imageRelationship.data.id;
  const fileMeta = imageRelationship.data.meta;
  
  const fileEntity = included.find(item => 
    item.id === fileId && 
    item.type.startsWith('file--')
  ) as DrupalFileNode | undefined;
  
  if (!fileEntity) {
    return undefined;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://drupal.d11-nextjs-starter.dev.kanopi.cloud';
  
  let imageUrl = '';
  const uri = fileEntity.attributes.uri;
  
  if (uri?.url) {
    imageUrl = uri.url.startsWith('http') ? uri.url : `${baseUrl}${uri.url}`;
  } else if (uri?.value) {
    const uriValue = uri.value;
    
    if (uriValue.startsWith('public://')) {
      imageUrl = `${baseUrl}/sites/default/files/${uriValue.replace('public://', '')}`;
    } else if (uriValue.startsWith('private://')) {
      imageUrl = `${baseUrl}/system/files/${uriValue.replace('private://', '')}`;
    } else if (uriValue.startsWith('http')) {
      imageUrl = uriValue;
    } else {
      imageUrl = `${baseUrl}${uriValue}`;
    }
  }
  
  if (imageUrl) {
    return {
      url: imageUrl,
      alt: fileMeta?.alt || fallbackAlt,
      width: fileMeta?.width || 1200,
      height: fileMeta?.height || 600
    };
  }
  
  return undefined;
}

// Transform Drupal Page to normalized Page
export function transformDrupalPage(drupalPageNode: DrupalPageNode, included?: DrupalFileNode[]): Page {
  const { id, attributes, relationships } = drupalPageNode;
  
  // Use the full path alias if available, otherwise generate a slug
  let slug = '';
  let path = '';
  
  if (attributes.path?.alias) {
    // Remove leading slash for slug
    slug = attributes.path.alias.replace(/^\//, '');
    path = attributes.path.alias;
  } else {
    // Fallback slug
    slug = `page-${id}`;
    path = `/${slug}`;
  }
  
  let heroImage: Page['heroImage'] = undefined;
  if (relationships?.field_image?.data && included) {
    heroImage = processDirectImageField(
      relationships.field_image,
      included,
      attributes.title
    );
  }
  
  return {
    id,
    slug,
    title: attributes.title,
    body: attributes.body?.processed || attributes.body?.value,
    createdDate: attributes.created,
    modifiedDate: attributes.changed,
    path,
    heroImage
  };
}

// Transform Drupal Event to normalized Event
export function transformDrupalEvent(drupalEventNode: DrupalEventNode, included?: DrupalFileNode[]): Event {
  const { id, attributes, relationships } = drupalEventNode;
  
  // Generate slug from path alias or id
  const slug = attributes.path?.alias?.replace('/events/', '') || id;
  
  // Handle location
  let location = 'TBD';
  if (attributes.field_virtual_event) {
    location = 'Virtual Event';
  } else if (attributes.field_location) {
    location = attributes.field_location;
  }
  
  // Process hero image
  const heroImage = processDirectImageField(
    relationships?.field_event_hero,
    included,
    attributes.title
  );
  
  // Handle date parsing safely
  const rawDate = attributes.field_event_date;
  let eventDate: Date;
  let isPast = false;
  
  if (rawDate) {
    // Try different date formats
    eventDate = new Date(rawDate);
    if (isNaN(eventDate.getTime())) {
      eventDate = new Date(rawDate + 'T00:00:00');
    }
    
    if (!isNaN(eventDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      isPast = eventDate < today;
      
      // console.log('Event date parsed:', {
      //   title: attributes.title,
      //   rawDate,
      //   eventDate: eventDate.toDateString(),
      //   today: today.toDateString(),
      //   isPast
      // });
    } else {
      console.warn('Failed to parse event date:', rawDate);
    }
  }
  
  return {
    id,
    slug,
    title: attributes.title,
    date: attributes.field_event_date,
    location,
    body: attributes.body?.processed || attributes.body?.value,
    heroImage,
    isVirtual: attributes.field_virtual_event || false,
    isPast,
    path: attributes.path?.alias || `/events/${slug}`
  };
}

// Transform Drupal Article to normalized Article
export function transformDrupalArticle(drupalArticleNode: DrupalArticleNode, included?: DrupalFileNode[]): Article {
  const { id, attributes, relationships } = drupalArticleNode;
  
  const slug = attributes.path?.alias?.replace('/posts/', '') || `article-${id}`;
  
  let heroImage: Article['heroImage'] = undefined;
  if (relationships?.field_image?.data && included) {
    heroImage = processDirectImageField(
      relationships.field_image,
      included,
      attributes.title
    );
  }
  
  const tags: Article['tags'] = [];
  if (relationships?.field_tags?.data && Array.isArray(relationships.field_tags.data)) {
    relationships.field_tags.data.forEach(tagRef => {
      if (included) {
        const tagEntity = included.find(item => 
          item.id === tagRef.id && 
          item.type === 'taxonomy_term--tags'
        );
        
        if (tagEntity && tagEntity.attributes) {
          tags.push({
            id: tagEntity.id,
            name: tagEntity.attributes.name
          });
        }
      }
    });
  }
  
  return {
    id,
    slug,
    title: attributes.title,
    excerpt: attributes.body?.summary,
    body: attributes.body?.processed || attributes.body?.value,
    createdDate: attributes.created,
    modifiedDate: attributes.changed,
    heroImage,
    tags,
    path: attributes.path?.alias || `/posts/${slug}`,
    sticky: attributes.sticky,
    promoted: attributes.promote
  };
}

// Fetch all events from Drupal
export async function getAllEventsFromDrupal(): Promise<Event[]> {
  try {
    const path = '/jsonapi/node/event?sort=-field_event_date&include=field_event_hero';
    
    const response = await drupalFetch(path);
    const jsonData: DrupalEventResponse = await response.json();
    
    if (!jsonData.data || !Array.isArray(jsonData.data)) {
      return [];
    }

    return jsonData.data.map(event => transformDrupalEvent(event, jsonData.included));
  } catch (error) {
    console.error('Error fetching events from Drupal:', error);
    return [];
  }
}

// Fetch a single event by ID or slug
export async function getEventFromDrupal(idOrSlug: string): Promise<Event | null> {
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    if (isUUID) {
      const path = `/jsonapi/node/event/${idOrSlug}?include=field_event_hero`;
      const response = await drupalFetch(path);
      const jsonData: DrupalSingleEventResponse = await response.json();
      
      if (!jsonData.data) {
        return null;
      }
      
      return transformDrupalEvent(jsonData.data, jsonData.included);
    } else {
      const slugPath = `/events/${idOrSlug}`;
      const path = `/jsonapi/node/event?filter[path.alias]=${encodeURIComponent(slugPath)}&include=field_event_hero`;
      const response = await drupalFetch(path);
      const jsonData: DrupalEventResponse = await response.json();
      
      if (!jsonData.data || jsonData.data.length === 0) {
        return null;
      }
      
      return transformDrupalEvent(jsonData.data[0], jsonData.included);
    }
  } catch (error) {
    console.error(`Error fetching event ${idOrSlug} from Drupal:`, error);
    return null;
  }
}

// Fetch all articles from Drupal
export async function getAllArticlesFromDrupal(): Promise<Article[]> {
  try {
    const path = '/jsonapi/node/article?sort=-created&include=field_image,field_tags';
    
    const response = await drupalFetch(path);
    const jsonData: DrupalArticleResponse = await response.json();
    
    if (!jsonData.data || !Array.isArray(jsonData.data)) {
      return [];
    }

    return jsonData.data.map(article => transformDrupalArticle(article, jsonData.included));
  } catch (error) {
    console.error('Error fetching articles from Drupal:', error);
    return [];
  }
}

// Fetch a single article by ID or slug
export async function getArticleFromDrupal(idOrSlug: string): Promise<Article | null> {
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    if (isUUID) {
      const path = `/jsonapi/node/article/${idOrSlug}?include=field_image,field_tags`;
      const response = await drupalFetch(path);
      const jsonData: DrupalSingleArticleResponse = await response.json();
      
      if (!jsonData.data) {
        return null;
      }
      
      return transformDrupalArticle(jsonData.data, jsonData.included);
    } else {
      if (idOrSlug.startsWith('article-')) {
        const nodeId = idOrSlug.replace('article-', '');
        const path = `/jsonapi/node/article/${nodeId}?include=field_image,field_tags`;
        const response = await drupalFetch(path);
        const jsonData: DrupalSingleArticleResponse = await response.json();
        
        if (!jsonData.data) {
          return null;
        }
        
        return transformDrupalArticle(jsonData.data, jsonData.included);
      } else {
        const slugPath = `/posts/${idOrSlug}`;
        const path = `/jsonapi/node/article?filter[path.alias]=${encodeURIComponent(slugPath)}&include=field_image,field_tags`;
        const response = await drupalFetch(path);
        const jsonData: DrupalArticleResponse = await response.json();
        
        if (!jsonData.data || jsonData.data.length === 0) {
          return null;
        }
        
        return transformDrupalArticle(jsonData.data[0], jsonData.included);
      }
    }
  } catch (error) {
    console.error(`Error fetching article ${idOrSlug} from Drupal:`, error);
    return null;
  }
}

// Fetch featured articles from Drupal (promoted = true)
export async function getFeaturedArticlesFromDrupal(): Promise<Article[]> {
  try {
    const path = '/jsonapi/node/article?filter[promote]=1&sort=-created&include=field_image,field_tags';
    
    const response = await drupalFetch(path);
    const jsonData: DrupalArticleResponse = await response.json();
    
    if (!jsonData.data || !Array.isArray(jsonData.data)) {
      return [];
    }

    return jsonData.data.map(article => transformDrupalArticle(article, jsonData.included));
  } catch (error) {
    console.error('Error fetching featured articles from Drupal:', error);
    return [];
  }
}

// Fetch all pages from Drupal
export async function getAllPagesFromDrupal(): Promise<Page[]> {
  try {
    const path = '/jsonapi/node/page?sort=-created&include=field_image';
    
    const response = await drupalFetch(path);
    const jsonData = await response.json();
    
    if (!jsonData.data || !Array.isArray(jsonData.data)) {
      console.log('Pages: No pages found or invalid response structure');
      return [];
    }

    const pages = jsonData.data.map((page: DrupalPageNode) => transformDrupalPage(page, jsonData.included));
    console.log(`Pages: Found ${pages.length} pages`);
    return pages;
  } catch (error) {
    console.warn('Pages: Unable to fetch pages from Drupal:', error.message);
    return [];
  }
}

// Fetch a single page by slug or path
export async function getPageFromDrupal(slugOrPath: string): Promise<Page | null> {
  try {
    // Add leading slash if not present
    const fullPath = slugOrPath.startsWith('/') ? slugOrPath : `/${slugOrPath}`;
    
    // First try to find the path alias to get the node ID
    try {
      const aliasUrl = `http://drupal.d11-nextjs-starter.dev.kanopi.cloud/jsonapi/path_alias/path_alias?filter[alias]=${encodeURIComponent(fullPath)}`;
      const aliasResponse = await fetch(aliasUrl, {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      });
      
      if (aliasResponse.ok) {
        const aliasData = await aliasResponse.json();
        if (aliasData.data && aliasData.data.length > 0) {
          const pathInfo = aliasData.data[0].attributes.path;
          // Extract node ID from path like '/node/123'
          const nodeIdMatch = pathInfo.match(/\/node\/(\d+)/);
          if (nodeIdMatch) {
            const nodeId = nodeIdMatch[1];
            const nodePath = `/jsonapi/node/page/${nodeId}?include=field_image`;
            const nodeResponse = await drupalFetch(nodePath);
            const nodeData = await nodeResponse.json();
            
            if (nodeData.data) {
              const page = transformDrupalPage(nodeData.data, nodeData.included);
              console.log(`Page: Found page '${page.title}' via path alias`);
              return page;
            }
          }
        }
      }
    } catch (aliasError) {
      console.log('Path alias lookup failed, trying direct approach');
    }
    
    // Fallback: try to find by slug in the path field (if it exists)
    // This might work for simple single-level paths
    const path = `/jsonapi/node/page?include=field_image`;
    const response = await drupalFetch(path);
    const jsonData = await response.json();
    
    if (jsonData.data && Array.isArray(jsonData.data)) {
      // Filter pages client-side by checking path attributes
      for (const pageData of jsonData.data) {
        if (pageData.attributes.path?.alias === fullPath) {
          const page = transformDrupalPage(pageData, jsonData.included);
          console.log(`Page: Found page '${page.title}' via client-side filtering`);
          return page;
        }
      }
    }
    
    console.log(`Page: No page found for path '${fullPath}'`);
    return null;
  } catch (error) {
    console.warn(`Page: Unable to fetch page '${slugOrPath}' from Drupal:`, error.message);
    return null;
  }
}

// Fetch sticky articles from Drupal (sticky = true)
export async function getStickyArticlesFromDrupal(): Promise<Article[]> {
  try {
    const path = '/jsonapi/node/article?filter[sticky]=1&sort=-created&include=field_image,field_tags';
    
    const response = await drupalFetch(path);
    const jsonData: DrupalArticleResponse = await response.json();
    
    if (!jsonData.data || !Array.isArray(jsonData.data)) {
      return [];
    }

    return jsonData.data.map(article => transformDrupalArticle(article, jsonData.included));
  } catch (error) {
    console.error('Error fetching sticky articles from Drupal:', error);
    return [];
  }
}
