import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let conceptStr = '';
  try {
    const body = await request.json();
    const { concept, website, fundingCall } = body;
    conceptStr = concept || '';

    if (!concept) {
      return NextResponse.json(
        { success: false, error: 'Venture concept description is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY || '';

    // Step 1: Attempt to crawl website if provided
    let crawledText = '';
    if (website) {
      try {
        const fetchPromise = fetch(website, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          signal: AbortSignal.timeout(5000) // 5 seconds timeout
        });
        const res = await fetchPromise;
        if (res.ok) {
          const html = await res.text();
          // Stripping HTML tags, scripts, and stylesheets
          crawledText = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 3000); // limit length to fit token context
        }
      } catch (crawlErr) {
        console.warn(`Could not crawl website ${website}:`, crawlErr);
      }
    }

    // SCENARIO A: Score a specific selected grant call
    if (fundingCall) {
      if (!apiKey) {
        console.warn('DEEPSEEK_API_KEY is missing. Executing simulated single-grant scoring.');
        const mockReport = generateMockReport(concept, fundingCall);
        return NextResponse.json({ success: true, results: [mockReport], isSimulated: true });
      }

      const scorePrompt = `You are a senior European venture analyst matching startups with EU funding.
Company Concept: "${concept}"
${crawledText ? `Company Website Content: "${crawledText}"` : ''}

Review this grant opportunity:
Title: "${fundingCall.title}"
Programme: "${fundingCall.programme}"
Description: "${fundingCall.description}"
ID: "${fundingCall.id || fundingCall.identifier}"

Calculate the eligibility and match potential. You MUST strictly follow this JSON schema:
{
  "id": "${fundingCall.id || fundingCall.identifier}",
  "title": "${fundingCall.title}",
  "programme": "${fundingCall.programme}",
  "url": "${fundingCall.url}",
  "startDate": "${fundingCall.startDate}",
  "endDate": "${fundingCall.endDate}",
  "relevanceScore": 85, // Integer between 0 and 100 representing eligibility matching chance
  "summary": "1-2 sentence alignment summary of this specific grant.",
  "keyAlignment": ["Point 1 of how this concept matches the grant's goals", "Point 2..."],
  "keyBottlenecks": ["Hurdle 1 (e.g. requires consortium of 3 countries, SMEs only, etc.)", "Hurdle 2..."]
}

Output ONLY the raw JSON string. Do NOT include markdown styling, \`\`\`json blocks, or trailing text.`;

      const scoreResponse = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: scorePrompt }],
          response_format: { type: 'json_object' },
          temperature: 0.1
        })
      });

      if (!scoreResponse.ok) {
        const errText = await scoreResponse.text();
        console.error('DeepSeek single call scoring error:', errText);
        const mockReport = generateMockReport(concept, fundingCall);
        return NextResponse.json({ success: true, results: [mockReport], isSimulated: true });
      }

      const scoreData = await scoreResponse.json();
      const scoreContent = scoreData.choices?.[0]?.message?.content;
      if (scoreContent) {
        const report = JSON.parse(scoreContent);
        return NextResponse.json({ success: true, results: [report], isSimulated: false });
      }

      const mockReport = generateMockReport(concept, fundingCall);
      return NextResponse.json({ success: true, results: [mockReport], isSimulated: true });
    }

    // SCENARIO B: Company-First Matcher (No grant selected, search database first)
    if (!apiKey) {
      console.warn('DEEPSEEK_API_KEY is missing. Executing simulated matcher pipeline.');
      const mockOpportunities = generateMockOpportunities(concept);
      return NextResponse.json({ success: true, results: mockOpportunities, isSimulated: true });
    }

    // Step 2: Generate optimized search keywords based on the project details
    const keywordsPrompt = `You are a professional grant analyst. Review this company/project concept:
Description: "${concept}"
${crawledText ? `Scraped Website Text: "${crawledText}"` : ''}

Generate a space-separated search query containing 3-4 optimized English keywords for searching the European Commission's Funding and Tenders Database. Focus on technical domains, sectors, or challenges (e.g. "artificial intelligence energy grid" or "circular economy waste packaging"). 
Output ONLY the raw string of space-separated keywords. Do NOT wrap in quotes, formatting, or markdown.`;

    const keywordResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: keywordsPrompt }],
        temperature: 0.1
      })
    });

    let searchKeywords = 'sustainability tech';
    if (keywordResponse.ok) {
      const kwData = await keywordResponse.json();
      const kwContent = kwData.choices?.[0]?.message?.content;
      if (kwContent) {
        searchKeywords = kwContent.trim().replace(/['"\[\]]/g, '');
      }
    }
    console.log(`Generated EU database search terms: "${searchKeywords}"`);

    // Step 3: Query the EU Funding and Tenders Portal Search API
    const searchUrl = new URL('https://api.tech.ec.europa.eu/search-api/prod/rest/search');
    searchUrl.searchParams.set('apiKey', 'SEDIA');
    searchUrl.searchParams.set('text', searchKeywords);
    searchUrl.searchParams.set('pageSize', '4'); // Top 4 matches
    searchUrl.searchParams.set('pageNumber', '1');

    const searchFieldsQuery = {
      bool: {
        must: [
          { terms: { type: ['1'] } }, // Grants only
          { terms: { status: ['31094501', '31094502'] } } // Open & Forthcoming
        ]
      }
    };

    const formData = new FormData();
    const queryBlob = new Blob([JSON.stringify(searchFieldsQuery)], { type: 'application/json' });
    const languagesBlob = new Blob([JSON.stringify(['en'])], { type: 'application/json' });
    const sortBlob = new Blob([JSON.stringify({ order: 'DESC', field: 'startDate' })], { type: 'application/json' });

    formData.append('query', queryBlob);
    formData.append('languages', languagesBlob);
    formData.append('sort', sortBlob);

    const searchResponse = await fetch(searchUrl.toString(), {
      method: 'POST',
      body: formData,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!searchResponse.ok) {
      throw new Error(`EU Search API returned status ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    const searchResults = searchData.results || [];

    if (searchResults.length === 0) {
      console.warn('No active EU grants matched search terms. Returning simulated results.');
      const mockOpportunities = generateMockOpportunities(concept);
      return NextResponse.json({ success: true, results: mockOpportunities, isSimulated: true });
    }

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
      };
    }

    // Step 4: Batch score all retrieved grants using LLM
    const grantsForLLM = searchResults.map((item: SediaResult) => {
      const meta = item.metadata || {};
      return {
        id: item.reference || meta.identifier?.[0] || 'Unknown',
        title: meta.title?.[0] || 'Untitled Call',
        description: meta.description?.[0] || '',
        programme: meta.frameworkProgramme?.[0] || 'EU Funding',
        url: meta.esST_URL?.[0] || item.url || '',
        startDate: meta.startDate?.[0] || '',
        endDate: meta.esDA_endDate?.[0] || ''
      };
    });

    const scorePrompt = `You are a senior European venture analyst matching startups with EU funding.
Company Concept: "${concept}"
${crawledText ? `Company Website Content: "${crawledText}"` : ''}

Review the following 4 grant opportunities. For each grant, evaluate their eligibility and match potential.
${JSON.stringify(grantsForLLM, null, 2)}

Produce a JSON array of objects matching the original grants. You MUST return exactly 4 objects inside a JSON array. Each object MUST strictly follow this JSON schema:
{
  "id": "original_grant_id",
  "title": "original_grant_title",
  "programme": "original_grant_programme",
  "url": "original_grant_url",
  "startDate": "original_grant_start_date",
  "endDate": "original_grant_end_date",
  "relevanceScore": 85, // Integer between 0 and 100 representing eligibility matching chance
  "summary": "1-2 sentence alignment summary of this specific grant.",
  "keyAlignment": ["Point 1 of how this concept matches the grant's goals", "Point 2..."],
  "keyBottlenecks": ["Hurdle 1 (e.g. requires consortium of 3 countries, SMEs only, etc.)", "Hurdle 2..."]
}

Output ONLY the raw JSON array string. Do NOT include markdown styling, \`\`\`json blocks, or trailing text.`;

    const scoreResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: scorePrompt }],
        response_format: { type: 'json_object' },
        temperature: 0.1
      })
    });

    if (!scoreResponse.ok) {
      const errText = await scoreResponse.text();
      console.error('DeepSeek batch scoring error:', errText);
      const mockOpportunities = generateMockOpportunities(concept);
      return NextResponse.json({ success: true, results: mockOpportunities, isSimulated: true });
    }

    const scoreData = await scoreResponse.json();
    const scoreContent = scoreData.choices?.[0]?.message?.content;
    
    if (!scoreContent) {
      throw new Error('Empty scoring content returned from LLM.');
    }

    let parsedScores = JSON.parse(scoreContent);
    if (!Array.isArray(parsedScores) && parsedScores.results) {
      parsedScores = parsedScores.results;
    }

    if (Array.isArray(parsedScores)) {
      parsedScores.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      return NextResponse.json({ success: true, results: parsedScores, isSimulated: false });
    }

    throw new Error('LLM did not return a valid array of scored matches.');
  } catch (err: unknown) {
    console.error('Error in funding match route:', err);
    const mockOpportunities = generateMockOpportunities(conceptStr);
    return NextResponse.json({ success: true, results: mockOpportunities, isSimulated: true });
  }
}

