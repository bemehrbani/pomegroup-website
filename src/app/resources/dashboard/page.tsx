'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

interface OverviewMetrics {
  activeUsers: number;
  sessions: number;
  pageViews: number;
  bounceRate: string;
  averageSessionDuration?: string;
}

interface ChannelData {
  name: string;
  sessions: number;
  percentage: number;
}

interface PageData {
  path: string;
  title: string;
  views: number;
}

interface FunnelStep {
  step: string;
  count: number;
  percentage: number;
}

interface AnalyticsData {
  isMock: boolean;
  overview: OverviewMetrics;
  channels: ChannelData[];
  pages: PageData[];
  funnel: FunnelStep[];
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/analytics');
      if (!response.ok) {
        throw new Error('Server returned an error while fetching metrics.');
      }
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.dashboardContainer}>
          {/* Dashboard Header */}
          <header className={styles.header}>
            <div>
              <div className="section-label">Performance</div>
              <h1>Marketing Conversion</h1>
            </div>
            
            {data && (
              <div className={styles.badgeContainer}>
                {data.isMock ? (
                  <div className={styles.mockBadge}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#D97706', borderRadius: '50%' }} />
                    Sandbox Mode (Simulated Data)
                  </div>
                ) : (
                  <div className={styles.liveBadge}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#059669', borderRadius: '50%', animation: 'ping 1.5s infinite' }} />
                    Live GA4 Connection
                  </div>
                )}
                <button onClick={fetchAnalytics} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }} disabled={loading}>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            )}
          </header>

          {loading && (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-secondary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
              <p style={{ color: 'var(--color-muted)' }}>Loading live Google Analytics conversion data...</p>
              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {error && !data && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '40px' }}>
              <h3>Failed to Load Analytics</h3>
              <p style={{ margin: '8px 0 24px', color: '#B91C1C' }}>{error}</p>
              <button onClick={fetchAnalytics} className="btn btn-primary">Try Again</button>
            </div>
          )}

          {data && (
            <>
              {/* Key Performance Metric Cards */}
              <section className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Active Users</span>
                  <span className={styles.metricValue}>{data.overview.activeUsers.toLocaleString()}</span>
                  <span className={styles.metricTrend}>Last 30 days</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Total Sessions</span>
                  <span className={styles.metricValue}>{data.overview.sessions.toLocaleString()}</span>
                  <span className={styles.metricTrend}>Avg. engagement length</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Page Views</span>
                  <span className={styles.metricValue}>{data.overview.pageViews.toLocaleString()}</span>
                  <span className={styles.metricTrend}>Total loads</span>
                </div>

                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Bounce Rate</span>
                  <span className={styles.metricValue}>{data.overview.bounceRate}</span>
                  <span className={styles.metricTrend}>Interactivity speed</span>
                </div>
              </section>

              {/* Channels & Funnel Grid */}
              <section className={styles.twoColGrid}>
                {/* Traffic Channels */}
                <div className={styles.sectionBox}>
                  <h2>Acquisition Channels</h2>
                  <div style={{ marginTop: '16px' }}>
                    {data.channels.map((channel) => (
                      <div key={channel.name} className={styles.channelRow}>
                        <div className={styles.channelMeta}>
                          <span className={styles.channelName}>{channel.name}</span>
                          <span className={styles.channelValue}>
                            {channel.sessions.toLocaleString()} ({channel.percentage}%)
                          </span>
                        </div>
                        <div className={styles.progressBarBg}>
                          <div
                            className={styles.progressBarFill}
                            style={{ width: `${channel.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className={styles.sectionBox}>
                  <h2>Conversion Funnel</h2>
                  <div className={styles.funnelContainer} style={{ marginTop: '16px' }}>
                    {data.funnel.map((step) => (
                      <div key={step.step} className={styles.funnelBar}>
                        <span className={styles.funnelStep}>{step.step}</span>
                        <div className={styles.funnelStats}>
                          <span className={styles.funnelCount}>{step.count.toLocaleString()}</span>
                          <span className={styles.funnelPercentage}>{step.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Top Pages Table */}
              <section className={styles.sectionBox} style={{ overflowX: 'auto', marginBottom: '40px' }}>
                <h2 style={{ marginBottom: '32px' }}>Top Content Performance</h2>
                <table className={styles.pagesTable}>
                  <thead>
                    <tr>
                      <th>Page Title &amp; Route</th>
                      <th style={{ width: '120px', textAlign: 'right' }}>Page Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pages.map((page) => (
                      <tr key={page.path}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '4px' }}>{page.title}</div>
                          <Link href={page.path} className={styles.pathCol} target="_blank">
                            {page.path}
                          </Link>
                        </td>
                        <td className={styles.viewsCol} style={{ textAlign: 'right' }}>
                          {page.views.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* Instructions on how to connect real GA4 credentials */}
              {data.isMock && (
                <section className={styles.guideBanner}>
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    How to Connect Your Live GA4 Data
                  </h3>
                  <p>
                    Currently, the dashboard is running on simulated sandbox data because your Google API keys are not connected. Follow these quick steps to hook up your real Pomegroup.studio Google Analytics 4 reports permanently:
                  </p>
                  
                  <div style={{ paddingLeft: '16px' }}>
                    <ol style={{ listStyleType: 'decimal', color: '#1E3A8A', fontSize: '0.95rem', lineHeight: '1.7' }}>
                      <li style={{ marginBottom: '12px' }}>
                        <strong>Authenticate your Google Account</strong>:<br />
                        Run the local authentication script inside the project directory in your terminal:
                        <div className={styles.codeBlock}>
                          python3 scripts/authenticate_ga4.py
                        </div>
                        This will open a browser to log in with your Google Account and save a secure credentials token to <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px', fontStyle: 'normal' }}>credentials/token.json</code>.
                      </li>
                      <li style={{ marginBottom: '12px' }}>
                        <strong>Retrieve your GA4 Property ID</strong>:<br />
                        Run the list script to print all property names and IDs linked to your account:
                        <div className={styles.codeBlock}>
                          python3 scripts/list_ga4_properties.py
                        </div>
                      </li>
                      <li style={{ marginBottom: '12px' }}>
                        <strong>Configure Environment Variables</strong>:<br />
                        Create a <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px' }}>.env.local</code> file in <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px' }}>pomegroup-website/</code> (or add it in your Vercel project dashboard) and set the Property ID:
                        <div className={styles.codeBlock}>
                          GA4_PROPERTY_ID=your_property_id_number
                        </div>
                      </li>
                    </ol>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
