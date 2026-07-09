import { NextResponse } from 'next/server';
import { blogArticles } from '@/lib/blog-data';

/**
 * IndexNow API key — a unique key for this site.
 * The corresponding key file is served at /indexnow-key.txt
 */
const INDEXNOW_KEY = 'pomegroup-studio-indexnow-2026';
const BASE_URL = 'https://www.pomegroup.studio';

/**
 * POST /api/indexnow
 *
 * Submits URLs to the IndexNow protocol for instant indexing
 * on Bing, Yandex, Seznam, and Naver.
 *
 * Body (optional):
 * - urls: string[] — specific URLs to submit. If empty, submits all blog articles.
 *
 * Usage:
 *   curl -X POST https://www.pomegroup.studio/api/indexnow
 *   curl -X POST https://www.pomegroup.studio/api/indexnow -H "Content-Type: application/json" -d '{"urls":["/blog/my-article"]}'
 */
export async function POST(request: Request) {
  let urlsToSubmit: string[];

  try {
    const body = await request.json().catch(() => null);

    if (body?.urls && Array.isArray(body.urls) && body.urls.length > 0) {
      urlsToSubmit = body.urls.map((url: string) =>
        url.startsWith('http') ? url : `${BASE_URL}${url}`
      );
    } else {
      // Submit all known pages
      urlsToSubmit = [
        BASE_URL,
        `${BASE_URL}/blog`,
        `${BASE_URL}/resources`,
        `${BASE_URL}/co-build`,
        ...blogArticles.map((article) => `${BASE_URL}/blog/${article.slug}`),
      ];
    }
  } catch {
    urlsToSubmit = [
      BASE_URL,
      `${BASE_URL}/blog`,
      ...blogArticles.map((article) => `${BASE_URL}/blog/${article.slug}`),
    ];
  }

  const payload = {
    host: 'www.pomegroup.studio',
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urlsToSubmit,
  };

  const results: Record<string, string> = {};

  // Submit to IndexNow endpoints (Bing, Yandex, Seznam, Naver)
  const indexNowEndpoints = [
    { name: 'Bing', url: 'https://www.bing.com/indexnow' },
    { name: 'Yandex', url: 'https://yandex.com/indexnow' },
    { name: 'Seznam', url: 'https://search.seznam.cz/indexnow' },
    { name: 'Naver', url: 'https://searchadvisor.naver.com/indexnow' },
  ];

  for (const endpoint of indexNowEndpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      });
      results[endpoint.name] = `${response.status} ${response.statusText}`;
    } catch (error) {
      results[endpoint.name] = `Error: ${error instanceof Error ? error.message : 'unknown'}`;
    }
  }

  return NextResponse.json({
    success: true,
    submitted: urlsToSubmit.length,
    urls: urlsToSubmit,
    results,
  });
}

/**
 * GET /api/indexnow
 * Returns information about the IndexNow integration.
 */
export async function GET() {
  return NextResponse.json({
    protocol: 'IndexNow',
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    totalArticles: blogArticles.length,
    endpoints: ['Bing', 'Yandex', 'Seznam', 'Naver'],
    usage: 'POST to this endpoint to submit URLs for indexing.',
  });
}
