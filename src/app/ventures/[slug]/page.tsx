import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { allVentures, getVentureBySlug } from '@/lib/ventures-data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

interface VenturePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allVentures.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: VenturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const venture = getVentureBySlug(slug);
  if (!venture) return {};

  return {
    title: `${venture.name} — Pomegroup Studio`,
    description: venture.tagline,
  };
}

export default async function VenturePage({ params }: VenturePageProps) {
  const { slug } = await params;
  const venture = getVentureBySlug(slug);

  if (!venture) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <Link href="/#ventures" className={styles.backLink}>
            ← Back to all ventures
          </Link>

          <div className={styles.hero}>
            <div className={styles.heroHeader}>
              <h1 className={styles.name}>{venture.name}</h1>
              <span className={`badge badge-${venture.status.toLowerCase()}`}>
                {venture.status}
              </span>
            </div>
            <p className={styles.tagline}>{venture.tagline}</p>
            <p className={styles.role}>{venture.role}</p>
          </div>

          <div className={styles.layout}>
            <div className={styles.content}>
              <section className={styles.block}>
                <h2>About</h2>
                <p>{venture.description}</p>
              </section>

              {venture.highlights && venture.highlights.length > 0 && (
                <section className={styles.block}>
                  <h2>Key Highlights</h2>
                  <ul className={styles.highlights}>
                    {venture.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </section>
              )}

              {venture.url && (
                <div className={styles.visitLink}>
                  <a
                    href={venture.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Visit {venture.name} →
                  </a>
                </div>
              )}
            </div>

            <aside className={styles.sidebar}>
              {venture.metrics && venture.metrics.length > 0 && (
                <div className={styles.metricsCard}>
                  <h3>Key Metrics</h3>
                  <div className={styles.metricsGrid}>
                    {venture.metrics.map((metric) => (
                      <div key={metric.label} className={styles.metric}>
                        <span className={styles.metricValue}>{metric.value}</span>
                        <span className={styles.metricLabel}>{metric.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.tagsCard}>
                <h3>Technology</h3>
                <div className={styles.tags}>
                  {venture.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
