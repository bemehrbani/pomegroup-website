import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllBlogPosts } from '@/lib/markdown';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Blog & Insights — Pomegroup Studio',
  description:
    'Read our latest articles on startup builder strategies, AI engineering, design systems, and building in public. We share our playbooks, failures, and tools.',
  openGraph: {
    title: 'Blog & Insights — Pomegroup Studio',
    description: 'Practical playbooks, guides, and learnings for solo founders and builders.',
    url: 'https://pomegroup.studio/resources/blog',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  // Find the first featured post, or fall back to the newest post
  const featuredPost = posts.find((p) => p.isPublished) || posts[0];
  const gridPosts = posts.filter((p) => p.slug !== (featuredPost?.slug || ''));

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          {/* Hero Section */}
          <header className={styles.hero}>
            <div className="section-label">Resources</div>
            <h1>Insights &amp; Playbooks</h1>
            <p>
              We believe in building in public and giving away 99% of our knowledge. Here you will find our raw learnings, strategies, and templates for launching digital ventures.
            </p>
          </header>

          {posts.length === 0 ? (
            <div className={styles.empty}>
              <h3>No Articles Yet</h3>
              <p>We are busy building! Check back soon for our first published playbooks.</p>
              <Link href="/" className="btn btn-primary mt-6">
                Go back home
              </Link>
            </div>
          ) : (
            <>
              {/* Featured Post Card */}
              {featuredPost && (
                <section className={styles.featuredSection}>
                  <div className={styles.featuredCard}>
                    <div className={styles.featuredImageWrapper}>
                      {featuredPost.featuredImage ? (
                        <Image
                          src={featuredPost.featuredImage}
                          alt={featuredPost.title}
                          fill
                          priority
                          sizes="(max-width: 992px) 100vw, 50vw"
                          className={styles.featuredImage}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-white)',
                            fontSize: '3rem',
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                          }}
                        >
                          POME
                        </div>
                      )}
                    </div>
                    <div className={styles.featuredContent}>
                      <div className={styles.metaRow}>
                        <span>{new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>{featuredPost.readTime || '5 min read'}</span>
                      </div>
                      <h2>
                        <Link href={`/resources/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>
                      <p>{featuredPost.excerpt}</p>
                      <div>
                        <Link href={`/resources/blog/${featuredPost.slug}`} className={styles.readMore}>
                          Read Article
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Grid Section */}
              {gridPosts.length > 0 && (
                <section className={styles.gridSection}>
                  <h2 className={styles.gridTitle}>All Playbooks</h2>
                  <div className={styles.grid}>
                    {gridPosts.map((post) => (
                      <article key={post.slug} className={styles.card}>
                        <div className={styles.imageWrapper}>
                          {post.featuredImage ? (
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className={styles.cardImage}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-white)',
                                fontSize: '2rem',
                                fontWeight: 800,
                                letterSpacing: '0.1em',
                              }}
                            >
                              POME
                            </div>
                          )}
                        </div>
                        <div className={styles.cardContent}>
                          <div className={styles.metaRow}>
                            <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>{post.readTime || '5 min read'}</span>
                          </div>
                          <h3>
                            <Link href={`/resources/blog/${post.slug}`}>
                              {post.title}
                            </Link>
                          </h3>
                          <p>{post.excerpt}</p>
                          <div>
                            <Link href={`/resources/blog/${post.slug}`} className={styles.readMore}>
                              Read Article
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
