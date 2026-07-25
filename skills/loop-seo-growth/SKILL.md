---
name: loop-seo-growth
description: Organic traffic growth loop for pomegroup.studio. Audits SEO, drafts content in content/blog, and verifies build health.
---

# Organic Growth Loop Skill (`loop-seo-growth`)

This skill governs the automated growth of organic search traffic for `pomegroup.studio`.

## Cadence & Trigger
- **Cadence**: Weekly (or manually triggered)
- **Target Directory**: `content/blog/`

## Phase 1: SEO Audit & Gap Discovery
1. Read existing blog posts in `content/blog/`.
2. Inspect metadata (title, description, slug, keywords).
3. Identify missing topics relevant to Pomegroup Studio (e.g. EU startup visas, Business Finland grants, ESG compliance, co-building models).

## Phase 2: Content Generation (Maker)
1. Draft a high-value markdown article in `content/blog/<slug>.md`.
2. Follow standard frontmatter structure:
   ```markdown
   ---
   title: "Descriptive SEO Title"
   date: "YYYY-MM-DD"
   description: "Meta description between 140-160 characters."
   author: "Pomegroup Studio"
   category: "Funding / Startup Visa / ESG"
   ---
   ```

## Phase 3: Verification (Checker)
1. Ensure no broken internal links exist.
2. Run `npm run build` in an isolated worktree to ensure Next.js static page generation succeeds (`/blog/[slug]`).

## Phase 4: State & Indexing
1. Update `STATE.md` under `## Organic Growth Watch List`.
2. Trigger IndexNow API (`/api/indexnow`) upon publication.
