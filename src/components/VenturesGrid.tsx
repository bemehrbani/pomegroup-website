import Link from 'next/link';
import { activeVentures } from '@/lib/ventures-data';
import styles from './VenturesGrid.module.css';

export default function VenturesGrid() {
  return (
    <section id="ventures" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">Portfolio</div>
          <h2>Ventures we&apos;ve built</h2>
          <p>
            From ESG compliance to blockchain events, AI translation to gaming — each venture is a
            partnership with domain experts who bring the vision.
          </p>
        </div>

        <div className={styles.grid}>
          {activeVentures.map((venture) => (
            <Link
              key={venture.slug}
              href={`/ventures/${venture.slug}`}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.cardName}>{venture.name}</h3>
                <span className={`badge badge-${venture.status.toLowerCase()}`}>
                  {venture.status}
                </span>
              </div>
              <p className={styles.cardTagline}>{venture.tagline}</p>
              <div className={styles.cardTags}>
                {venture.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              {venture.metrics && venture.metrics.length > 0 && (
                <div className={styles.cardMetric}>
                  <span className={styles.metricValue}>
                    {venture.metrics[0].value}
                  </span>
                  <span className={styles.metricLabel}>
                    {venture.metrics[0].label}
                  </span>
                </div>
              )}
              <div className={styles.cardRole}>{venture.role}</div>
              <div className={styles.cardArrow}>→</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
