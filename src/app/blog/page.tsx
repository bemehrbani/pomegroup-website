'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogArticles, type BlogArticle } from '@/lib/blog-data';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import styles from './blog.module.css';

const categories: Array<BlogArticle['category'] | 'All'> = [
  'All',
  'Venture Design',
  'ESG & Sustainability',
  'Construction Tech',
  'Creator Economy',
  'Startup Guide',
  'Build in Public',
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogListingPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered =
    activeCategory === 'All'
      ? blogArticles
      : blogArticles.filter((a) => a.category === activeCategory);

  return (
    <>
      <Navbar />
      <main className={styles.blogMain}>
        <div className="container">
          <div className={styles.listingHeader}>
            <div className="section-label">Insights &amp; Guides</div>
            <h1>The Pomegroup Blog</h1>
            <p>
              Open playbooks, frameworks, and deep dives on building ventures from domain expertise.
              Written by builders, for builders.
            </p>
          </div>

          <div className={styles.filterBar}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterChip} ${activeCategory === cat ? styles.filterChipActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.articlesGrid}>
            {filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={styles.articleCard}
              >
                <div className={styles.cardMeta}>
                  <span className={styles.cardCategory}>{article.category}</span>
                  <span className={styles.cardDate}>
                    <Calendar size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className={styles.cardReadTime}>
                    <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {article.readTime}
                  </span>
                </div>
                <h2 className={styles.cardTitle}>{article.title}</h2>
                <p className={styles.cardExcerpt}>{article.excerpt}</p>
                <div className={styles.cardFooter}>
                  Read article <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginTop: 40 }}>
              No articles in this category yet. Check back soon.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
