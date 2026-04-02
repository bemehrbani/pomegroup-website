import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Image
            src="/images/logo-horizontal.jpg"
            alt="Pomegroup Studio"
            width={160}
            height={65}
            style={{ objectFit: 'contain', borderRadius: '4px' }}
          />
          <p className={styles.tagline}>
            Digital Venture Builder — Helsinki, Finland
          </p>
        </div>
        <div className={styles.links}>
          <a href="#ventures">Ventures</a>
          <a href="#model">How It Works</a>
          <a href="#founder">About</a>
          <a href="#contact">Contact</a>
        </div>
        <div className={styles.legal}>
          © {new Date().getFullYear()} Smart Monshi Oy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
