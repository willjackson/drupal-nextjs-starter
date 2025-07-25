// Complete solution for Drupal menu integration using Decoupled Menus
import { drupalFetch } from './drupal-fetch';

export interface MenuItem {
  id: string;
  title: string;
  url: string;
  external: boolean;
  weight: number;
  enabled: boolean;
  children?: MenuItem[];
}

// Decoupled Menus response interface (IETF linkset format)
export interface DecoupledMenuResponse {
  linkset: Array<{
    anchor: string;
    item: Array<{
      href: string;
      title: string;
      hierarchy: string[];
      'machine-name': string[];
    }>;
  }>;
}

/**
 * Transform Decoupled Menus linkset data to MenuItem array
 */
function transformLinksetToMenuItems(linksetData: DecoupledMenuResponse): MenuItem[] {
  const menuItems: MenuItem[] = [];
  
  if (!linksetData.linkset || !Array.isArray(linksetData.linkset)) {
    return menuItems;
  }
  
  linksetData.linkset.forEach(linkset => {
    if (linkset.item && Array.isArray(linkset.item)) {
      linkset.item.forEach((item, index) => {
        let url = item.href;
        let external = false;
        
        // Handle different URL formats
        if (url.startsWith('http')) {
          external = true;
        } else {
          // Ensure internal URLs start with /
          if (!url.startsWith('/')) {
            url = `/${url}`;
          }
        }
        
        const menuItem: MenuItem = {
          id: `linkset-item-${index}`,
          title: item.title,
          url,
          external,
          weight: index,
          enabled: true,
        };
        
        menuItems.push(menuItem);
      });
    }
  });
  
  return menuItems;
}

/**
 * Main function to fetch menu items using Decoupled Menus endpoint
 */
export async function fetchMenuItems(menuName: string = 'nextjs'): Promise<MenuItem[]> {
  console.log(`Fetching menu '${menuName}' via Decoupled Menus endpoint...`);
  
  try {
    const path = `/system/menu/${menuName}/linkset`;
    console.log(`Requesting: ${path}`);
    
    const response = await drupalFetch(path);
    const linksetData: DecoupledMenuResponse = await response.json();
    
    console.log('Decoupled Menus raw response:', JSON.stringify(linksetData, null, 2));
    
    const menuItems = transformLinksetToMenuItems(linksetData);
    console.log(`Successfully fetched ${menuItems.length} menu items`);
    
    return menuItems;
  } catch (error) {
    console.error('Decoupled Menus endpoint failed:', error.message);
    console.error('Please enable the decoupled_menus module in Drupal at /admin/modules');
    return [];
  }
}