interface MatchOpportunity {
  id: string;
  title: string;
  programme: string;
  url: string;
  startDate: string;
  endDate: string;
  relevanceScore: number;
  summary: string;
  keyAlignment: string[];
  keyBottlenecks: string[];
}

interface MatchFundingCall {
  title: string;
  identifier?: string;
  description?: string;
  programme?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
}

function generateMockReport(concept: string, fundingCall: MatchFundingCall): MatchOpportunity {
  const score = Math.floor(Math.random() * 30) + 65; // 65-95
  return {
    id: fundingCall.identifier || 'Unknown',
    title: fundingCall.title,
    programme: fundingCall.programme || 'EU Funding',
    url: fundingCall.url || '',
    startDate: fundingCall.startDate || '',
    endDate: fundingCall.endDate || '',
    relevanceScore: score,
    summary: `Your venture idea focusing on "${concept.slice(0, 50)}..." shows strong conceptual alignment with the objectives of "${fundingCall.title}".`,
    keyAlignment: [
      `The technology proposal addresses the primary challenge of the "${fundingCall.programme || 'EU'}" work programme.`,
      `Leveraging digital solutions supports the European transition towards automated compliance and data intelligence.`
    ],
    keyBottlenecks: [
      "Most Horizon Europe calls require a consortium of at least three legal entities from three different member states.",
      "Requires detailed technical architecture specifications and work package definitions."
    ]
  };
}

