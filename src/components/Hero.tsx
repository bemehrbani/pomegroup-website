import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <div className="section-label">Helsinki-Based Venture Studio</div>
          <h1 className={styles.headline}>
            We become your
            <span className={styles.highlight}> second co-founder</span>
          </h1>
          <p className={styles.subtitle}>
            Pomegroup is a digital venture builder studio. We partner with domain experts to turn
            bold ideas into market-ready products — handling technology, product, and operations from
            zero to one and beyond.
          </p>
          <div className={styles.actions}>
            <a href="#contact" className="btn btn-primary">
              Let&apos;s Build Together
            </a>
            <a href="#ventures" className="btn btn-outline">
              See Our Ventures
            </a>
          </div>
        </div>
        <div className={styles.visual}>
          <div className={styles.metricCard}>
            <span className={styles.metricValue}>6+</span>
            <span className={styles.metricLabel}>Ventures Built</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricValue}>300K+</span>
            <span className={styles.metricLabel}>Users Reached</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricValue}>2</span>
            <span className={styles.metricLabel}>Successful Exits</span>
          </div>
        </div>
      </div>
    </section>
  );
}
