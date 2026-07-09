import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { marked } from 'marked';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogArticles, getArticleBySlug, getAllArticleSlugs } from '@/lib/blog-data';
import styles from '../blog.module.css';

const BASE_URL = 'https://www.pomegroup.studio';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${article.title} — Pomegroup Studio Blog`,
    description: article.metaDescription,
    keywords: [article.primaryKeyword, ...article.secondaryKeywords],
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `${BASE_URL}/blog/${article.slug}`,
      siteName: 'Pomegroup Studio',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
    },
    alternates: {
      canonical: `${BASE_URL}/blog/${article.slug}`,
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const htmlContent = await marked.parse(article.content);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
      url: article.author.linkedIn,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pomegroup Studio',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${article.slug}`,
    },
    keywords: [article.primaryKeyword, ...article.secondaryKeywords].join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BASE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${BASE_URL}/blog/${article.slug}`,
      },
    ],
  };

  const cta = article.cta ?? { text: 'Apply to Co-Build →', href: '/co-build' };

  return (
    <>
      <Navbar />
      <main className={styles.blogMain}>
        <div className="container">
          <article className={styles.articleContainer}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/blog">Blog</Link>
              <span>/</span>
              <span>{article.title}</span>
            </nav>

            {/* Header */}
            <header className={styles.articleHeader}>
              <div className={styles.cardMeta} style={{ marginBottom: 20 }}>
                <span className={styles.cardCategory}>{article.category}</span>
              </div>
              <h1>{article.title}</h1>
              <div className={styles.articleMeta}>
                <div className={styles.authorInfo}>
                  <div className={styles.authorAvatar}>
                    {article.author.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className={styles.authorName}>{article.author.name}</div>
                    <div className={styles.authorRole}>{article.author.role}</div>
                  </div>
                </div>
                <div className={styles.metaDivider} />
                <div className={styles.metaItem}>
                  {formatDate(article.publishedAt)}
                </div>
                <div className={styles.metaDivider} />
                <div className={styles.metaItem}>
                  {article.readTime}
                </div>
              </div>
              <div className={styles.keywordTags}>
                {article.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </header>

            {/* Body */}
            <div
              className={styles.articleBody}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* CTA Banner */}
            <div className={styles.ctaBanner}>
              <h3>Ready to Turn Your Expertise Into a Product?</h3>
              <p>
                Pomegroup becomes your second co-founder — we handle the code, you handle the domain.
              </p>
              <Link href={cta.href}>{cta.text}</Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