function generateMockOpportunities(concept: string): MatchOpportunity[] {
  const isEsg = concept.toLowerCase().includes('esg') || concept.toLowerCase().includes('carbon') || concept.toLowerCase().includes('sustain');
  
  return [
    {
      id: 'HORIZON-CL6-2027-CLIMATE-01',
      title: isEsg 
        ? 'Innovative digital solutions for carbon accounting and double materiality in SMEs'
        : 'Demonstration of decentralized cloud analytics and AI structures for site safety',
      programme: 'Horizon Europe (HORIZON)',
      url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/HORIZON-CL6-2027-CLIMATE-01',
      startDate: '2026-06-15T00:00:00.000+0200',
      endDate: '2027-01-20T17:00:00.000+0200',
      relevanceScore: 92,
      summary: `Your venture idea focusing on tech validation is a direct fit for Horizon's digitisation and green transition objectives.`,
      keyAlignment: [
        'Matches the primary criteria of piloting tech innovations in local European SME environments.',
        'Supports the European Union mandate for automated reporting compliance.'
      ],
      keyBottlenecks: [
        'Requires a consortium of at least three independent legal entities from three different member states.',
        'High competition rate: typically requires highly detailed work packages.'
      ]
    },
    {
      id: 'LIFE-2026-SAP-ENV-GOV',
      title: isEsg
        ? 'Environmental governance information structures for corporate Scope 3 auditing'
        : 'Digital tools for safety optimization and multilingual crew coordination in logistics',
      programme: 'Programme for the Environment and Climate Action (LIFE)',
      url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/LIFE-2026-SAP-ENV-GOV',
      startDate: '2026-05-01T00:00:00.000+0200',
      endDate: '2026-11-15T17:00:00.000+0100',
      relevanceScore: 84,
      summary: `The LIFE program provides support for close-to-market solutions that reduce environmental friction and scale governance reporting.`,
      keyAlignment: [
        'Directly supports the voluntary SME disclosure guidelines.',
        'Enables transparent data collection workflows.'
      ],
      keyBottlenecks: [
        'Funding is capped at a 60% co-funding rate, meaning the venture must secure the remaining 40% capital.',
        'Requires clear, measurable key performance indicators (KPIs) regarding emissions reduction.'
      ]
    },
    {
      id: 'DIGITAL-2027-CLOUD-AI-03',
      title: 'Deploying secure, low-latency edge AI engines for industrial sector coordination',
      programme: 'Digital Europe Programme (DIGITAL)',
      url: 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/DIGITAL-2027-CLOUD-AI-03',
      startDate: '2026-09-10T00:00:00.000+0200',
      endDate: '2027-03-05T17:00:00.000+0100',
      relevanceScore: 78,
      summary: `Supports the scaling of European data spaces and AI-driven automation infrastructures.`,
      keyAlignment: [
        'Promotes edge deployment of secure LLM algorithms.',
        'Encourages cross-sector interoperability.'
      ],
      keyBottlenecks: [
        'SMEs must prove high technology readiness level (TRL 6-8).',
        'Consortium structures are highly recommended.'
      ]
    }
  ];
}
