import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/markdown';
import styles from './page.module.css';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.metaTitle || post.title} — Pomegroup Studio`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: 'article',
      url: `https://pomegroup.studio/resources/blog/${post.slug}`,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <article className={styles.articleContainer}>
          {/* Back Navigation */}
          <Link href="/resources/blog" className={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to resources
          </Link>

          {/* Article Header */}
          <header className={styles.header}>
            <div className={styles.metaRow}>
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{post.readTime || '5 min read'}</span>
              <span>•</span>
              <span>By {post.author || 'Pomegroup Studio'}</span>
            </div>
            <h1 className={styles.title}>{post.title}</h1>
            {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className={styles.imageWrapper}>
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 800px) 100vw, 800px"
                className={styles.featuredImage}
              />
            </div>
          )}

          {/* Article Content */}
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          {/* Author Signature Card */}
          <section className={styles.authorCard}>
            <Image
              src="/images/logo-horizontal.jpg"
              alt="Pomegroup Studio"
              width={100}
              height={40}
              className={styles.authorAvatar}
              style={{ objectFit: 'contain', background: 'var(--color-primary-dark)', padding: '6px' }}
            />
            <div className={styles.authorInfo}>
              <h4>About Pomegroup Studio</h4>
              <p>
                We are a Helsinki-based venture building studio. We partner with domain experts as technical co-founders to turn ideas into robust, scalable software products.
              </p>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
