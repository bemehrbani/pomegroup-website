import styles from './HowItWorks.module.css';

const steps = [
  {
    number: '01',
    title: 'You bring the domain',
    description:
      'Deep industry expertise, market access, and the passion to solve a real problem. You know the space better than anyone.',
    icon: '🧠',
  },
  {
    number: '02',
    title: 'We bring the build',
    description:
      'Technology, product design, AI integration, and operational infrastructure. We handle the entire technical journey from idea to live product.',
    icon: '⚡',
  },
  {
    number: '03',
    title: 'We grow together',
    description:
      'Equity-based partnership with aligned incentives. Not a client-vendor relationship — a true co-founding journey where both parties invest and grow together.',
    icon: '🌱',
  },
];

export default function HowItWorks() {
  return (
    <section id="model" className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-header">
          <div className="section-label">The Model</div>
          <h2>Second co-founder as a service</h2>
          <p>
            Not an agency. Not a freelancer. A true co-founding partner who invests time, expertise,
            and technology alongside you.
          </p>
        </div>

        <div className={styles.grid}>
          {steps.map((step) => (
            <div key={step.number} className={styles.card}>
              <div className={styles.cardIcon}>{step.icon}</div>
              <div className={styles.cardNumber}>{step.number}</div>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.cardDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
