export interface Venture {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  status: 'Live' | 'Development' | 'Archived';
  url?: string;
  metrics?: { label: string; value: string }[];
  tags: string[];
  highlights?: string[];
  type: 'active' | 'past';
}

export const activeVentures: Venture[] = [
  {
    slug: 'executesg',
    name: 'ExecutESG',
    tagline: 'AI-powered ESG Operating System for European SMEs',
    description:
      'ExecutESG is a Finnish SaaS platform that empowers European companies to navigate sustainability compliance with confidence. Featuring an AI-driven Double Materiality Assessment (DMA), VSME sustainability reporting wizard, GHG emissions calculator (Scope 1/2/3), and XBRL-compliant regulatory reporting — all built to make CSRD compliance accessible, not painful.',
    role: 'Co-founder & CTO',
    status: 'Live',
    url: 'https://executesg.com',
    metrics: [
      { label: 'Generated Revenue', value: '€45K+' },
      { label: 'Paid Clients', value: '4+ B2B Clients' },
      { label: 'Client Impact', value: '50%+ Time Saved' },
    ],
    tags: ['SaaS', 'AI', 'ESG', 'CSRD', 'Laravel', 'Livewire'],
    highlights: [
      'Currently in Northern Light Accelerator (Batch 2)',
      'Client testimonial: "Saves more than 50% time and tens of thousands of EUR" — Veljekset Toivanen',
      'Full-stack platform: DMA engine, VSME wizard, GHG calculator, XBRL reporting',
    ],
    type: 'active',
  },
  {
    slug: 'onton',
    name: 'ONTON',
    tagline: 'TON blockchain event management — the biggest SBT distributor on TON',
    description:
      'ONTON is an AI-powered event management platform built as a Telegram Mini-App on the TON blockchain. It enables organizers worldwide to create, manage, and reward event participation with soulbound NFTs. At its peak, ONTON was the single largest SBT distributor across the entire TON ecosystem.',
    role: 'Developer & Shareholder',
    status: 'Live',
    url: 'https://onton.live',
    metrics: [
      { label: 'Peak MAU', value: '300K' },
      { label: 'Events Hosted', value: '3,000+' },
      { label: 'SBTs Distributed', value: '12.5M' },
      { label: 'Organizers', value: '300+' },
    ],
    tags: ['Web3', 'TON', 'Telegram Mini-App', 'NFT', 'Next.js'],
    highlights: [
      '300K monthly active users at peak',
      'Biggest soulbound NFT distributor on the entire TON ecosystem',
      'Launched Genesis Onions NFT collection and $ONION token on Ston.fi DEX',
    ],
    type: 'active',
  },
  {
    slug: 'sitetalk',
    name: 'SiteTalk',
    tagline: 'Real-time AI translation for construction sites',
    description:
      'SiteTalk bridges language barriers on construction sites with real-time AI-powered translation. Built as a mobile-first iOS app, it enables supervisors and workers speaking different languages to communicate instantly and clearly — improving safety, efficiency, and collaboration on the job site.',
    role: 'Builder',
    status: 'Development',
    url: undefined,
    metrics: [
      { label: 'Target Client', value: 'SRV Group' },
      { label: 'Platform', value: 'iOS (Capacitor)' },
    ],
    tags: ['AI', 'Mobile', 'Construction', 'Google GenAI', 'React'],
    highlights: [
      'Currently being offered to SRV Group (Finland)',
      'Real-time speech translation using Google Generative AI',
      'Field-ready UI designed for active construction environments',
    ],
    type: 'active',
  },
  {
    slug: 'skinscope',
    name: 'SkinScope',
    tagline: 'CS2 skin trading platform with automated limit orders',
    description:
      'SkinScope revolutionizes CS2 skin trading with an advanced Limit Order system. Traders set desired buy or sell prices and let the automated system execute trades 24/7 across multiple marketplaces. With real-time market analysis, multi-marketplace integration, and enterprise-grade security.',
    role: 'Builder',
    status: 'Live',
    url: 'https://skinscope.online',
    metrics: [
      { label: 'Active Traders', value: '1,000+' },
      { label: 'Trades Completed', value: '50,000+' },
      { label: 'Success Rate', value: '99.9%' },
    ],
    tags: ['Trading', 'Automation', 'Full-Stack', 'Real-time'],
    highlights: [
      'Automated 24/7 trade execution across multiple marketplaces',
      'Advanced limit order system with conditional triggers',
      'Real-time market analysis and price tracking',
    ],
    type: 'active',
  },
  {
    slug: 'challenquiz',
    name: 'ChallenQuiz',
    tagline: 'Competitive online trivia and quiz challenges',
    description:
      'ChallenQuiz is a gamified learning and quiz challenge platform built as a Telegram Mini-App. Users compete in real-time trivia games, climb leaderboards, and test their knowledge across various categories. Designed for engagement and repeat play.',
    role: 'Builder',
    status: 'Archived',
    url: 'https://challenquiz.online',
    tags: ['Gaming', 'Quiz', 'Telegram', 'Real-time'],
    highlights: [
      'Real-time competitive quiz platform',
      'Gamified leaderboard and challenge system',
      'Built as a Telegram Mini-App for instant access',
    ],
    type: 'active',
  },
  {
    slug: 'byblos',
    name: 'Byblos',
    tagline: 'VC newsletter aggregator with personalized feed',
    description:
      'Byblos.digital aggregates Venture Capital newsletters into a single, curated reading experience. The "My Feed" algorithm personalizes content based on user interests, surfacing the most relevant VC insights, deal flow updates, and industry analysis.',
    role: 'Builder',
    status: 'Live',
    url: 'https://byblos.digital',
    tags: ['Content', 'Laravel', 'Livewire', 'SaaS'],
    highlights: [
      'Automated aggregation of VC newsletter content',
      'Personalized "My Feed" algorithm',
      'Clean reading experience optimized for busy investors',
    ],
    type: 'active',
  },
];

