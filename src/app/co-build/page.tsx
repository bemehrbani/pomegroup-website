'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, Linkedin, Briefcase, ArrowRight, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import styles from './page.module.css';

interface FormState {
  name: string;
  email: string;
  linkedin: string;
  domain: string;
  problem: string;
  productDescription: string;
  stage: string;
  bottleneck: string;
  whyPomegroup: string;
}

const initialFormState: FormState = {
  name: '',
  email: '',
  linkedin: '',
  domain: '',
  problem: '',
  productDescription: '',
  stage: 'Idea Stage',
  bottleneck: '',
  whyPomegroup: '',
};

export default function CoBuildPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form from URL query parameters (e.g. from Funding Finder)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const grantId = params.get('grantId');
      const grantTitle = params.get('grantTitle');
      const concept = params.get('concept');
      const paramDomain = params.get('domain');

      if (grantId || grantTitle || concept || paramDomain) {
        setFormData((prev) => ({
          ...prev,
          domain: paramDomain || prev.domain,
          productDescription: concept || prev.productDescription,
          whyPomegroup: grantTitle 
            ? `I want to secure the grant: "${grantTitle}" (ID: ${grantId}) and need Pomegroup as my CTO Co-founder to build the technical MVT and help write the technical proposal.`
            : prev.whyPomegroup,
          bottleneck: grantTitle 
            ? `Need an instant technical partner to validate the concept and draft the technical architecture required by the "${grantTitle}" grant application.`
            : prev.bottleneck,
        }));
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.linkedin)) {
      setError('Please fill in all contact details.');
      return;
    }
    if (step === 2 && (!formData.domain || !formData.problem)) {
      setError('Please describe your domain and the opportunity.');
      return;
    }
    if (step === 3 && (!formData.productDescription)) {
      setError('Please provide product details.');
      return;
    }
    setError('');
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bottleneck || !formData.whyPomegroup) {
      setError('Please fill in the partnership details.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit application.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setStep(1);
    setSubmitted(false);
    setError('');
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.wizardContainer}>
            {submitted ? (
              <div className={styles.successWrapper}>
                <div className={styles.successIconWrapper}>
                  <CheckCircle size={48} color="#F5A623" />
                </div>
                <h1>Application Submitted!</h1>
                <p>
                  Thank you, <strong>{formData.name}</strong>. We have received your co-founding pitch. 
                  Our team will review your application within 48 hours.
                </p>
                <div className={styles.nextStepsCard}>
                  <h3>Next Steps in the Funnel:</h3>
                  <ul>
                    <li>
                      <strong>1. Preliminary Review:</strong> We verify your industry domain background.
                    </li>
                    <li>
                      <strong>2. Discovery Session:</strong> 1-hour call to map out features, technical architecture, and validation metrics.
                    </li>
                    <li>
                      <strong>3. MVT Sprint:</strong> A 48-hour prototype sprint using AntiGravity to prove concept viability.
                    </li>
                  </ul>
                </div>
                <button onClick={handleReset} className="btn btn-outline">
                  <RefreshCw size={16} /> Apply with another idea
                </button>
              </div>
            ) : (
              <div className={styles.formWrapper}>
                <div className={styles.header}>
                  <div className="section-label">Co-Founder Intake Form</div>
                  <h1>Pitch Your Venture</h1>
                  <p>
                    You bring the domain expertise and market access. We bring the design, product strategy, 
                    and development execution. Let&apos;s build together.
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className={styles.progressTracker}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${(step / 4) * 100}%` }}
                    />
                  </div>
                  <div className={styles.stepLabels}>
                    <span className={step >= 1 ? styles.activeStep : ''}>1. Contact</span>
                    <span className={step >= 2 ? styles.activeStep : ''}>2. Industry</span>
                    <span className={step >= 3 ? styles.activeStep : ''}>3. Product</span>
                    <span className={step >= 4 ? styles.activeStep : ''}>4. Partnership</span>
                  </div>
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                  {/* Step 1: Contact Details */}
                  {step === 1 && (
                    <div className={styles.stepContent}>
                      <h2>Who are you?</h2>
                      <p className={styles.stepDescription}>Tell us about yourself and your professional background.</p>
                      
                      <div className={styles.inputGroup}>
                        <label htmlFor="name">Full Name</label>
                        <div className={styles.inputField}>
                          <User size={18} className={styles.fieldIcon} />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Anna Virtanen"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <div className={styles.inputField}>
                          <Mail size={18} className={styles.fieldIcon} />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="anna.virtanen@consulting.fi"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="linkedin">LinkedIn Profile URL</label>
                        <div className={styles.inputField}>
                          <Linkedin size={18} className={styles.fieldIcon} />
                          <input
                            type="url"
                            id="linkedin"
                            name="linkedin"
                            placeholder="https://linkedin.com/in/anna-virtanen"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Industry Domain & Problem */}
                  {step === 2 && (
                    <div className={styles.stepContent}>
                      <h2>Your Domain & Opportunity</h2>
                      <p className={styles.stepDescription}>What industry segment do you operate in, and what problem are you solving?</p>

                      <div className={styles.inputGroup}>
                        <label htmlFor="domain">Industry/Domain</label>
                        <div className={styles.inputField}>
                          <Briefcase size={18} className={styles.fieldIcon} />
                          <input
                            type="text"
                            id="domain"
                            name="domain"
                            placeholder="Sustainability, Logistics, Site Construction, etc."
                            value={formData.domain}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="problem">What is the problem or manual bottleneck?</label>
                        <textarea
                          id="problem"
                          name="problem"
                          rows={4}
                          placeholder="Describe the current manual processes, inefficiencies, or regulatory headaches that your target market suffers from..."
                          value={formData.problem}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Product Stage & Description */}
                  {step === 3 && (
                    <div className={styles.stepContent}>
                      <h2>The Product Idea</h2>
                      <p className={styles.stepDescription}>Tell us about the solution you envision and its current progress.</p>

                      <div className={styles.inputGroup}>
                        <label htmlFor="productDescription">Describe your product idea</label>
                        <textarea
                          id="productDescription"
                          name="productDescription"
                          rows={4}
                          placeholder="How does your solution solve the problem? What are the key features for the MVP?"
                          value={formData.productDescription}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="stage">Current Stage</label>
                        <select
                          id="stage"
                          name="stage"
                          value={formData.stage}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="Idea Stage">Idea Stage</option>
                          <option value="Wireframes / Concept Specs">Wireframes / Concept Specs</option>
                          <option value="In Progress MVP (Unfinished)">In Progress MVP (Unfinished)</option>
                          <option value="Have Initial Client Pilots Ready">Have Initial Client Pilots Ready</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Partnership & Tech Bottlenecks */}
                  {step === 4 && (
                    <div className={styles.stepContent}>
                      <h2>Co-Founder Alignment</h2>
                      <p className={styles.stepDescription}>Why do you need a technical partner, and why Pomegroup?</p>

                      <div className={styles.inputGroup}>
                        <label htmlFor="bottleneck">What is your primary technical bottleneck?</label>
                        <textarea
                          id="bottleneck"
                          name="bottleneck"
                          rows={3}
                          placeholder="e.g., Cannot find a CTO, software agency quotes are too high, freelancers are too slow..."
                          value={formData.bottleneck}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className={styles.inputGroup}>
                        <label htmlFor="whyPomegroup">Why do you want to partner with Pomegroup?</label>
                        <textarea
                          id="whyPomegroup"
                          name="whyPomegroup"
                          rows={3}
                          placeholder="How does our second co-founder model align with your venture goals?"
                          value={formData.whyPomegroup}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className={styles.actions}>
                    {step > 1 && (
                      <button type="button" onClick={handleBack} className="btn btn-outline">
                        <ArrowLeft size={16} /> Back
                      </button>
                    )}
                    {step < 4 ? (
                      <button type="button" onClick={handleNext} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                        Next Step <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{ marginLeft: 'auto' }}
                      >
                        {submitting ? 'Submitting...' : 'Submit Pitch'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
