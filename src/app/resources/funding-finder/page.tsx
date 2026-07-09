'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Search as SearchIcon,
  Cpu, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  Mail,
  Send,
  ArrowLeft,
  X,
  HelpCircle
} from 'lucide-react';
import styles from './page.module.css';

interface FundingOpportunity {
  id: string;
  title: string;
  description: string;
  programme: string;
  identifier: string;
  url: string;
  startDate: string;
  endDate: string;
  status: string;
  typesOfAction: string[];
}

interface ScoredOpportunity {
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

export default function FundingFinderPage() {
  const router = useRouter();

  // Tab Control: 'search' | 'ai-match' | 'nordic'
  const [activeTab, setActiveTab] = useState<'search' | 'ai-match' | 'nordic'>('search');

  // Search states
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState({
    open: true,
    forthcoming: true,
  });
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [errorSearch, setErrorSearch] = useState('');

  // AI Matcher input states
  const [concept, setConcept] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedGrant, setSelectedGrant] = useState<FundingOpportunity | null>(null);
  
  // Match pipeline states
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); // 1: crawling, 2: searching, 3: scoring
  const [matchResults, setMatchResults] = useState<ScoredOpportunity[]>([]);
  const [isSimulated, setIsSimulated] = useState(false);
  const [errorMatch, setErrorMatch] = useState('');

  // Email lead capture states
  const [email, setEmail] = useState('');
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');

  // Pre-load default calls on mount
  useEffect(() => {
    fetchOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOpportunities = async (searchPage = 1) => {
    setLoadingSearch(true);
    setErrorSearch('');
    
    const statusCodes = [];
    if (statusFilter.open) statusCodes.push('31094501');
    if (statusFilter.forthcoming) statusCodes.push('31094502');

    if (statusCodes.length === 0) {
      setOpportunities([]);
      setTotalResults(0);
      setLoadingSearch(false);
      return;
    }

    try {
      const res = await fetch('/api/funding/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: keyword || '***',
          pageNumber: searchPage,
          pageSize: 10,
          status: statusCodes
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOpportunities(data.results);
        setTotalResults(data.totalResults);
        setPage(searchPage);
      } else {
        setErrorSearch(data.error || 'Failed to retrieve funding opportunities.');
      }
    } catch (err) {
      console.error(err);
      setErrorSearch('Failed to connect to the search service.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOpportunities(1);
  };

  const handleMatchSelect = (grant: FundingOpportunity) => {
    setSelectedGrant(grant);
    setMatchResults([]); // Clear previous matching results to show the form
    setActiveTab('ai-match');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Run the match pipeline
  const handleAnalyzeMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept) {
      setErrorMatch('Please describe your product or startup concept.');
      return;
    }

    setLoadingMatch(true);
    setErrorMatch('');
    setMatchResults([]);
    setSubmittedEmail(false);
    setEmail('');
    
    // Animate loading steps
    setLoadingStep(1);
    const step2Timer = setTimeout(() => setLoadingStep(2), 1500);
    const step3Timer = setTimeout(() => setLoadingStep(3), 3200);

    try {
      const payload: { concept: string; fundingCall?: FundingOpportunity | null; website?: string } = { concept };
      if (selectedGrant) {
        payload.fundingCall = selectedGrant;
      } else if (website) {
        payload.website = website;
      }

      const res = await fetch('/api/funding/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMatchResults(data.results);
        setIsSimulated(!!data.isSimulated);
      } else {
        setErrorMatch(data.error || 'Failed to analyze matching eligibility.');
      }
    } catch (err) {
      console.error(err);
      setErrorMatch('Connection timeout while generating the AI report.');
    } finally {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setLoadingMatch(false);
      setLoadingStep(0);
    }
  };

  // Submit email lead capture
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmittingEmail(true);
    setErrorEmail('');

    try {
      const res = await fetch('/api/funding/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          concept,
          results: matchResults
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedEmail(true);
      } else {
        setErrorEmail(data.error || 'Failed to submit email.');
      }
    } catch (err) {
      console.error(err);
      setErrorEmail('Failed to send email. Please check connectivity.');
    } finally {
      setSubmittingEmail(false);
    }
  };

  const handleResetMatch = () => {
    setMatchResults([]);
    setErrorMatch('');
    setSubmittedEmail(false);
    setEmail('');
  };

  const handleCoBuildRedirect = (grant: ScoredOpportunity) => {
    let url = '/co-build?source=funding-finder';
    url += `&grantId=${encodeURIComponent(grant.id)}`;
    url += `&grantTitle=${encodeURIComponent(grant.title)}`;
    if (concept) url += `&concept=${encodeURIComponent(concept)}`;
    if (website) url += `&domain=${encodeURIComponent(website)}`;
    router.push(url);
  };

  const nordicFundings = [
    {
      org: 'Business Finland',
      title: 'Tempo Funding',
      amount: 'Up to €80,000',
      description: 'Designed for startups and SMEs to test their business concept, conduct market research, and validate demand in international markets. Crucially, Business Finland provides 75% of the project budget (as a grant, not a loan).',
      criteria: [
        'Registered limited company (Oy) in Finland',
        'Innovative product idea with international potential',
        'At least 2 full-time team members based in Finland',
        'Secured funding of at least €30,000 (equity/loans)'
      ]
    },
    {
      org: 'Business Finland',
      title: 'Research & Development Funding',
      amount: '50% Grant / Loan',
      description: 'Funding for companies of all sizes conducting challenging R&D projects that create new technological capabilities or services. Typically covers employee salaries, purchased services, and testing environments.',
      criteria: [
        'Project aims to solve complex technological bottlenecks',
        'High competitive advantage in global markets',
        'Finnish-registered company Oy',
        'Funding structured as combination of grants & low-interest loans'
      ]
    },
    {
      org: 'ELY-Keskus',
      title: 'Business Development Aid',
      amount: 'Up to 50% funding',
      description: 'Regional development funding for SMEs starting projects that significantly change operational status, launch new product lines, or drive digital transitions. Very active in rural and regional Finnish municipalities.',
      criteria: [
        'Viable business model with local employment potential',
        'Project creates significant regional economic value',
        'Co-funding capacity must be proven',
        'Strong ESG or green-transition focus is highly favored'
      ]
    }
  ];

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={`container ${styles.container}`}>
          <div className={styles.header}>
            <div className="section-label">Founder Tools</div>
            <h1>EU Funding Finder & AI Matcher</h1>
            <p>
              Search official European Commission grant opportunities or enter your venture details 
              to receive custom AI relevance scoring, eligibility reviews, and matching analyses.
            </p>
          </div>

          {/* Tab Selector */}
          <div className={styles.tabs}>
            <button 
              onClick={() => setActiveTab('search')} 
              className={`${styles.tabButton} ${activeTab === 'search' ? styles.activeTab : ''}`}
            >
              Search Opportunities
            </button>
            <button 
              onClick={() => setActiveTab('ai-match')} 
              className={`${styles.tabButton} ${activeTab === 'ai-match' ? styles.activeTab : ''}`}
            >
              AI Eligibility Matcher
            </button>
            <button 
              onClick={() => setActiveTab('nordic')} 
              className={`${styles.tabButton} ${activeTab === 'nordic' ? styles.activeTab : ''}`}
            >
              Nordic Soft Funding (Finland)
            </button>
          </div>

          {/* TAB 1: Search Opportunities */}
          {activeTab === 'search' && (
            <div className={styles.searchWrapper}>
              {/* Sidebar Filters */}
              <aside className={styles.filtersPanel}>
                <div className={styles.filterGroup}>
                  <h3>Topic Status</h3>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={statusFilter.open} 
                      onChange={(e) => setStatusFilter(prev => ({ ...prev, open: e.target.checked }))}
                    />
                    Open
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={statusFilter.forthcoming} 
                      onChange={(e) => setStatusFilter(prev => ({ ...prev, forthcoming: e.target.checked }))}
                    />
                    Forthcoming
                  </label>
                </div>
                
                <div className={styles.filterGroup}>
                  <h3>Target Profile</h3>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    Startups & SMEs
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    Research Entities
                  </label>
                </div>

                <button 
                  onClick={() => fetchOpportunities(1)} 
                  className="btn btn-outline" 
                  style={{ width: '100%', marginTop: '10px', padding: '10px 0' }}
                >
                  Apply Filters
                </button>
              </aside>

              {/* Search Results Area */}
              <div className={styles.searchContent}>
                <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                  <SearchIcon size={20} className={styles.searchIcon} />
                  <input 
                    type="text" 
                    placeholder="Search keywords e.g. climate, AI, circular economy, logistics..." 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className={styles.searchInput}
                  />
                  <button type="submit" className={`btn btn-primary ${styles.searchButton}`}>
                    Search
                  </button>
                </form>

                {errorSearch && <div className="error-banner">{errorSearch}</div>}

                <div className={styles.resultsHeader}>
                  <div className={styles.resultsCount}>
                    {loadingSearch ? 'Searching...' : `Found ${totalResults} grant opportunities`}
                  </div>
                </div>

                {loadingSearch ? (
                  <div className={styles.loadingState}>
                    <div className={styles.spinner} />
                    <p>Querying the European Commission database...</p>
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className={styles.emptyState}>
                    <HelpCircle size={48} />
                    <h3>No Opportunities Found</h3>
                    <p>Try broadening your keywords or updating the status filters.</p>
                  </div>
                ) : (
                  <div className={styles.resultsGrid}>
                    {opportunities.map((item) => (
                      <article key={item.id} className={styles.grantCard}>
                        <div className={styles.grantHeader}>
                          <span className={styles.programmeBadge}>
                            {item.programme}
                          </span>
                          <span className={`${styles.statusBadge} ${item.status === 'Open' ? styles.statusOpen : styles.statusForthcoming}`}>
                            {item.status}
                          </span>
                        </div>
                        <h3>{item.title}</h3>
                        <div className={styles.grantIdentifier}>ID: {item.identifier}</div>
                        <p className={styles.grantDescription}>{item.description}</p>
                        
                        <div className={styles.grantFooter}>
                          <div className={styles.grantDates}>
                            {item.startDate && `Starts: ${new Date(item.startDate).toLocaleDateString()}`}
                            {item.endDate && ` | Deadline: ${new Date(item.endDate).toLocaleDateString()}`}
                          </div>
                          <div className={styles.grantActions}>
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="btn btn-outline btn-sm"
                              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                            >
                              Official Portal <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                            </a>
                            <button 
                              onClick={() => handleMatchSelect(item)}
                              className={`btn btn-primary ${styles.cardActionBtn}`}
                            >
                              Match with AI <Cpu size={14} style={{ marginLeft: '4px' }} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}

                    {/* Pagination */}
                    {totalResults > 10 && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                        <button 
                          disabled={page === 1} 
                          onClick={() => fetchOpportunities(page - 1)} 
                          className="btn btn-outline"
                          style={{ padding: '8px 20px' }}
                        >
                          Previous
                        </button>
                        <span style={{ alignSelf: 'center', fontWeight: 600 }}>Page {page}</span>
                        <button 
                          disabled={page * 10 >= totalResults} 
                          onClick={() => fetchOpportunities(page + 1)} 
                          className="btn btn-outline"
                          style={{ padding: '8px 20px' }}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AI Eligibility Matcher */}
          {activeTab === 'ai-match' && (
            <div style={{ width: '100%' }}>
              {/* Form Input State */}
              {matchResults.length === 0 && !loadingMatch && (
                <div className={styles.formContainer}>
                  <div className={styles.formIntro}>
                    <h2>Venture Matcher & Scanner</h2>
                    <p>
                      {selectedGrant 
                        ? 'Evaluate your venture concept against the pre-selected grant opportunity.' 
                        : 'Enter your venture details. Our AI will scan the database and match the best grants.'}
                    </p>
                  </div>
                  
                  {errorMatch && <div className={styles.errorBanner}>{errorMatch}</div>}

                  <form onSubmit={handleAnalyzeMatch} className={styles.interactiveForm}>
                    {/* Selected Grant Target Header */}
                    <div className={styles.formGroup}>
                      <label>Target Funding Opportunity</label>
                      {selectedGrant ? (
                        <div className={styles.selectedGrantCallout}>
                          <div className={styles.selectedGrantInfo}>
                            <h4>{selectedGrant.title}</h4>
                            <p>{selectedGrant.identifier} ({selectedGrant.programme})</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setSelectedGrant(null)} 
                            className={styles.clearGrantBtn}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.selectedGrantCallout} style={{ background: 'var(--color-background)', borderStyle: 'dashed' }}>
                          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                            No specific grant pre-selected. We will run a **database-wide scan** using your keywords.
                          </p>
                        </div>
                      )}
                    </div>

                    {!selectedGrant && (
                      <div className={styles.formGroup}>
                        <label htmlFor="websiteInput">Company Website URL (Optional)</label>
                        <input 
                          type="url" 
                          id="websiteInput" 
                          placeholder="https://yourstartup.com" 
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className={styles.inputField}
                        />
                        <p className={styles.fieldNote}>If provided, our AI reads details from your site to optimize alignment.</p>
                      </div>
                    )}

                    <div className={styles.formGroup}>
                      <label htmlFor="conceptInput">Describe your startup or project idea (Mandatory)</label>
                      <textarea 
                        id="conceptInput" 
                        rows={6}
                        placeholder="Detail your product concept: What manual process are you automating? What is the core technology? (e.g. 'Building an edge-AI software to track Scope 3 emissions for forestry SMEs')."
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        required
                        className={styles.textareaField}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'center', gap: '8px' }}>
                      {selectedGrant ? 'Analyze Specific Eligibility' : 'Scan for Matching Grants'} <Sparkles size={16} />
                    </button>
                  </form>
                </div>
              )}

              {/* Loading State */}
              {loadingMatch && (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner} />
                  <h2>Scanning & Analysing...</h2>
                  <div className={styles.loadingSteps}>
                    <div className={`${styles.loadingStep} ${loadingStep >= 1 ? styles.stepActive : ''}`}>
                      <CheckCircle size={16} className={styles.stepCheckIcon} />
                      <span>{website ? `Reading website details from ${website}...` : 'Analyzing venture description concept...'}</span>
                    </div>
                    <div className={`${styles.loadingStep} ${loadingStep >= 2 ? styles.stepActive : ''}`}>
                      <CheckCircle size={16} className={styles.stepCheckIcon} />
                      <span>{selectedGrant ? `Retrieving specifications for "${selectedGrant.title.slice(0, 40)}..."` : 'Generating query terms and scanning the EC Opportunities database...'}</span>
                    </div>
                    <div className={`${styles.loadingStep} ${loadingStep >= 3 ? styles.stepActive : ''}`}>
                      <CheckCircle size={16} className={styles.stepCheckIcon} />
                      <span>Calculating matching scores and compiling alignment reports...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Scored Results State */}
              {matchResults.length > 0 && !loadingMatch && (
                <div className={styles.resultsContainer}>
                  <div className={styles.resultsHeader}>
                    <button onClick={handleResetMatch} className={styles.backButton}>
                      <ArrowLeft size={16} /> Edit Details
                    </button>
                    <h2>
                      {selectedGrant 
                        ? 'Specific Grant Match Report' 
                        : 'Custom Scored Opportunities'}
                    </h2>
                    <p>Based on your project: <em>&ldquo;{concept.slice(0, 120)}...&rdquo;</em></p>
                    {isSimulated && (
                      <p className={styles.simulatedAlert}>
                        Note: Live database query fallback active. Displaying highly optimized matched opportunities.
                      </p>
                    )}
                  </div>

                  <div className={styles.resultsList}>
                    {matchResults.map((grant) => (
                      <article key={grant.id} className={styles.resultCard}>
                        <div className={styles.resultMain}>
                          <div className={styles.resultHeading}>
                            <span className={styles.resultProgramme}>{grant.programme}</span>
                            <div className={styles.scorePill}>
                              <Cpu size={14} />
                              <span>{grant.relevanceScore}% Match Chance</span>
                            </div>
                          </div>
                          <h3>{grant.title}</h3>
                          <div className={styles.grantId}>ID: {grant.id}</div>
                          <p className={styles.resultSummary}>{grant.summary}</p>

                          <div className={styles.expansionGrid}>
                            <div className={styles.expansionCol}>
                              <h4><CheckCircle size={14} color="#059669" /> Why You Align</h4>
                              <ul>
                                {grant.keyAlignment.map((pt, i) => <li key={i}>{pt}</li>)}
                              </ul>
                            </div>
                            <div className={styles.expansionCol}>
                              <h4><AlertTriangle size={14} color="#F5A623" /> Hurdles & Requirements</h4>
                              <ul>
                                {grant.keyBottlenecks.map((pt, i) => <li key={i}>{pt}</li>)}
                              </ul>
                            </div>
                          </div>

                          <div className={styles.resultFooter}>
                            <div className={styles.grantDates}>
                              {grant.startDate && `Starts: ${new Date(grant.startDate).toLocaleDateString()}`}
                              {grant.endDate && ` | Deadline: ${new Date(grant.endDate).toLocaleDateString()}`}
                            </div>
                            <div className={styles.resultActions}>
                              <a href={grant.url} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                                Official Portal <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                              </a>
                              <button onClick={() => handleCoBuildRedirect(grant)} className="btn btn-primary btn-sm" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                                Partner & Apply <ArrowRight size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Lead Capture Section */}
                  <div className={styles.leadCaptureCard}>
                    {submittedEmail ? (
                      <div className={styles.leadSuccess}>
                        <CheckCircle size={40} color="#F5A623" />
                        <h3>Custom Report Emailed!</h3>
                        <p>We have compiled these matched grants, alignments, and recommended co-building action items into a customized document and sent it to <strong>{email}</strong>.</p>
                      </div>
                    ) : (
                      <div className={styles.leadFormWrapper}>
                        <div className={styles.leadHeader}>
                          <Mail size={32} className={styles.leadIcon} />
                          <h3>Email Me this Custom Funding Report (PDF)</h3>
                          <p>Receive a comprehensive offline document containing all matching grants, eligibility details, and a technical proposal architecture roadmap.</p>
                        </div>
                        {errorEmail && <div className={styles.errorBanner}>{errorEmail}</div>}
                        <form onSubmit={handleEmailSubmit} className={styles.leadForm}>
                          <input 
                            type="email" 
                            placeholder="your.email@company.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.leadInput}
                            aria-label="Email address for PDF report"
                          />
                          <button type="submit" disabled={submittingEmail} className="btn btn-primary">
                            {submittingEmail ? (
                              <Loader2 size={16} className="spinner-icon" style={{ animation: 'spin 1s linear infinite' }} />
                            ) : (
                              <>Send PDF <Send size={14} style={{ marginLeft: '4px' }} /></>
                            )}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Nordic Directory */}
          {activeTab === 'nordic' && (
            <div className={styles.nordicGrid}>
              {nordicFundings.map((grant, idx) => (
                <article key={idx} className={styles.nordicCard}>
                  <div>
                    <div className={styles.nordicHeader}>
                      <span className={styles.nordicOrg}>{grant.org}</span>
                      <span className={styles.nordicAmount}>{grant.amount}</span>
                    </div>
                    <h3>{grant.title}</h3>
                    <p>{grant.description}</p>
                    
                    <div className={styles.nordicCriteria}>
                      <h4>Key Requirements:</h4>
                      <ul>
                        {grant.criteria.map((crt, i) => (
                          <li key={i}>
                            <CheckCircle size={14} style={{ color: 'var(--color-secondary)', marginRight: '6px' }} />
                            <span>{crt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={styles.nordicFooter}>
                    <button 
                      onClick={() => {
                        setConcept(`${grant.org} - ${grant.title}: We want to validate our product concept and qualify for this Finnish ecosystem grant.`);
                        setWebsite('https://businessfinland.fi');
                        setSelectedGrant(null);
                        setMatchResults([]);
                        setActiveTab('ai-match');
                      }}
                      className="btn btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Use as Matching Concept <Sparkles size={16} style={{ marginLeft: '6px' }} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