export const pastVentures: Venture[] = [
  {
    slug: 'hrcando',
    name: 'HRCando',
    tagline: 'Leading Applicant Tracking System in Iran',
    description:
      'HRCando (Kandoo) became the leading HR software platform in Iran, offering comprehensive employee training management and a full Applicant Tracking System with integration to 30,000+ hours of learning content.',
    role: 'Co-founder (Exited)',
    status: 'Archived',
    url: 'https://hrcando.ir',
    tags: ['HR Tech', 'ATS', 'Enterprise', 'SaaS'],
    type: 'past',
  },
  {
    slug: 'tafarda',
    name: 'TaFarda Studio',
    tagline: 'Startup studio for Iran\'s largest auto-parts manufacturer',
    description:
      'TaFarda Studio was a venture studio focused on innovation within Iran\'s biggest auto-part manufacturing group. The studio team handled marketing, branding, and product development for portfolio companies.',
    role: 'Co-founder (Exited)',
    status: 'Archived',
    url: 'https://tafarda.studio',
    tags: ['Venture Studio', 'Manufacturing', 'Innovation'],
    type: 'past',
  },
  {
    slug: 'dadpardaz',
    name: 'DadPardaz',
    tagline: 'Legal marketplace connecting clients with lawyers',
    description:
      'DadPardaz bridged the gap between individuals and legal professionals with an online service marketplace, secure escrow payments, and professional profiles — simplifying access to legal services.',
    role: 'Co-founder',
    status: 'Archived',
    url: 'https://dadpardaz.com',
    tags: ['LegalTech', 'Marketplace', 'Escrow'],
    type: 'past',
  },
  {
    slug: 'bemehrbani',
    name: 'Bemehrbani',
    tagline: 'Online charity platform preventing student dropouts',
    description:
      'Bemehrbani.com connects sponsors with talented students in need, preventing dropouts due to financial hardship. Launched in 2014 by the Darolekram charity institute, the platform facilitates transparent, direct support.',
    role: 'Co-founder',
    status: 'Archived',
    url: 'https://bemehrbani.com',
    tags: ['Social Impact', 'Charity', 'Crowdfunding'],
    type: 'past',
  },
  {
    slug: 'mehrbaran',
    name: 'Mehrbaran',
    tagline: 'Cultural charity festival platform',
    description:
      'Mehrbaran organized student and cultural events promoting charity and community support through virtual and physical festival coordination.',
    role: 'Co-founder',
    status: 'Archived',
    url: 'https://mehrbaran.org',
    tags: ['Non-Profit', 'Events', 'Cultural'],
    type: 'past',
  },
];

export const allVentures = [...activeVentures, ...pastVentures];

export function getVentureBySlug(slug: string): Venture | undefined {
  return allVentures.find((v) => v.slug === slug);
}
