'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Code, ShieldCheck, Mail, ArrowLeft, Download, CheckCircle, Clock, Sparkles, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

interface Playbook {
  id: string;
  title: string;
  tag: string;
  readTime: string;
  summary: string;
  icon: React.ReactNode;
  content: {
    sectionTitle: string;
    description: string;
    steps: { title: string; desc: string; code?: string }[];
  };
}

const playbooks: Playbook[] = [
  {
    id: 'ai-scaffolding',
    title: "The Solo-Founder's AI Scaffolding Guide",
    tag: 'Engineering',
    readTime: '10 min read',
    summary: 'A step-by-step technical guide to bootstrapping Next.js + Tailwind CSS boilerplate in under 20 minutes using local system AI agents.',
    icon: <Code size={24} />,
    content: {
      sectionTitle: 'Boilerplate Automation Workflow',
      description: 'How Pomegroup acts as a 10-person dev team using local system AI tools to generate secure, scalable foundations instantly.',
      steps: [
        {
          title: '1. Scaffolding Script Initialization',
          desc: 'Run our automated scaffolding utility to configure Tailwind CSS v4, TypeScript, and basic directory architecture.',
          code: 'npx -y create-next-app@latest ./ --ts --tailwind --app --src-dir --import-alias "@/*"',
        },
        {
          title: '2. Config Override for Next.js 16',
          desc: 'Establish optimization guidelines in next.config.ts to enable static generation fallback and asset path configurations.',
          code: `import type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {\n  images: {\n    unoptimized: true,\n  },\n};\n\nexport default nextConfig;`,
        },
        {
          title: '3. Local AI Prompting Recipe',
          desc: 'Feed this prompt to your local model to generate custom Tailwind layouts aligned to a specific design system.',
          code: 'System: You are an expert Next.js engineer.\nPrompt: Build a responsive PageLayout component matching color theme: Indigo (#2D2B6B) and Amber (#F5A623). Ensure accessibility contrast compliance.',
        },
      ],
    },
  },
  {
    id: 'esg-wizard',
    title: 'SME CSRD & ESG Compliance Checklist',
    tag: 'ESG Strategy',
    readTime: '8 min read',
    summary: 'A practical roadmap for European SMEs preparing for ESG double materiality assessment and VSME reporting.',
    icon: <ShieldCheck size={24} />,
    content: {
      sectionTitle: 'EU ESG Readiness Guide',
      description: 'A simplified breakdown of standard CSRD regulatory steps tailored for SMEs looking to stay compliant without hiring expensive consultants.',
      steps: [
        {
          title: '1. Double Materiality Assessment (DMA)',
          desc: 'Identify which sustainability topics have an impact on your business financials and what impact your business has on the environment.',
        },
        {
          title: '2. GHG Protocol Carbon Accounting',
          desc: 'Calculate Scope 1 (Direct emissions from company facilities/vehicles) and Scope 2 (Indirect emissions from purchased electricity/heating) data points.',
        },
        {
          title: '3. Drafting the VSME Report',
          desc: 'Compile disclosures into the Voluntary SME (VSME) template, ready to show investors, banks, and major enterprise clients.',
        },
      ],
    },
  },
  {
    id: 'co-founder-framework',
    title: 'The Second Co-Founder Framework',
    tag: 'Venture Design',
    readTime: '6 min read',
    summary: 'Our blueprint for equity splits, Service Level Agreements (SLAs), and co-building milestones that govern long-term success.',
    icon: <BookOpen size={24} />,
    content: {
      sectionTitle: 'Collaborative Governance Blueprint',
      description: 'Transparent equity structure that replaces client-vendor friction with mutual growth incentives.',
      steps: [
        {
          title: '1. Domain Expert Role',
          desc: 'Domain validation, pilot customer acquisition, regulatory navigation, and early sales. 100% focused on business traction.',
        },
        {
          title: '2. Pomegroup Studio Role',
          desc: 'Instant CTO infrastructure. We design the UI/UX, code the software, handle cloud ops, and manage releases. 100% focused on product development.',
        },
        {
          title: '3. Equity & Milestone Vesting',
          desc: 'Co-founding agreements operate with standard 4-year vesting and a 1-year cliff. Acceleration occurs on defined funding milestones.',
        },
      ],
    },
  },
];

