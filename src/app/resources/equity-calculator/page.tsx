'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Scale, 
  Clock, 
  Coins, 
  User, 
  Lock, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import styles from './page.module.css';

export default function EquityCalculatorPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Founder A (Business / Domain Expert)
  const [founderA, setFounderA] = useState({
    name: 'Founder A (Business)',
    commitment: '1.0', // Full-time
    capital: 5000,
    ip: '1', // Basic idea/mockups
    domainExpertise: '3', // Expert
    roleWeight: '0.4', // Business execution focus
  });

  // Founder B (Technical / Developer)
  const [founderB, setFounderB] = useState({
    name: 'Founder B (Technical)',
    commitment: '1.0', // Full-time
    capital: 0,
    ip: '0', // None
    domainExpertise: '1', // Low
    roleWeight: '0.6', // Engineering execution focus
  });

  // Results State
  const [splitA, setSplitA] = useState(50);
  const [splitB, setSplitB] = useState(50);
  const [pomegroupAlternative, setPomegroupAlternative] = useState({
    expertSplit: 65,
    studioSplit: 35,
  });

  // Vesting Timeline States
  const [vestingYears, setVestingYears] = useState(4);
  const [cliffMonths, setCliffMonths] = useState(12);

  // Lead capture states
  const [email, setEmail] = useState('');
  const [concept, setConcept] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate split based on input attributes
  useEffect(() => {
    // 1. Base values from commitment (weight 40%)
    const commA = parseFloat(founderA.commitment);
    const commB = parseFloat(founderB.commitment);
    const commSum = commA + commB || 1;
    const scoreCommA = (commA / commSum) * 40;
    const scoreCommB = (commB / commSum) * 40;

    // 2. Capital Contributions (weight 15%)
    const capA = founderA.capital;
    const capB = founderB.capital;
    const capSum = capA + capB || 1;
    const scoreCapA = capSum > 1 ? (capA / capSum) * 15 : 7.5;
    const scoreCapB = capSum > 1 ? (capB / capSum) * 15 : 7.5;

    // 3. Intellectual Property (weight 15%)
    const ipValA = parseInt(founderA.ip) * 5; // 0 to 15 max
    const ipValB = parseInt(founderB.ip) * 5;
    const ipSum = ipValA + ipValB || 1;
    const scoreIpA = (ipValA / ipSum) * 15;
    const scoreIpB = (ipValB / ipSum) * 15;

    // 4. Domain Expertise & Network (weight 15%)
    const domValA = parseInt(founderA.domainExpertise) * 5; // 0 to 15 max
    const domValB = parseInt(founderB.domainExpertise) * 5;
    const domSum = domValA + domValB || 1;
    const scoreDomA = (domValA / domSum) * 15;
    const scoreDomB = (domValB / domSum) * 15;

    // 5. Role Weight Execution Value (weight 15%)
    const roleA = parseFloat(founderA.roleWeight);
    const roleB = parseFloat(founderB.roleWeight);
    const roleSum = roleA + roleB || 1;
    const scoreRoleA = (roleA / roleSum) * 15;
    const scoreRoleB = (roleB / roleSum) * 15;

    // Aggregate Scores
    const totalA = scoreCommA + scoreCapA + scoreIpA + scoreDomA + scoreRoleA;
    const totalB = scoreCommB + scoreCapB + scoreIpB + scoreDomB + scoreRoleB;
    const totalSum = totalA + totalB || 1;

    const percentA = Math.round((totalA / totalSum) * 100);
    const percentB = 100 - percentA;

    setSplitA(percentA);
    setSplitB(percentB);

    // Calculate Pomegroup Studio model alternative (Studio takes 35% standard for tech execution, founder keeps 65%)
    setPomegroupAlternative({
      expertSplit: 65,
      studioSplit: 35,
    });
  }, [founderA, founderB]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: founderA.name,
          idea: `Venture Concept: ${concept} | Calculated Equity: ${splitA}% Business / ${splitB}% Technical | Vesting: ${vestingYears}yr with ${cliffMonths}mo cliff`,
          role: 'Equity Calculator Lead',
          traction: 'Calculated co-founder equity splits'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <button onClick={() => router.push('/resources')} className={styles.backButton}>
            <ArrowLeft size={16} /> Back to Hub
          </button>

          <div className={styles.header}>
            <div className="section-label">Interactive Tool</div>
            <h1>Co-Founder Equity Split Calculator</h1>
            <p>
              Avoid co-founder disputes by evaluating your contributions objectively. 
              Determine a fair, vesting-backed equity split using standard startup frameworks.
            </p>
          </div>

          <div className={styles.card}>
            {/* Steps Progress */}
            <div className={styles.stepsContainer}>
              <div className={styles.stepLineActive} style={{ width: `${(step - 1) * 50}%` }} />
              <div className={`${styles.stepDot} ${step >= 1 ? (step > 1 ? styles.stepDotCompleted : styles.stepDotActive) : ''}`}>
                1
                <span className={styles.stepLabel}>Commitment</span>
              </div>
              <div className={`${styles.stepDot} ${step >= 2 ? (step > 2 ? styles.stepDotCompleted : styles.stepDotActive) : ''}`}>
                2
                <span className={styles.stepLabel}>Contributions</span>
              </div>
              <div className={`${styles.stepDot} ${step >= 3 ? styles.stepDotActive : ''}`}>
                3
                <span className={styles.stepLabel}>Results</span>
              </div>
            </div>

            {/* STEP 1: COMMITMENT & CAPITAL */}
            {step === 1 && (
              <div>
                <h2 className={styles.sectionTitle}>
                  <Clock size={22} style={{ color: 'var(--color-primary)' }} />
                  Step 1: Commitment &amp; Risk Valuation
                </h2>

                <div className={styles.grid}>
                  {/* Founder A Column */}
                  <div className={`${styles.founderColumn} ${styles.founderColumnActive}`}>
                    <h3>Founder A (Business / Sales)</h3>
                    
                    <div className={styles.fieldGroup}>
                      <label htmlFor="fa-name">Founder Name or Role</label>
                      <input 
                        type="text" 
                        id="fa-name"
                        className={styles.textInput}
                        value={founderA.name}
                        onChange={(e) => setFounderA({ ...founderA, name: e.target.value })}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="fa-commitment">Time Commitment</label>
                      <select 
                        id="fa-commitment"
                        className={styles.selectInput}
                        value={founderA.commitment}
                        onChange={(e) => setFounderA({ ...founderA, commitment: e.target.value })}
                      >
                        <option value="1.0">Full-time (100% focused)</option>
                        <option value="0.5">Part-time (Transitioning / Nights)</option>
                        <option value="0.2">Advisor / Strategic Ad-hoc</option>
                      </select>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="fa-capital">Initial Capital Contributed (€)</label>
                      <input 
                        type="number" 
                        id="fa-capital"
                        className={styles.textInput}
                        min="0"
                        step="500"
                        value={founderA.capital}
                        onChange={(e) => setFounderA({ ...founderA, capital: Math.max(0, parseInt(e.target.value) || 0) })}
                      />
                    </div>
                  </div>

                  {/* Founder B Column */}
                  <div className={styles.founderColumn}>
                    <h3>Founder B (Engineering / Technical)</h3>
                    
                    <div className={styles.fieldGroup}>
                      <label htmlFor="fb-name">Founder Name or Role</label>
                      <input 
                        type="text" 
                        id="fb-name"
                        className={styles.textInput}
                        value={founderB.name}
                        onChange={(e) => setFounderB({ ...founderB, name: e.target.value })}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="fb-commitment">Time Commitment</label>
                      <select 
                        id="fb-commitment"
                        className={styles.selectInput}
                        value={founderB.commitment}
                        onChange={(e) => setFounderB({ ...founderB, commitment: e.target.value })}
                      >
                        <option value="1.0">Full-time (100% focused)</option>
                        <option value="0.5">Part-time (Transitioning / Nights)</option>
                        <option value="0.2">Advisor / Strategic Ad-hoc</option>
                      </select>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="fb-capital">Initial Capital Contributed (€)</label>
                      <input 
                        type="number" 
                        id="fb-capital"
                        className={styles.textInput}
                        min="0"
                        step="500"
                        value={founderB.capital}
                        onChange={(e) => setFounderB({ ...founderB, capital: Math.max(0, parseInt(e.target.value) || 0) })}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.actionBar}>
                  <div />
                  <button onClick={() => setStep(2)} className="btn btn-primary">
                    Next: Contributions <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CONTRIBUTIONS & ROLES */}
            {step === 2 && (
              <div>
                <h2 className={styles.sectionTitle}>
                  <Scale size={22} style={{ color: 'var(--color-primary)' }} />
                  Step 2: Intellectual Property, Network &amp; Domain Expertise
                </h2>

                <div className={styles.grid}>
                  {/* Founder A Column */}
                  <div className={`${styles.founderColumn} ${styles.founderColumnActive}`}>
                    <h3>{founderA.name}</h3>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="fa-ip">Prior Intellectual Property</label>
                      <select 
                        id="fa-ip"
                        className={styles.selectInput}
                        value={founderA.ip}
                        onChange={(e) => setFounderA({ ...founderA, ip: e.target.value })}
                      >
                        <option value="0">None (Just starting out)</option>
                        <option value="1">Basic idea / market check mockups</option>
                        <option value="2">Pre-existing proprietary templates / lists</option>
                        <option value="3">Patented technology / proprietary algorithms</option>
                      </select>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="fa-domain">Domain Expertise &amp; Warm Network</label>
                      <select 
                        id="fa-domain"
                        className={styles.selectInput}
                        value={founderA.domainExpertise}
                        onChange={(e) => setFounderA({ ...founderA, domainExpertise: e.target.value })}
                      >
                        <option value="1">General industry observer</option>
                        <option value="2">5+ years experience in domain</option>
                        <option value="3">10+ years expert with active customer network</option>
                      </select>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="fa-role">Expected Execution Weight</label>
                      <select 
                        id="fa-role"
                        className={styles.selectInput}
                        value={founderA.roleWeight}
                        onChange={(e) => setFounderA({ ...founderA, roleWeight: e.target.value })}
                      >
                        <option value="0.3">Lower weight (Supporting operational tasks)</option>
                        <option value="0.5">Medium weight (Handles sales, finance, operations)</option>
                        <option value="0.7">High weight (Core driver of company growth)</option>
                      </select>
                    </div>
                  </div>

                  {/* Founder B Column */}
                  <div className={styles.founderColumn}>
                    <h3>{founderB.name}</h3>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="fb-ip">Prior Intellectual Property</label>
                      <select 
                        id="fb-ip"
                        className={styles.selectInput}
                        value={founderB.ip}
                        onChange={(e) => setFounderB({ ...founderB, ip: e.target.value })}
                      >
                        <option value="0">None (Just starting out)</option>
                        <option value="1">Basic designs / technical specifications</option>
                        <option value="2">Ready-made codebase / system core</option>
                        <option value="3">Patented tech / core proprietary system</option>
                      </select>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="fb-domain">Domain Expertise &amp; Warm Network</label>
                      <select 
                        id="fb-domain"
                        className={styles.selectInput}
                        value={founderB.domainExpertise}
                        onChange={(e) => setFounderB({ ...founderB, domainExpertise: e.target.value })}
                      >
                        <option value="1">General software developer</option>
                        <option value="2">5+ years general stack experience</option>
                        <option value="3">10+ years architect with specific domain match</option>
                      </select>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="fb-role">Expected Execution Weight</label>
                      <select 
                        id="fb-role"
                        className={styles.selectInput}
                        value={founderB.roleWeight}
                        onChange={(e) => setFounderB({ ...founderB, roleWeight: e.target.value })}
                      >
                        <option value="0.4">Supporting developer (Builds task tickets)</option>
                        <option value="0.6">Lead Tech CTO (Designs and codes full product)</option>
                        <option value="0.8">CTO &amp; Architect (Owns complete technical risk)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.actionBar}>
                  <button onClick={() => setStep(1)} className="btn btn-outline">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button onClick={() => setStep(3)} className="btn btn-primary">
                    Calculate Split <Sparkles size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: RESULTS DISPLAY & VESTING SCHEDULER */}
            {step === 3 && (
              <div>
                <h2 className={styles.sectionTitle}>
                  <Scale size={22} style={{ color: 'var(--color-primary)' }} />
                  Step 3: Recommended Equity Split
                </h2>

                <div className={styles.resultsContainer}>
                  {/* Visual Pie Legend */}
                  <div className={styles.pieContainer}>
                    <div className={styles.visualSplit}>
                      <svg viewBox="0 0 36 36" className={styles.circularChart}>
                        <path
                          className={styles.circleBg}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* Circle segment for Founder A */}
                        <path
                          className={styles.circleVal}
                          strokeDasharray={`${splitA}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* Circle segment for Founder B */}
                        <path
                          className={styles.circleValB}
                          strokeDasharray={`${splitB}, 100`}
                          strokeDashoffset={100 - splitB}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className={styles.percentageText}>
                        <div className={styles.percentageNum}>{splitA}:{splitB}</div>
                        <div className={styles.percentageLabel}>Calculated Split</div>
                      </div>
                    </div>

                    <div className={styles.legend}>
                      <div className={styles.legendItem}>
                        <span className={styles.legendLabel}>
                          <span className={styles.legendColor} style={{ background: 'var(--color-primary)' }} />
                          {founderA.name}
                        </span>
                        <span className={styles.legendValue}>{splitA}%</span>
                      </div>
                      <div className={styles.legendItem}>
                        <span className={styles.legendLabel}>
                          <span className={styles.legendColor} style={{ background: 'var(--color-secondary)' }} />
                          {founderB.name}
                        </span>
                        <span className={styles.legendValue}>{splitB}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculations Details */}
                  <div className={styles.splitDetails}>
                    <div className={styles.explanationBox}>
                      <h4>Calculation Methodology</h4>
                      <p>
                        This recommendation is based on a weighted scoring model: 40% on time commitment, 
                        15% on cash capital, 15% on prior IP, 15% on domain network/expertise, and 15% on 
                        execution role weight.
                      </p>
                    </div>

                    <div className={styles.explanationBox} style={{ borderLeftColor: 'var(--color-secondary)' }}>
                      <h4>Pomegroup Studio Alternative</h4>
                      <p>
                        Instead of risking co-founder disputes, Pomegroup acts as your technical infrastructure 
                        partner. You maintain **65% equity**, and Pomegroup takes **35% equity** to handle 
                        100% of software engineering, design, and hosting.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => setStep(2)} className="btn btn-outline">
                        <ArrowLeft size={16} /> Adjust Inputs
                      </button>
                      <a href="#leads" className="btn btn-primary">
                        Get Custom PDF Report
                      </a>
                    </div>
                  </div>
                </div>

                {/* Vesting Scheduler section */}
                <div className={styles.vestingBox}>
                  <h3 className={styles.vestingTitle}>
                    <Lock size={20} />
                    Dynamic Vesting Timeline Scheduler
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                    Vesting protects both co-founders by ensuring equity is earned over time. Adjust parameters below to visualize the vesting schedule.
                  </p>

                  <div className={styles.vestingControls}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="vesting-years">Vesting Schedule (Years)</label>
                      <div className={styles.rangeSliderContainer}>
                        <input 
                          type="range" 
                          id="vesting-years"
                          min="1" 
                          max="6" 
                          className={styles.slider}
                          value={vestingYears}
                          onChange={(e) => setVestingYears(parseInt(e.target.value))}
                        />
                        <span className={styles.sliderValue}>{vestingYears} yrs</span>
                      </div>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="cliff-months">Cliff Period (Months)</label>
                      <div className={styles.rangeSliderContainer}>
                        <input 
                          type="range" 
                          id="cliff-months"
                          min="0" 
                          max="24" 
                          step="6"
                          className={styles.slider}
                          value={cliffMonths}
                          onChange={(e) => setCliffMonths(parseInt(e.target.value))}
                        />
                        <span className={styles.sliderValue}>{cliffMonths} mo</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.timelineVisual}>
                    {/* Cliff shade */}
                    <div 
                      className={styles.cliffSegment} 
                      style={{ width: `${(cliffMonths / (vestingYears * 12)) * 100}%` }}
                    />
                    
                    {/* Vesting fill */}
                    <div className={styles.vestingProgress} style={{ width: '100%' }} />

                    {/* Timeline labels */}
                    <span className={styles.timelineLabel} style={{ left: '0%' }}>Start</span>
                    {cliffMonths > 0 && (
                      <span className={styles.timelineLabel} style={{ left: `${(cliffMonths / (vestingYears * 12)) * 100}%` }}>
                        Cliff ({cliffMonths}m)
                      </span>
                    )}
                    <span className={styles.timelineLabel} style={{ left: '100%' }}>End ({vestingYears} yrs)</span>
                  </div>

                  <div style={{ marginTop: 24, fontSize: '0.85rem', color: 'var(--color-muted)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <AlertCircle size={16} style={{ color: 'var(--color-secondary)' }} />
                    <span>
                      Standard schedule is 4 years with a 12-month cliff. If a co-founder leaves before the cliff, they receive 0% equity.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lead Capture form */}
          <div id="leads" className={styles.leadFormContainer}>
            <h2>Download Your Custom Co-Founder Agreement Template</h2>
            <p>
              Enter your email below to receive a custom PDF equity valuation report, along with our 
              legally validated shareholder and co-founder agreement template.
            </p>

            {submitted ? (
              <div className={styles.successState}>
                <CheckCircle size={44} className={styles.successIcon} />
                <h3>Report Sent Successfully!</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)' }}>
                  We have emailed your custom equity split breakdown and legal templates to {email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className={styles.leadForm}>
                <input 
                  type="email" 
                  placeholder="your.email@domain.com"
                  className={styles.leadInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email Address"
                />
                <input 
                  type="text" 
                  placeholder="Briefly describe your venture concept..."
                  className={styles.leadInput}
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  required
                  aria-label="Venture Concept"
                />
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Preparing PDF...' : 'Get PDF Report & Legal Templates'}
                </button>
                {errorMsg && (
                  <p style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', marginTop: 10 }}>{errorMsg}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
