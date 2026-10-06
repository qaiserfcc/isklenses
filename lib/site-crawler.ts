import axios from 'axios';
import * as cheerio from 'cheerio';

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  parentId?: string;
  children?: MenuItem[];
  order: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  categoryId?: string;
  specs?: Record<string, string>;
  sourceUrl?: string;
  createdAt?: Date;
}

export class SiteMenuCrawler {
  private baseUrl: string;
  private domain: string;

  constructor(domain: string) {
    this.domain = domain;
    this.baseUrl = `https://${domain}`;
  }

  async fetchHTML(path: string = '/'): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}${path}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 15000
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${this.baseUrl}${path}:`, error);
      throw error;
    }
  }

  async extractMenuNavigation(html: string): Promise<MenuItem[]> {
    const $ = cheerio.load(html);
    const menuItems: MenuItem[] = [];
    let itemIndex = 0;

    // Try multiple common menu selectors
    const menuSelectors = [
      'nav',
      '.navbar',
      '.menu',
      '.navigation',
      'header nav',
      '[role="navigation"]',
      '.main-menu',
      '.top-menu'
    ];

    for (const selector of menuSelectors) {
      const $nav = $(selector);
      if ($nav.length === 0) continue;

      // Extract links from nav
      $nav.find('a').each((index, element) => {
        const $el = $(element);
        const label = $el.text().trim();
        const url = $el.attr('href') || '#';

        if (label && label.length > 0) {
          const menuItem: MenuItem = {
            id: `menu-${itemIndex}`,
            label: label,
            url: this.normalizeUrl(url),
            order: itemIndex,
            parentId: undefined,
            children: []
          };

          // Check for nested/child items
          const $parent = $el.closest('li');
          const $children = $parent.find('ul, .submenu, [role="menu"]');
          
          if ($children.length > 0) {
            const childItems: MenuItem[] = [];
            let childIndex = 0;
            
            $children.find('a').each((_, childEl) => {
              const $child = $(childEl);
              const childLabel = $child.text().trim();
              const childUrl = $child.attr('href') || '#';

              if (childLabel && childLabel.length > 0) {
                childItems.push({
                  id: `menu-${itemIndex}-${childIndex}`,
                  label: childLabel,
                  url: this.normalizeUrl(childUrl),
                  parentId: `menu-${itemIndex}`,
                  order: childIndex
                });
                childIndex++;
              }
            });
            
            menuItem.children = childItems;
          }

          menuItems.push(menuItem);
          itemIndex++;
        }
      });

      if (menuItems.length > 0) break;
    }

    // If no menu found, try to extract from links in header
    if (menuItems.length === 0) {
      $('header a').each((index, element) => {
        const $el = $(element);
        const label = $el.text().trim();
        const url = $el.attr('href') || '#';

        if (label && label.length > 0 && !label.includes('Log')) {
          menuItems.push({
            id: `menu-${index}`,
            label: label,
            url: this.normalizeUrl(url),
            order: index
          });
        }
      });
    }

    return menuItems;
  }

  async extractAllProducts(): Promise<Product[]> {
    console.log(`Starting product crawl from ${this.baseUrl}...`);
    const allProducts: Product[] = [];
    const visitedUrls = new Set<string>();
    const urlsToVisit: string[] = ['/'];

    // First, get the menu to find all product pages
    const homepageHTML = await this.fetchHTML('/');
    const menu = await this.extractMenuNavigation(homepageHTML);
    
    // Collect all navigable URLs from menu
    const collectUrls = (items: MenuItem[]) => {
      items.forEach(item => {
        if (item.url && item.url !== '#' && !item.url.startsWith('http')) {
          if (!urlsToVisit.includes(item.url)) {
            urlsToVisit.push(item.url);
          }
        }
        if (item.children) {
          collectUrls(item.children);
        }
      });
    };
    
    collectUrls(menu);

    // Crawl each URL for products
    while (urlsToVisit.length > 0) {
      const currentUrl = urlsToVisit.shift();
      
      if (!currentUrl || visitedUrls.has(currentUrl)) continue;
      visitedUrls.add(currentUrl);

      console.log(`Crawling: ${currentUrl}`);
      
      try {
        const html = await this.fetchHTML(currentUrl);
        const products = await this.extractProductsFromPage(html, currentUrl);
        
        if (products.length > 0) {
          console.log(`  Found ${products.length} products`);
          allProducts.push(...products);
        }

        // Look for pagination links
        const $ = cheerio.load(html);
        $('a[href*="page"], a.next, .pagination a').each((_, el) => {
          const href = $(el).attr('href');
          if (href && !visitedUrls.has(href) && !urlsToVisit.includes(href)) {
            urlsToVisit.push(href);
          }
        });

      } catch (error) {
        console.error(`Error crawling ${currentUrl}:`, error);
      }

      // Limit crawl to prevent infinite loops
      if (visitedUrls.size > 50) break;
    }

    console.log(`Crawl complete. Total products found: ${allProducts.length}`);
    return allProducts;
  }

  private async extractProductsFromPage(html: string, pageUrl: string): Promise<Product[]> {
    const $ = cheerio.load(html);
    const products: Product[] = [];

    // Multiple product selector patterns
    const productSelectors = [
      '[data-product]',
      '.product',
      '.product-item',
      '.product-card',
      'article[data-product-id]',
      '.item',
      '[role="article"]'
    ];

    let productElements: any = null;
    
    for (const selector of productSelectors) {
      productElements = $(selector);
      if (productElements.length > 0) break;
    }

    productElements.each((index, element) => {
      const $el = $(element);

      // Extract product data using multiple selectors
      const name = 
        $el.find('[data-product-name], .product-name, .title, h2, h3').first().text().trim() ||
        $el.attr('data-product-name') ||
        $el.attr('title');

      const description = 
        $el.find('[data-product-description], .description, .product-desc, p').first().text().trim();

      const priceText = $el.find('[data-price], .price, .product-price, .amount').first().text();
      const price = this.parsePrice(priceText);

      const imageUrl = 
        $el.find('img').first().attr('src') ||
        $el.find('img').first().attr('data-src');

      const category = 
        $el.find('[data-category], .category, .product-category').text().trim();

      const id = 
        $el.attr('data-product-id') ||
        $el.attr('id') ||
        `prod-${Date.now()}-${index}`;

      const sku = 
        $el.find('[data-sku], .sku').text().trim() ||
        this.generateSKU(name);

      // Extract specs
      const specs: Record<string, string> = {};
      $el.find('[data-specs] li, .specs li, .specifications li, .features li').each((_, spec) => {
        const text = $(spec).text().trim();
        if (text.includes(':')) {
          const [key, value] = text.split(':').map(s => s.trim());
          specs[key] = value;
        }
      });

      // Also check for spec tables
      $el.find('table tr').each((_, row) => {
        const $cells = $(row).find('td, th');
        if ($cells.length >= 2) {
          const key = $cells.eq(0).text().trim();
          const value = $cells.eq(1).text().trim();
          if (key && value) specs[key] = value;
        }
      });

      // Get product detail URL
      const productLink = $el.find('a[href]').first().attr('href');
      const sourceUrl = productLink ? this.normalizeUrl(productLink) : pageUrl;

      if (name && price > 0) {
        products.push({
          id: id,
          name: name,
          sku: sku,
          description: description,
          price: price,
          imageUrl: this.normalizeImageUrl(imageUrl),
          category: category,
          specs: Object.keys(specs).length > 0 ? specs : undefined,
          sourceUrl: sourceUrl,
          createdAt: new Date()
        });
      }
    });

    return products;
  }

  private parsePrice(priceText: string): number {
    const priceMatch = priceText.match(/[\d.,]+/);
    if (priceMatch) {
      const cleaned = priceMatch[0].replace(/[.,]/g, (match) => match === ',' ? '.' : '');
      return parseFloat(cleaned) || 0;
    }
    return 0;
  }

  private generateSKU(name: string): string {
    return `SKU-${name.substring(0, 10).replace(/\s+/g, '-').toUpperCase()}-${Date.now()}`;
  }

  private normalizeUrl(url: string): string {
    if (!url || url === '#') return '/';
    if (url.startsWith('http')) return url;
    if (!url.startsWith('/')) return '/' + url;
    return url;
  }

  private normalizeImageUrl(url?: string): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return this.baseUrl + url;
    return this.baseUrl + '/' + url;
  }
}
