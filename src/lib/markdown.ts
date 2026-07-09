import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  featuredImage?: string;
  excerpt: string;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  author?: string;
  readTime?: string;
  contentHtml: string;
}

const contentDirectory = path.join(process.cwd(), 'content/blog');

// Simple helper to parse YAML frontmatter line-by-line
function parseFrontmatter(fileContent: string): { frontmatter: Record<string, any>; content: string } {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: fileContent };
  }

  const yamlText = match[1];
  const bodyContent = match[2];
  const frontmatter: Record<string, any> = {};

  yamlText.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  });

  return { frontmatter, content: bodyContent };
}

/**
 * Retrieves all blog posts sorted by date descending.
 */
export function getAllBlogPosts(): BlogPost[] {
  // Ensure the directory exists
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const { frontmatter, content } = parseFrontmatter(fileContents);

      // Setup marked renderer custom classes if desired
      const contentHtml = marked.parse(content) as string;

      const isPublished = String(frontmatter.is_published).toLowerCase() === 'true';

      return {
        slug,
        title: frontmatter.title || 'Untitled Post',
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        featuredImage: frontmatter.featured_image || undefined,
        excerpt: frontmatter.excerpt || '',
        isPublished,
        metaTitle: frontmatter.meta_title || undefined,
        metaDescription: frontmatter.meta_description || undefined,
        author: frontmatter.author || 'Pomegroup Studio',
        readTime: frontmatter.read_time || '5 min read',
        contentHtml,
      };
    })
    // Filter to only published posts in production, or all in development
    .filter((post) => {
      if (process.env.NODE_ENV === 'production') {
        return post.isPublished;
      }
      return true;
    })
    // Sort posts by date descending
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

/**
 * Retrieves a single blog post by its slug.
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { frontmatter, content } = parseFrontmatter(fileContents);
    const contentHtml = marked.parse(content) as string;
    const isPublished = String(frontmatter.is_published).toLowerCase() === 'true';

    return {
      slug,
      title: frontmatter.title || 'Untitled Post',
      date: frontmatter.date || new Date().toISOString().split('T')[0],
      featuredImage: frontmatter.featured_image || undefined,
      excerpt: frontmatter.excerpt || '',
      isPublished,
      metaTitle: frontmatter.meta_title || undefined,
      metaDescription: frontmatter.meta_description || undefined,
      author: frontmatter.author || 'Pomegroup Studio',
      readTime: frontmatter.read_time || '5 min read',
      contentHtml,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}
