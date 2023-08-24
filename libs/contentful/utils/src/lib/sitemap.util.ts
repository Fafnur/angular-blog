import * as fs from 'node:fs';
import * as path from 'node:path';

export interface SitemapConfig {
  loc: string;
  lastmod: string;
  priority: string;
  changefreq: string;
}

const routes = new Set<string>();

/**
 * Find file on folders
 */
function fromDir(startPath: string, filter: string): string[] {
  if (!fs.existsSync(startPath)) {
    console.warn('no dir ', startPath);
    return [];
  }
  const founded = [];
  const files = fs.readdirSync(startPath);
  for (const file of files) {
    const filename = path.join(startPath, file);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      const foundedIn = fromDir(filename, filter);
      founded.push(...foundedIn);
    } else if (filename.indexOf(filter) >= 0) {
      founded.push(filename);
    }
  }

  return founded;
}

/**
 * Find sitemap config on file content
 */
function parseSitemapConfig(source: string): Partial<SitemapConfig> {
  let sitemapConfig = source
    .slice(8)
    .replace(/\n|\t|\s/g, '')
    .replace(/'/g, '"')
    .trim();
  if (sitemapConfig[sitemapConfig.length - 1] === ',') {
    sitemapConfig = sitemapConfig.slice(0, sitemapConfig.length - 1);
  }
  sitemapConfig = sitemapConfig + '}';
  sitemapConfig = sitemapConfig.replace(
    /(\w+:)|(\w+ :)/g,
    (matchedStr: string) => '"' + matchedStr.substring(0, matchedStr.length - 1) + '":',
  );

  return JSON.parse(sitemapConfig);
}

/**
 * Generate sitemap url
 */
function getSitemapUrl(sitemap: Partial<SitemapConfig>, appHost: string): string {
  if (sitemap.loc) {
    routes.add(sitemap.loc.length > 0 ? sitemap.loc : '/');
  }
  return `<url><loc>${appHost}${sitemap.loc !== '/' ? sitemap.loc : ''}</loc><lastmod>${
    sitemap.lastmod ?? new Date().toISOString()
  }</lastmod><changefreq>${sitemap.changefreq ?? 'daily'}</changefreq><priority>${sitemap.priority ?? 0.8}</priority></url>`;
}

function getUrls(appHost: string, app: string, excludes: string[] = []): string {
  let files = [...fromDir(`./apps/${app}`, '.routes.ts'), ...fromDir(`./libs`, '.routes.ts')];

  if (excludes.length) {
    files = files.filter((file) => excludes.every((exclude) => file.indexOf(exclude) < 0));
  }

  let data = '';

  for (const file of files) {
    const fileContent = fs.readFileSync(file, 'utf8');
    const sources = fileContent.replace(/\s+/, ' ').match(/sitemap:\s{[^}]+/g);

    if (sources) {
      for (const source of sources) {
        data += getSitemapUrl(parseSitemapConfig(source), appHost);
      }
    }
  }

  return data;
}

export function generateSitemap(app: string, appHost?: string, excludes: string[] = [], sitemap = 'sitemap.xml'): void {
  if (!appHost) {
    appHost = process.env['NX_APP_HOST'] ?? 'http://localhost';
  }
  const urls = getUrls(appHost, app, excludes);
  fs.writeFileSync(
    `apps/${app}/src/${sitemap}`,
    // eslint-disable-next-line max-len
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
  );
  const routePaths = [...Array.from(routes), '/not-found'].sort().join('\n');
  fs.writeFileSync(`apps/${app}/dynamic-routes.txt`, routePaths);
}
