import { siteConfig } from "../config/site";

export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  locale: string;
  siteName: string;
  ogLocale: string;
}

export function createSeoMetadata(input: {
  title: string;
  description: string;
  pathname: string;
}): SeoMetadata {
  const canonical = new URL(input.pathname, siteConfig.siteUrl).href;

  return {
    title: input.title,
    description: input.description,
    canonical,
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    ogLocale: "es_CO",
  };
}