export default function ResourcesPage() {
  const [activePlaybook, setActivePlaybook] = useState<Playbook | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          {activePlaybook ? (
            <div className={styles.detailContainer}>
              <button onClick={() => setActivePlaybook(null)} className={styles.backButton}>
                <ArrowLeft size={16} /> Back to playbooks
              </button>

              <div className={styles.playbookHeader}>
                <span className="tag">{activePlaybook.tag}</span>
                <span className={styles.detailTime}>
                  <Clock size={14} style={{ marginRight: '4px' }} /> {activePlaybook.readTime}
                </span>
                <h1>{activePlaybook.title}</h1>
                <p className={styles.detailSummary}>{activePlaybook.summary}</p>
              </div>

              <div className={styles.detailContent}>
                <h2>{activePlaybook.content.sectionTitle}</h2>
                <p className={styles.detailDesc}>{activePlaybook.content.description}</p>

                <div className={styles.stepsList}>
                  {activePlaybook.content.steps.map((step, idx) => (
                    <div key={idx} className={styles.stepCard}>
                      <h3>{step.title}</h3>
                      <p>{step.desc}</p>
                      {step.code && (
                        <pre className={styles.codeBlock}>
                          <code>{step.code}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.hubContainer}>
              <div className={styles.hubHeader}>
                <div className="section-label">Playbooks & Guides</div>
                <h1>Empowerment Hub</h1>
                <p>
                  We give away 99% of our venture frameworks, checklists, and software scaffolding tools. 
                  Download resources, learn how we build, and access our internal playbooks.
                </p>
              </div>

              {/* Newsletter Call to Action */}
              <div className={styles.guildSection}>
                <div className={styles.guildContent}>
                  <h2>Join the Pomegroup Builder&apos;s Guild</h2>
                  <p>
                    Get bi-weekly playbooks, open-source automation scripts, and updates on build-in-public ventures.
                  </p>
                </div>
                {subscribed ? (
                  <div className={styles.successMessage}>
                    <CheckCircle size={20} color="#F5A623" />
                    <span>Welcome to the Guild! We’ve sent your starter resources.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className={styles.guildForm}>
                    <div className={styles.inputContainer}>
                      <Mail size={18} className={styles.mailIcon} />
                      <input
                        type="email"
                        placeholder="your.email@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                        aria-label="Email address"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Join Guild
                    </button>
                  </form>
                )}
              </div>

              {/* Playbooks Grid */}
              <div className={styles.grid}>
                {/* Interactive Tool Card [NEW] */}
                <div className={styles.card} style={{ border: '2px solid var(--color-primary)', background: 'rgba(45, 43, 107, 0.02)' }}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconWrapper} style={{ background: 'rgba(245, 166, 35, 0.1)', color: 'var(--color-secondary-dark)' }}>
                      <Sparkles size={24} />
                    </div>
                    <span className="tag" style={{ background: 'var(--color-secondary)', color: 'var(--color-primary-dark)', borderColor: 'var(--color-secondary)' }}>Interactive Tool</span>
                  </div>
                  <h2 className={styles.cardTitle}>EU Funding Finder & AI Matcher</h2>
                  <p className={styles.cardSummary}>
                    Search the official European Commission database for active grants. Input your startup project concept to receive a custom AI eligibility alignment report.
                  </p>
                  <div className={styles.cardFooter}>
                    <a href="/resources/funding-finder" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                      Launch Tool <ArrowRight size={14} />
                    </a>
                  </div>
                </div>

                {playbooks.map((playbook) => (
                  <div key={playbook.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.iconWrapper}>{playbook.icon}</div>
                      <span className="tag">{playbook.tag}</span>
                    </div>
                    <h2 className={styles.cardTitle}>{playbook.title}</h2>
                    <p className={styles.cardSummary}>{playbook.summary}</p>
                    <div className={styles.cardFooter}>
                      <button
                        onClick={() => setActivePlaybook(playbook)}
                        className={`${styles.readButton} btn btn-outline`}
                      >
                        Read Online
                      </button>
                      <span className={styles.readTime}>
                        <Clock size={12} style={{ marginRight: '4px' }} /> {playbook.readTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
