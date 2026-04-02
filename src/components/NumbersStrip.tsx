import styles from './NumbersStrip.module.css';

const stats = [
  { value: '€45K+', label: 'Generated Revenue' },
  { value: '4+', label: 'Paid Clients' },
  { value: '6+', label: 'Ventures Built' },
  { value: '300K+', label: 'Monthly Active Users' },
  { value: '2', label: 'Successful Exits' },
];

export default function NumbersStrip() {
  return (
    <section className={`${styles.strip} bg-primary`}>
      <div className={`container ${styles.inner}`}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
