import styles from './ContactCTA.module.css';

export default function ContactCTA() {
  return (
    <section id="contact" className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        <div className="section-label">Get in Touch</div>
        <h2 className={styles.headline}>
          Have a vision?
          <br />
          Let&apos;s build it together.
        </h2>
        <p className={styles.subtitle}>
          If you&apos;re a domain expert with a bold idea and need a technical co-founder who builds
          — not just advises — I&apos;d love to hear from you.
        </p>
        <div className={styles.actions}>
          <a href="/co-build" className="btn btn-primary">
            Apply to Co-Build
          </a>
          <a
            href="https://linkedin.com/in/mfarimani"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            LinkedIn
          </a>
        </div>
        <p className={styles.location}>📍 Helsinki, Finland</p>
      </div>
    </section>
  );
}
