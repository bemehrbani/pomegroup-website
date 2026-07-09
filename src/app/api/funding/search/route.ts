import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text = '***', pageNumber = 1, pageSize = 10, status = ['31094501', '31094502'] } = body;

    const url = new URL('https://api.tech.ec.europa.eu/search-api/prod/rest/search');
    url.searchParams.set('apiKey', 'SEDIA');
    url.searchParams.set('text', text || '***');
    url.searchParams.set('pageSize', String(pageSize));
    url.searchParams.set('pageNumber', String(pageNumber));

    // Construct Elasticsearch boolean query
    // type: ["1"] represents grants/calls for proposals
    const query = {
      bool: {
        must: [
          { terms: { type: ['1'] } },
          { terms: { status: status } }
        ]
      }
    };

    // Construct multipart form data using native Blob and FormData to set correct content types
    const formData = new FormData();
    const queryBlob = new Blob([JSON.stringify(query)], { type: 'application/json' });
    const languagesBlob = new Blob([JSON.stringify(['en'])], { type: 'application/json' });
    const sortBlob = new Blob([JSON.stringify({ order: 'DESC', field: 'startDate' })], { type: 'application/json' });

    formData.append('query', queryBlob);
    formData.append('languages', languagesBlob);
    formData.append('sort', sortBlob);

    const response = await fetch(url.toString(), {
      method: 'POST',
      body: formData,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('EU Search API proxy error response:', errText);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch from EU Funding Portal API.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const results = data.results || [];

    interface SediaResult {
      reference?: string;
      url?: string;
      metadata?: {
        status?: string[];
        identifier?: string[];
        title?: string[];
        description?: string[];
        frameworkProgramme?: string[];
        esST_URL?: string[];
        startDate?: string[];
        esDA_endDate?: string[];
        typesOfAction?: string[];
        crossCuttingPriorities?: string[];
      };
    }

    // Parse and normalize metadata for frontend use
    const formattedResults = results.map((item: SediaResult) => {
      const meta = item.metadata || {};
      const statusValue = meta.status?.[0];
      let statusLabel = 'Closed';
      if (statusValue === '31094501') statusLabel = 'Open';
      else if (statusValue === '31094502') statusLabel = 'Forthcoming';

      return {
        id: item.reference || meta.identifier?.[0] || Math.random().toString(),
        title: meta.title?.[0] || 'Untitled Call',
        description: meta.description?.[0] || '',
        programme: meta.frameworkProgramme?.[0] || 'EU Funding',
        identifier: meta.identifier?.[0] || '',
        url: meta.esST_URL?.[0] || item.url || '',
        startDate: meta.startDate?.[0] || '',
        endDate: meta.esDA_endDate?.[0] || '',
        status: statusLabel,
        typesOfAction: meta.typesOfAction || [],
        crossCuttingPriorities: meta.crossCuttingPriorities || []
      };
    });

    return NextResponse.json({
      success: true,
      totalResults: data.totalResults || 0,
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      results: formattedResults
    });
  } catch (err: unknown) {
    console.error('Error in funding search route:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error fetching funding data.' },
      { status: 500 }
    );
  }
}
