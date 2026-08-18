# SETARI — Search visibility setup

## Technical SEO already included
- robots.txt allows public crawling and references sitemap.xml.
- sitemap.xml lists all public journal pages with lastmod.
- canonical URLs, index/follow robots directives, Open Graph/Twitter metadata.
- Schema.org Organization + Periodical + WebSite on home page.
- Article template keeps noindex until real metadata is inserted; includes Google Scholar Highwire citation tags.
- Atom feed at /feed.xml.
- IndexNow key at /e45aecaf955c4c5ab70adfe9fc5e7f6f.txt.
- GitHub Action automatically notifies IndexNow-compatible search engines after pushes to main.

## Google Search Console
1. Add URL-prefix property for https://revistasetari.github.io/.
2. Verify ownership with the HTML file supplied by Google. Upload that file to the repository root.
3. Submit sitemap.xml in Sitemaps.
4. Use URL Inspection on the homepage, current issue, call for papers, editorial board call, and each REAL article page; request indexing.
5. Do not request indexing for articles/_template.

## Bing Webmaster Tools
1. Import the verified site from Google Search Console or verify directly.
2. Submit sitemap.xml.
3. Confirm IndexNow reports submissions.

## Google Scholar
For each real article:
- one unique HTML landing page;
- complete visible abstract;
- searchable PDF <= 5 MB where practical;
- title and each author in separate citation_* meta tags;
- publication date, journal title, volume, issue, first/last page or article number;
- citation_pdf_url must point to the PDF in the same article directory;
- remove noindex ONLY after every placeholder is replaced;
- link the article from current issue/archive using normal HTML links.

## IndexNow key
Key: `e45aecaf955c4c5ab70adfe9fc5e7f6f`
Key URL: https://revistasetari.github.io/e45aecaf955c4c5ab70adfe9fc5e7f6f.txt

The IndexNow Action notifies participating engines. Google does not use IndexNow; use Search Console for Google.
