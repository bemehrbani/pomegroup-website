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
  AlertCircle,
  TrendingUp,
  PieChart
} from 'lucide-react';
import styles from './page.module.css';

export default function EquityCalculatorPage() {
  const router = useRouter();
  const [modelMode, setModelMode] = useState<'slicing-pie' | 'wasserman'>('slicing-pie');
  const [step, setStep] = useState(1);

  // ----------------------------------------------------
  // MODEL 1: SLICING PIE (DYNAMIC EQUITY) STATE
  // ----------------------------------------------------
  const [pieA, setPieA] = useState({
    name: 'Founder A (Business)',
    hours: 120, // Hours worked per month
    rate: 50,   // Fair market hourly rate in €
    cash: 5000,  // Cash invested
  });

  const [pieB, setPieB] = useState({
    name: 'Founder B (Technical)',
    hours: 160,
    rate: 65,
    cash: 500,
  });

  // ----------------------------------------------------
  // MODEL 2: WASSERMAN / FOUNDERCENTRIC (FIXED POINTS) STATE
  // ----------------------------------------------------
  const [pointsA, setPointsA] = useState({
    name: 'Founder A (Business)',
    idea: 4,      // 1-5 rating
    commitment: 3,
    execution: 2,
    domain: 5,
    growth: 5,
  });

  const [pointsB, setPointsB] = useState({
    name: 'Founder B (Technical)',
    idea: 1,
    commitment: 5,
    execution: 5,
    domain: 2,
    growth: 1,
  });

  // Calculated Outputs
  const [splitA, setSplitA] = useState(50);
  const [splitB, setSplitB] = useState(50);
  
  // Vesting Timeline States
  const [vestingYears, setVestingYears] = useState(4);
  const [cliffMonths, setCliffMonths] = useState(12);

  // Lead capture states
  const [email, setEmail] = useState('');
  const [concept, setConcept] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate Slicing Pie Split
  const calculateSlicingPie = () => {
    // Slicing Pie Math:
    // Non-Cash Slices = Time worked * Hourly rate * 2 (Non-cash multiplier)
    // Cash Slices = Cash contributed * 4 (Cash multiplier)
    const nonCashA = pieA.hours * pieA.rate * 2;
    const cashA = pieA.cash * 4;
    const slicesA = nonCashA + cashA;

    const nonCashB = pieB.hours * pieB.rate * 2;
    const cashB = pieB.cash * 4;
    const slicesB = nonCashB + cashB;

    const totalSlices = slicesA + slicesB || 1;
    const percentA = Math.round((slicesA / totalSlices) * 100);
    const percentB = 100 - percentA;

    return { percentA, percentB, slicesA, slicesB };
  };

  // Calculate Wasserman Point Split
  const calculateWasserman = () => {
    // Wasserman Framework Weights:
    // Idea & Vision (10%)
    // Commitment & Opportunity Cost (30%)
    // Execution & Tech Architecture (30%)
    // Domain Expertise & IP (15%)
    // BizDev & Go-to-Market (15%)
    const scoreA = 
      pointsA.idea * 0.10 + 
      pointsA.commitment * 0.30 + 
      pointsA.execution * 0.30 + 
      pointsA.domain * 0.15 + 
      pointsA.growth * 0.15;

    const scoreB = 
      pointsB.idea * 0.10 + 
      pointsB.commitment * 0.30 + 
      pointsB.execution * 0.30 + 
      pointsB.domain * 0.15 + 
      pointsB.growth * 0.15;

    const totalScore = scoreA + scoreB || 1;
    const percentA = Math.round((scoreA / totalScore) * 100);
    const percentB = 100 - percentA;

    return { percentA, percentB };
  };

  // Update Split Outputs on value changes
  useEffect(() => {
    if (modelMode === 'slicing-pie') {
      const { percentA, percentB } = calculateSlicingPie();
      setSplitA(percentA);
      setSplitB(percentB);
    } else {
      const { percentA, percentB } = calculateWasserman();
      setSplitA(percentA);
      setSplitB(percentB);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelMode, pieA, pieB, pointsA, pointsB]);

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
          name: modelMode === 'slicing-pie' ? pieA.name : pointsA.name,
          idea: `Venture Concept: ${concept} | Calculator Mode: ${modelMode.toUpperCase()} | Calculated Split: ${splitA}% / ${splitB}% | Vesting: ${vestingYears}yr with ${cliffMonths}mo cliff`,
          role: 'Equity Calculator Lead',
          traction: 'Calculated co-founder equity splits using established models'
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
              Evaluate your co-founder contributions objectively. Toggle between the dynamic **Slicing Pie** model 
              or the weighted **HBS Wasserman Points** framework to determine a fair split.
            </p>
          </div>

          {/* Model Toggle Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
            <button
              onClick={() => { setModelMode('slicing-pie'); setStep(1); }}
              className={`btn ${modelMode === 'slicing-pie' ? 'btn-primary' : 'btn-outline'}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <TrendingUp size={16} /> Slicing Pie Model (Dynamic)
            </button>
            <button
              onClick={() => { setModelMode('wasserman'); setStep(1); }}
              className={`btn ${modelMode === 'wasserman' ? 'btn-primary' : 'btn-outline'}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Scale size={16} /> HBS Wasserman Model (Fixed)
            </button>
          </div>

          <div className={styles.card}>
            {/* Steps Progress */}
            <div className={styles.stepsContainer}>
              <div className={styles.stepLineActive} style={{ width: `${(step - 1) * 50}%` }} />
              <div className={`${styles.stepDot} ${step >= 1 ? (step > 1 ? styles.stepDotCompleted : styles.stepDotActive) : ''}`}>
                1
                <span className={styles.stepLabel}>Inputs</span>
              </div>
              <div className={`${styles.stepDot} ${step >= 2 ? (step > 2 ? styles.stepDotCompleted : styles.stepDotActive) : ''}`}>
                2
                <span className={styles.stepLabel}>Results</span>
              </div>
              <div className={`${styles.stepDot} ${step >= 3 ? styles.stepDotActive : ''}`}>
                3
                <span className={styles.stepLabel}>Vesting</span>
              </div>
            </div>

            {/* STEP 1: INPUTS FORM */}
            {step === 1 && (
              <div>
                <h2 className={styles.sectionTitle}>
                  {modelMode === 'slicing-pie' ? (
                    <>
                      <Coins size={22} style={{ color: 'var(--color-primary)' }} />
                      Slicing Pie Contributions (Monthly Estimate)
                    </>
                  ) : (
                    <>
                      <Scale size={22} style={{ color: 'var(--color-primary)' }} />
                      HBS Wasserman Points Framework
                    </>
                  )}
                </h2>

                {modelMode === 'slicing-pie' ? (
                  /* SLICING PIE INPUTS */
                  <div className={styles.grid}>
                    {/* Founder A Column */}
                    <div className={`${styles.founderColumn} ${styles.founderColumnActive}`}>
                      <h3>{pieA.name}</h3>
                      
                      <div className={styles.fieldGroup}>
                        <label htmlFor="fa-pie-name">Founder Role / Name</label>
                        <input 
                          type="text" 
                          id="fa-pie-name"
                          className={styles.textInput}
                          value={pieA.name}
                          onChange={(e) => setPieA({ ...pieA, name: e.target.value })}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fa-pie-hours">Monthly Hours Contributed</label>
                        <div className={styles.rangeSliderContainer}>
                          <input 
                            type="range" 
                            id="fa-pie-hours"
                            min="10" 
                            max="200" 
                            step="10"
                            className={styles.slider}
                            value={pieA.hours}
                            onChange={(e) => setPieA({ ...pieA, hours: parseInt(e.target.value) })}
                          />
                          <span className={styles.sliderValue}>{pieA.hours} hrs</span>
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fa-pie-rate">Fair Market Hourly Rate (€/hr)</label>
                        <div className={styles.rangeSliderContainer}>
                          <input 
                            type="range" 
                            id="fa-pie-rate"
                            min="20" 
                            max="150" 
                            step="5"
                            className={styles.slider}
                            value={pieA.rate}
                            onChange={(e) => setPieA({ ...pieA, rate: parseInt(e.target.value) })}
                          />
                          <span className={styles.sliderValue}>€{pieA.rate}</span>
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fa-pie-cash">Out-of-Pocket Cash Contributed (€)</label>
                        <input 
                          type="number" 
                          id="fa-pie-cash"
                          className={styles.textInput}
                          min="0"
                          step="100"
                          value={pieA.cash}
                          onChange={(e) => setPieA({ ...pieA, cash: Math.max(0, parseInt(e.target.value) || 0) })}
                        />
                      </div>
                    </div>

                    {/* Founder B Column */}
                    <div className={styles.founderColumn}>
                      <h3>{pieB.name}</h3>
                      
                      <div className={styles.fieldGroup}>
                        <label htmlFor="fb-pie-name">Founder Role / Name</label>
                        <input 
                          type="text" 
                          id="fb-pie-name"
                          className={styles.textInput}
                          value={pieB.name}
                          onChange={(e) => setPieB({ ...pieB, name: e.target.value })}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fb-pie-hours">Monthly Hours Contributed</label>
                        <div className={styles.rangeSliderContainer}>
                          <input 
                            type="range" 
                            id="fb-pie-hours"
                            min="10" 
                            max="200" 
                            step="10"
                            className={styles.slider}
                            value={pieB.hours}
                            onChange={(e) => setPieB({ ...pieB, hours: parseInt(e.target.value) })}
                          />
                          <span className={styles.sliderValue}>{pieB.hours} hrs</span>
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fb-pie-rate">Fair Market Hourly Rate (€/hr)</label>
                        <div className={styles.rangeSliderContainer}>
                          <input 
                            type="range" 
                            id="fb-pie-rate"
                            min="20" 
                            max="150" 
                            step="5"
                            className={styles.slider}
                            value={pieB.rate}
                            onChange={(e) => setPieB({ ...pieB, rate: parseInt(e.target.value) })}
                          />
                          <span className={styles.sliderValue}>€{pieB.rate}</span>
                        </div>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fb-pie-cash">Out-of-Pocket Cash Contributed (€)</label>
                        <input 
                          type="number" 
                          id="fb-pie-cash"
                          className={styles.textInput}
                          min="0"
                          step="100"
                          value={pieB.cash}
                          onChange={(e) => setPieB({ ...pieB, cash: Math.max(0, parseInt(e.target.value) || 0) })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* WASSERMAN FIXED POINTS INPUTS */
                  <div className={styles.grid}>
                    {/* Founder A Column */}
                    <div className={`${styles.founderColumn} ${styles.founderColumnActive}`}>
                      <h3>{pointsA.name}</h3>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fa-pt-name">Founder Role / Name</label>
                        <input 
                          type="text" 
                          id="fa-pt-name"
                          className={styles.textInput}
                          value={pointsA.name}
                          onChange={(e) => setPointsA({ ...pointsA, name: e.target.value })}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fa-pt-idea">Idea Origination &amp; Research (1–5)</label>
                        <select 
                          id="fa-pt-idea"
                          className={styles.selectInput}
                          value={pointsA.idea}
                          onChange={(e) => setPointsA({ ...pointsA, idea: parseInt(e.target.value) })}
                        >
                          <option value="1">1 - Minimal input</option>
                          <option value="3">3 - Standard validation</option>
                          <option value="5">5 - Developed core IP / patents</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fa-pt-comm">Time Commitment &amp; Risk (1–5)</label>
                        <select 
                          id="fa-pt-comm"
                          className={styles.selectInput}
                          value={pointsA.commitment}
                          onChange={(e) => setPointsA({ ...pointsA, commitment: parseInt(e.target.value) })}
                        >
                          <option value="1">1 - Part-time / Nights</option>
                          <option value="3">3 - Transitioning to full-time</option>
                          <option value="5">5 - Full-time / Resigned from high-paying role</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fa-pt-exec">Execution &amp; Technical Skill (1–5)</label>
                        <select 
                          id="fa-pt-exec"
                          className={styles.selectInput}
                          value={pointsA.execution}
                          onChange={(e) => setPointsA({ ...pointsA, execution: parseInt(e.target.value) })}
                        >
                          <option value="1">1 - Supporting role</option>
                          <option value="3">3 - Intermediate management</option>
                          <option value="5">5 - Core builder / CTO architect</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fa-pt-domain">Domain Expertise &amp; Warm Network (1–5)</label>
                        <select 
                          id="fa-pt-domain"
                          className={styles.selectInput}
                          value={pointsA.domain}
                          onChange={(e) => setPointsA({ ...pointsA, domain: parseInt(e.target.value) })}
                        >
                          <option value="1">1 - General industry observer</option>
                          <option value="3">3 - 5+ years experience in domain</option>
                          <option value="5">5 - 10+ years expert with active customer contacts</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fa-pt-growth">Sales &amp; Business Growth (1–5)</label>
                        <select 
                          id="fa-pt-growth"
                          className={styles.selectInput}
                          value={pointsA.growth}
                          onChange={(e) => setPointsA({ ...pointsA, growth: parseInt(e.target.value) })}
                        >
                          <option value="1">1 - Ad-hoc support</option>
                          <option value="3">3 - Standard operations</option>
                          <option value="5">5 - Main driver of sales &amp; funding</option>
                        </select>
                      </div>
                    </div>

                    {/* Founder B Column */}
                    <div className={styles.founderColumn}>
                      <h3>{pointsB.name}</h3>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fb-pt-name">Founder Role / Name</label>
                        <input 
                          type="text" 
                          id="fb-pt-name"
                          className={styles.textInput}
                          value={pointsB.name}
                          onChange={(e) => setPointsB({ ...pointsB, name: e.target.value })}
                        />
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fb-pt-idea">Idea Origination &amp; Research (1–5)</label>
                        <select 
                          id="fb-pt-idea"
                          className={styles.selectInput}
                          value={pointsB.idea}
                          onChange={(e) => setPointsB({ ...pointsB, idea: parseInt(e.target.value) })}
                        >
                          <option value="1">1 - Minimal input</option>
                          <option value="3">3 - Standard validation</option>
                          <option value="5">5 - Developed core IP / patents</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fb-pt-comm">Time Commitment &amp; Risk (1–5)</label>
                        <select 
                          id="fb-pt-comm"
                          className={styles.selectInput}
                          value={pointsB.commitment}
                          onChange={(e) => setPointsB({ ...pointsB, commitment: parseInt(e.target.value) })}
                        >
                          <option value="1">1 - Part-time / Nights</option>
                          <option value="3">3 - Transitioning to full-time</option>
                          <option value="5">5 - Full-time / Resigned from high-paying role</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fb-pt-exec">Execution &amp; Technical Skill (1–5)</label>
                        <select 
                          id="fb-pt-exec"
                          className={styles.selectInput}
                          value={pointsB.execution}
                          onChange={(e) => setPointsB({ ...pointsB, execution: parseInt(e.target.value) })}
                        >
                          <option value="1">1 - Supporting role</option>
                          <option value="3">3 - Intermediate management</option>
                          <option value="5">5 - Core builder / CTO architect</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fb-pt-domain">Domain Expertise &amp; Warm Network (1–5)</label>
                        <select 
                          id="fb-pt-domain"
                          className={styles.selectInput}
                          value={pointsB.domain}
                          onChange={(e) => setPointsB({ ...pointsB, domain: parseInt(e.target.value) })}
                        >
                          <option value="1">1 - General industry observer</option>
                          <option value="3">3 - 5+ years experience in domain</option>
                          <option value="5">5 - 10+ years expert with active customer contacts</option>
                        </select>
                      </div>

                      <div className={styles.fieldGroup}>
                        <label htmlFor="fb-pt-growth">Sales &amp; Business Growth (1–5)</label>
                        <select 
                          id="fb-pt-growth"
                          className={styles.selectInput}
                          value={pointsB.growth}
                          onChange={(e) => setPointsB({ ...pointsB, growth: parseInt(e.target.value) })}
                        >
                          <option value="1">1 - Ad-hoc support</option>
                          <option value="3">3 - Standard operations</option>
                          <option value="5">5 - Main driver of sales &amp; funding</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.actionBar}>
                  <div />
                  <button onClick={() => setStep(2)} className="btn btn-primary">
                    Next: View Split Result <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CALCULATED RESULTS */}
            {step === 2 && (
              <div>
                <h2 className={styles.sectionTitle}>
                  <PieChart size={22} style={{ color: 'var(--color-primary)' }} />
                  Step 2: Recommended Split Results
                </h2>

                <div className={styles.resultsContainer}>
                  {/* Circular Pie Chart */}
                  <div className={styles.pieContainer}>
                    <div className={styles.visualSplit}>
                      <svg viewBox="0 0 36 36" className={styles.circularChart}>
                        <path
                          className={styles.circleBg}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={styles.circleVal}
                          strokeDasharray={`${splitA}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
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
                          {modelMode === 'slicing-pie' ? pieA.name : pointsA.name}
                        </span>
                        <span className={styles.legendValue}>{splitA}%</span>
                      </div>
                      <div className={styles.legendItem}>
                        <span className={styles.legendLabel}>
                          <span className={styles.legendColor} style={{ background: 'var(--color-secondary)' }} />
                          {modelMode === 'slicing-pie' ? pieB.name : pointsB.name}
                        </span>
                        <span className={styles.legendValue}>{splitB}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Details and Description */}
                  <div className={styles.splitDetails}>
                    {modelMode === 'slicing-pie' ? (
                      <div className={styles.explanationBox}>
                        <h4>Slicing Pie Model (Dynamic) Math Breakdown</h4>
                        <p style={{ marginBottom: 10 }}>
                          Multipliers are applied to account for the risk of unpaid inputs:
                        </p>
                        <ul style={{ paddingLeft: 20, fontSize: '0.88rem', color: 'var(--color-text-secondary)', listStyleType: 'disc' }}>
                          <li>**Time worked** is multiplied by **2x** to calculate Non-Cash slices.</li>
                          <li>**Cash contributed** is multiplied by **4x** to calculate Cash slices.</li>
                          <li>**Founder A Slices:** {(pieA.hours * pieA.rate * 2) + (pieA.cash * 4)} slices</li>
                          <li>**Founder B Slices:** {(pieB.hours * pieB.rate * 2) + (pieB.cash * 4)} slices</li>
                        </ul>
                      </div>
                    ) : (
                      <div className={styles.explanationBox}>
                        <h4>HBS Wasserman Framework Math Breakdown</h4>
                        <p style={{ marginBottom: 10 }}>
                          Weighted averages are calculated using the following criteria:
                        </p>
                        <ul style={{ paddingLeft: 20, fontSize: '0.88rem', color: 'var(--color-text-secondary)', listStyleType: 'disc' }}>
                          <li>**Idea &amp; Vision:** weighted at 10%</li>
                          <li>**Commitment &amp; Risk:** weighted at 30%</li>
                          <li>**Execution &amp; Tech:** weighted at 30%</li>
                          <li>**Domain Expertise &amp; IP:** weighted at 15%</li>
                          <li>**BizDev &amp; Sales:** weighted at 15%</li>
                        </ul>
                      </div>
                    )}

                    <div className={styles.explanationBox} style={{ borderLeftColor: 'var(--color-secondary)' }}>
                      <h4>Pomegroup Studio Alternative</h4>
                      <p>
                        Rather than arguing over who builds what, Pomegroup acts as your second co-founder. 
                        You keep **65% equity** to focus on domain validation, while Pomegroup takes **35% equity** 
                        to build, scale, and host your entire technical infrastructure.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button onClick={() => setStep(1)} className="btn btn-outline">
                        <ArrowLeft size={16} /> Adjust Inputs
                      </button>
                      <button onClick={() => setStep(3)} className="btn btn-primary">
                        Configure Vesting <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: VESTING SCHEDULER */}
            {step === 3 && (
              <div>
                <h2 className={styles.sectionTitle}>
                  <Lock size={22} style={{ color: 'var(--color-primary)' }} />
                  Step 3: Vesting &amp; Shareholders Protection
                </h2>

                <div className={styles.vestingBox} style={{ border: 'none', padding: 0 }}>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-secondary)', marginBottom: 30 }}>
                    Vesting ensures that co-founders earn their equity over time. If a partner leaves early, 
                    unvested shares are bought back by the company, preventing dead equity bottlenecks.
                  </p>

                  <div className={styles.vestingControls}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="vest-yrs">Vesting Schedule (Years)</label>
                      <div className={styles.rangeSliderContainer}>
                        <input 
                          type="range" 
                          id="vest-yrs"
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
                      <label htmlFor="cliff-mos">Cliff Period (Months)</label>
                      <div className={styles.rangeSliderContainer}>
                        <input 
                          type="range" 
                          id="cliff-mos"
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
                    <div 
                      className={styles.cliffSegment} 
                      style={{ width: `${(cliffMonths / (vestingYears * 12)) * 100}%` }}
                    />
                    <div className={styles.vestingProgress} style={{ width: '100%' }} />

                    <span className={styles.timelineLabel} style={{ left: '0%' }}>Incorporation</span>
                    {cliffMonths > 0 && (
                      <span className={styles.timelineLabel} style={{ left: `${(cliffMonths / (vestingYears * 12)) * 100}%` }}>
                        Cliff ({cliffMonths}m)
                      </span>
                    )}
                    <span className={styles.timelineLabel} style={{ left: '100%' }}>Fully Vested ({vestingYears}y)</span>
                  </div>

                  <div style={{ marginTop: 40, fontSize: '0.85rem', color: 'var(--color-muted)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <AlertCircle size={16} style={{ color: 'var(--color-secondary)' }} />
                    <span>
                      Standard schedule is 4 years with a 12-month cliff. If a co-founder leaves before month 12, they walk away with 0%.
                    </span>
                  </div>
                </div>

                <div className={styles.actionBar}>
                  <button onClick={() => setStep(2)} className="btn btn-outline">
                    <ArrowLeft size={16} /> Back to Results
                  </button>
                  <a href="#leads" className="btn btn-primary">
                    Get Custom PDF Report
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Lead Capture form */}
          <div id="leads" className={styles.leadFormContainer}>
            <h2>Get Your Custom Slicing Pie Excel Calculator &amp; Legal Templates</h2>
            <p>
              Enter your email below to receive a custom PDF equity valuation report, along with our 
              legally validated shareholder agreement template.
            </p>

            {submitted ? (
              <div className={styles.successState}>
                <CheckCircle size={44} className={styles.successIcon} />
                <h3>Templates Sent Successfully!</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)' }}>
                  We have emailed your custom equity split breakdown, Slicing Pie Excel template, and shareholders agreement.
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
                  {submitting ? 'Preparing PDF...' : 'Get Excel Calculator & Legal Templates'}
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
