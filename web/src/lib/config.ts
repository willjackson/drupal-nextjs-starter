import configData from '../../config.json';

export interface SiteConfig {
  site: {
    name: string;
    description: string;
    heroImage: string;
  };
  social: {
    github: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
}

export const config: SiteConfig = configData;