import { pastVentures } from '@/lib/ventures-data';
import styles from './FounderSection.module.css';

export default function FounderSection() {
  return (
    <section id="founder" className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.intro}>
            <div className="section-label">About the Founder</div>
            <h2 className={styles.greeting}>
              Hi, I&apos;m Mahdi
            </h2>
            <p className={styles.bio}>
              I&apos;m a serial co-founder and venture builder based in Helsinki, Finland. With an MBA
              from Sharif University of Technology and over a decade of building companies — from
              legal marketplaces and HR platforms in Iran to blockchain event systems and ESG tools
              in Europe — I&apos;ve found that the most impactful work happens when domain experts and
              builders join forces.
            </p>
            <p className={styles.bio}>
              Pomegroup Studio is the formalization of a pattern I&apos;ve lived my entire career: find
              the expert, build the product, grow together. The pomegranate metaphor — individual
              seeds, each distinct, held together as one — has guided this vision for over 13 years.
            </p>
            <div className={styles.skills}>
              <div className={styles.skill}>Enterprise SaaS</div>
              <div className={styles.skill}>AI & NLP</div>
              <div className={styles.skill}>Blockchain & Web3</div>
              <div className={styles.skill}>Mobile Apps</div>
              <div className={styles.skill}>DevOps & CI/CD</div>
            </div>
          </div>

          <div className={styles.trackRecord}>
            <h3 className={styles.trackTitle}>Founder Track Record</h3>
            <div className={styles.timeline}>
              {pastVentures.map((venture) => (
                <div key={venture.slug} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineHeader}>
                      <span className={styles.timelineName}>{venture.name}</span>
                      <span className={styles.timelineRole}>{venture.role}</span>
                    </div>
                    <p className={styles.timelineDesc}>{venture.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
