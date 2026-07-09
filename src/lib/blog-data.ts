import { batch2Articles } from './blog-articles-batch2';
import { batch3Articles } from './blog-articles-batch3';
import { batch4Articles } from './blog-articles-batch4';
import { batch6Articles } from './blog-articles-batch6';
import { batch5Articles } from './blog-articles-batch5';
import { batch7Articles } from './blog-articles-batch7';
import { batch8Articles } from './blog-articles-batch8';
import { batch10Articles } from './blog-articles-batch10';

import { batch9Articles } from './blog-articles-batch9';


export interface BlogArticle {
  slug: string;
  title: string;
  metaDescription: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
    linkedIn?: string;
  };
  category: 'Venture Design' | 'ESG & Sustainability' | 'Construction Tech' | 'Creator Economy' | 'Startup Guide' | 'Build in Public';
  tags: string[];
  readTime: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  excerpt: string;
  content: string;
  cta?: {
    text: string;
    href: string;
  };
}

const defaultAuthor = {
  name: 'Mahdi Farimani',
  role: 'Founder & CTO, Pomegroup Studio',
  linkedIn: 'https://www.linkedin.com/in/mahdifarimani/',
};

const defaultCta = {
  text: 'Apply to Co-Build →',
  href: '/co-build',
};

export const blogArticles: BlogArticle[] = [
  {
    slug: 'equity-splits-technical-co-founder',
    title: "The Non-Technical Founder's Guide to Equity Splits with a Technical Co-Founder",
    metaDescription: 'Learn how to fairly split equity between technical and business co-founders. Covers vesting, cliff periods, dynamic equity, and real-world frameworks.',
    publishedAt: '2026-07-09',
    updatedAt: '2026-07-09',
    author: defaultAuthor,
    category: 'Startup Guide',
    tags: ['Equity', 'Co-Founder', 'Startup', 'Partnership', 'Legal'],
    readTime: '12 min read',
    primaryKeyword: 'equity split technical vs business co-founders',
    secondaryKeywords: [
      'startup equity split',
      'co-founder agreement',
      'technical co-founder equity',
      'equity-based development',
      'startup equity split CTO',
      'fair equity split early startup',
    ],
    excerpt:
      'Splitting equity with a technical co-founder is one of the most consequential decisions you will make as a non-technical founder. This guide breaks down frameworks, vesting schedules, and real-world models to help you structure a fair deal that keeps everyone motivated.',
    cta: defaultCta,
    content: `## Why Equity Splits Make or Break Startups

You have the domain expertise, the industry network, and the vision. What you don't have is the ability to build the product yourself. Finding a technical co-founder feels like finding a needle in a haystack — and once you find one, the question of equity becomes the elephant in the room.

According to a 2023 analysis by Carta, **65% of startup co-founder disputes stem from equity disagreements**, and roughly 1 in 5 startups fail because of co-founder conflict before ever reaching product-market fit. Getting equity right is not just a financial decision; it is a foundational relationship decision.

This guide gives you the frameworks, data, and practical tools to structure an equity split that is fair, motivating, and legally sound.

---

## The Three Core Equity Models

There is no single "correct" equity split. The right model depends on your startup's stage, each founder's contribution, and your risk profile. Here are the three most common approaches:

### 1. Fixed Split (Most Common)

You agree on a percentage upfront, and it stays that way (subject to vesting). The classic 50/50 split falls into this category, as does any negotiated ratio like 60/40 or 70/30.

**When it works:** Both founders are going full-time from day one, contributing comparable value, and there is high mutual trust.

**When it fails:** One founder contributes significantly more in the first year while the other is still "transitioning" from their day job.

### 2. Dynamic Equity (Slicing Pie Model)

Popularised by Mike Moyer's *Slicing Pie* framework, dynamic equity adjusts ownership based on each founder's ongoing contributions — time, money, intellectual property, relationships, and more. Contributions are tracked and converted into "slices" at agreed-upon market rates.

**When it works:** Pre-revenue startups where both founders are contributing part-time and contributions are uneven.

**When it fails:** After significant external investment, as investors generally require a fixed cap table.

### 3. Milestone-Based Equity

Equity is allocated in tranches tied to specific deliverables or company milestones. For example, a CTO might earn 10% upon MVP delivery, another 10% at product launch, and a final 5% at first revenue milestone.

**When it works:** When the technical co-founder is not full-time initially, or when there is a clear product roadmap with measurable checkpoints.

**When it fails:** If milestones are poorly defined or subjective, leading to disputes over whether they have been met.

---

## Equity Models Comparison

| Model | Flexibility | Simplicity | Investor-Friendly | Best For |
|-------|------------|-----------|-------------------|----------|
| Fixed 50/50 | Low | High | High | Equal full-time commitment from day one |
| Fixed Negotiated (e.g., 60/40) | Low | High | High | Unequal contribution or risk levels |
| Dynamic (Slicing Pie) | High | Low | Medium | Pre-revenue, part-time contributors |
| Milestone-Based | Medium | Medium | Medium | Phased engagement with clear deliverables |

---

## Vesting: The Non-Negotiable Safety Net

Regardless of the equity model you choose, **vesting is non-negotiable**. Vesting ensures that equity is earned over time rather than granted all at once. If a co-founder leaves after three months, they should not walk away with 50% of the company.

### The Standard Vesting Schedule

The industry standard is a **4-year vesting period with a 1-year cliff**:

- **Cliff period (12 months):** No equity vests during the first year. If a co-founder leaves before the cliff, they receive nothing.
- **Monthly or quarterly vesting:** After the cliff, equity vests in equal monthly or quarterly instalments over the remaining 36 months.
- **Acceleration clauses:** Consider single-trigger or double-trigger acceleration in the event of acquisition to protect founders.

### Reverse Vesting for Founders

For co-founders who receive equity at incorporation, **reverse vesting** is the standard mechanism. All shares are issued upfront but subject to a repurchase right by the company. As the vesting schedule progresses, the repurchase right lapses and the shares become "earned."

> **Pro tip:** In EU jurisdictions (particularly the Netherlands, Germany, and France), the tax treatment of founder equity varies significantly. Always consult a local tax advisor before finalising your vesting structure.

---

## What Actually Determines a Fair Split?

Forget the gut-feel negotiations over coffee. A fair equity split should be based on a weighted assessment of concrete factors:

### 1. Time Commitment

Is one founder going full-time while the other is working evenings and weekends? The founder who takes on more opportunity cost (leaving a €120K salary vs. a €50K salary) is taking on more risk.

### 2. Capital Contribution

Has one founder invested personal savings to cover early expenses — servers, domain, legal fees, incorporation costs? Cash contributions should be accounted for, either through equity or through a convertible note.

### 3. Intellectual Property

Does one founder bring existing IP, proprietary algorithms, or a codebase that accelerates the product? Prior IP has real market value and should be factored into the split.

### 4. Domain Expertise and Network

The business founder's rolodex of industry contacts, regulatory knowledge, and market insight can be just as valuable as technical skill. A founder who can bring the first 10 paying customers is making a quantifiable contribution.

### 5. Replaceability

This is the uncomfortable question: how hard is it to find someone else who can do what each founder does? In 2026, the market rate for a senior full-stack developer in Europe is €85K–€130K. If your technical co-founder is bringing rare expertise (ML/AI, blockchain, embedded systems), their replaceability is lower and their equity claim stronger.

### 6. Risk Profile

Who is giving up more to join the venture? A founder leaving a stable BigTech role to join a pre-revenue startup is taking on substantially more personal financial risk than a founder who is bootstrapping while freelancing.

---

## The Pomegroup Venture Studio Model: A Case Study

At Pomegroup, we have structured our venture studio model to address the fundamental tension between technical and non-technical co-founders. Rather than a simple service-for-equity arrangement, our model is designed as a true co-building partnership.

### How It Works

1. **Domain Expert Application:** Non-technical founders with validated domain expertise and a clear market thesis apply through our co-build programme.
2. **Joint Validation:** We conduct a structured 2-week validation sprint together — user research, competitive analysis, and technical feasibility assessment.
3. **Equity Range:** If we proceed to build, Pomegroup takes a **20–50% equity stake** depending on the scope of technical contribution, capital investment, and ongoing operational involvement.
4. **Contribution Variables:**
   - **20–30%** — Pomegroup provides part-time technical leadership plus a development team; the domain founder leads operations, sales, and fundraising full-time.
   - **30–40%** — Pomegroup provides full-time CTO-level involvement plus end-to-end product development; the domain founder focuses on business development and go-to-market.
   - **40–50%** — Pomegroup co-invests capital alongside technical contribution, shares in operational costs, and provides strategic advisory.

5. **Standard Terms:** All equity is subject to 4-year reverse vesting with a 1-year cliff. Both parties sign a comprehensive co-founder agreement covering IP assignment, non-compete, decision-making authority, and exit provisions.

### Why This Model Works

Traditional dev agencies charge €150K–€500K to build an MVP with zero ongoing commitment. When the codebase breaks at scale, you are on your own. The venture studio model aligns incentives: Pomegroup succeeds only if the venture succeeds. This results in higher code quality, longer-term architectural thinking, and genuine strategic partnership.

---

## Common Mistakes to Avoid

### 1. Splitting 50/50 by Default

Equal splits feel fair, but they often are not. If one founder is full-time and the other is part-time, a 50/50 split creates resentment. The Y Combinator data suggests that **teams with negotiated (unequal) splits actually have higher survival rates** than teams that default to 50/50 without discussion.

### 2. No Vesting Schedule

Granting equity without vesting is the single most common mistake first-time founders make. Without vesting, a co-founder who leaves after two months still owns their full share — and can block future fundraising, acquisitions, or pivots.

### 3. Handshake Agreements

Verbal agreements are not enforceable and create ambiguity. Every co-founder arrangement needs:
- A **co-founder agreement** specifying roles, responsibilities, equity, vesting, IP assignment, and decision-making.
- A **shareholders' agreement** covering voting rights, anti-dilution, tag-along/drag-along, and exit provisions.
- An **IP assignment agreement** ensuring all intellectual property created for the venture belongs to the company, not the individual.

### 4. Ignoring Tax Implications

In many EU countries, receiving equity can trigger a taxable event even before the shares have any market value. Section 409A valuations (in the US) and similar mechanisms in Europe exist specifically to address this. Get professional tax advice before distributing equity.

### 5. Giving Away Too Much Too Early

Reserving equity for future hires, advisors, and investors is critical. A standard option pool is **10–15% of total equity**. If you give away 80% to co-founders at incorporation, you will face painful dilution when you raise your first round.

---

## Decision Framework: How to Choose Your Model

Use this framework to guide your equity conversation:

**Step 1 — Quantify Contributions**
List every founder's contribution across the six factors above (time, capital, IP, expertise, replaceability, risk). Assign a relative weight to each factor based on your venture's specific needs.

**Step 2 — Benchmark Against Market Rates**
What would it cost to hire each founder's contribution at market rates? If your CTO's contribution would cost €150K/year on the open market and your business founder's contribution would cost €100K/year, that ratio is a reasonable starting point for negotiation.

**Step 3 — Agree on Vesting**
Lock in a 4-year vesting schedule with a 1-year cliff. No exceptions, no shortcuts.

**Step 4 — Reserve the Option Pool**
Set aside 10–15% for future employees and advisors before calculating co-founder splits.

**Step 5 — Document Everything**
Engage a startup lawyer to draft the co-founder agreement, shareholders' agreement, and IP assignment. Budget €3K–€8K for proper legal documentation — it is cheap insurance against a six-figure dispute later.

**Step 6 — Schedule Regular Check-Ins**
Equity is set at the beginning, but expectations change. Schedule quarterly co-founder alignment sessions to discuss roles, contributions, and any adjustments needed.

---

## Key Takeaways

- There is no universal "right" equity split — it depends on contribution, risk, and commitment.
- **Vesting with a cliff is mandatory.** No exceptions.
- Dynamic equity works well pre-revenue; fixed splits work better once you are raising capital.
- Document your agreement legally, not just verbally.
- Reserve 10–15% for an employee option pool before splitting founder equity.
- Consider a venture studio model like Pomegroup's if you want aligned incentives and long-term technical partnership rather than a transactional dev-for-equity arrangement.

If you are a domain expert looking for a technical co-founder who builds with you — not just for you — we would love to hear about your venture.`,
  },
  {
    slug: 'vsme-standard-implementation-guide',
    title: 'VSME Standard: Step-by-Step Implementation Guide for SME Suppliers',
    metaDescription: 'A practical guide to implementing the VSME sustainability reporting standard. Covers CSRD trickle-down, data points, VSME vs ESRS, and step-by-step compliance.',
    publishedAt: '2026-07-09',
    updatedAt: '2026-07-09',
    author: defaultAuthor,
    category: 'ESG & Sustainability',
    tags: ['VSME', 'CSRD', 'ESG', 'Sustainability', 'SME', 'EU Regulation'],
    readTime: '10 min read',
    primaryKeyword: 'VSME standard',
    secondaryKeywords: [
      'VSME implementation',
      'CSRD for SMEs',
      'sustainability reporting small business',
      'ESG requirements for suppliers',
      'VSME vs ESRS',
      'CSRD supply chain data',
    ],
    excerpt:
      'The VSME standard gives SME suppliers a proportionate framework for sustainability reporting without the full complexity of ESRS. This step-by-step guide walks you through implementation, data requirements, and how to turn compliance into competitive advantage.',
    cta: defaultCta,
    content: `## The Trickle-Down Effect: Why SMEs Can No Longer Ignore Sustainability Reporting

Since the European Commission's Omnibus I simplification package in February 2026, the conversation around corporate sustainability reporting has shifted dramatically. While the package reduced the number of companies directly subject to the Corporate Sustainability Reporting Directive (CSRD) by roughly 80%, it did something else entirely: it clarified and intensified the **supply chain data requirements** for large companies that remain in scope.

Here is the reality that many SMEs are waking up to in mid-2026: even if your company is not directly subject to CSRD, **your largest customers almost certainly are**. And they need sustainability data from their supply chain to fulfil their own reporting obligations.

A 2025 survey by the European Federation of Accountants (EFAA) found that **42% of EU-based SMEs had already received ESG data requests from enterprise customers**, and that number is projected to reach 70% by 2027. For SME suppliers, the question is no longer *whether* to report, but *how* — and the VSME standard provides the answer.

---

## What Is the VSME Standard?

The **Voluntary Sustainability Reporting Standard for SMEs** (VSME) was developed by the European Financial Reporting Advisory Group (EFRAG) as a proportionate, modular reporting framework designed specifically for small and medium-sized enterprises.

Unlike the full European Sustainability Reporting Standards (ESRS) — which comprise 12 topical standards, over 1,100 data points, and require double materiality assessments — the VSME standard is built on three principles:

1. **Proportionality:** Data requirements are scaled to SME capacity and resources.
2. **Modularity:** Companies can start with a basic module and expand as needed.
3. **Interoperability:** VSME outputs are designed to feed directly into the ESRS value chain disclosures of larger companies.

### The Three VSME Modules

| Module | Scope | Data Points | Recommended For |
|--------|-------|-------------|-----------------|
| **Basic** | Core environmental and social metrics | ~30 data points | Micro-enterprises and first-time reporters |
| **Narrative-PAT** | Policies, actions, and targets alongside basic metrics | ~60 data points | Small companies with existing sustainability initiatives |
| **Business Partners** | Comprehensive data aligned to enterprise customer requests | ~90 data points | SMEs supplying to CSRD-reporting companies |

> **Important:** Post-Omnibus I, the Business Partners module has become the de facto expectation for SME suppliers in regulated value chains. If your primary customers are CSRD-reporting enterprises, plan for this module from the start.

---

## Why VSME Matters for Your Business

### 1. Customer Retention

Large enterprises are increasingly making sustainability data a **procurement criterion**. A 2026 report by EcoVadis found that 38% of European enterprise procurement teams now include ESG scoring in supplier evaluations, up from 22% in 2024. Suppliers who cannot provide structured sustainability data risk being replaced by competitors who can.

### 2. Access to Finance

The EU Taxonomy and the European Green Deal Industrial Plan are channelling billions in green finance toward sustainable businesses. Banks and investors are using ESG data — including VSME-format reports — to assess lending risk. The European Investment Bank (EIB) now requires sustainability disclosures for SME loans above €500K.

### 3. Competitive Differentiation

In sectors like construction, food supply, and manufacturing, sustainability performance is becoming a differentiator. An SME that can provide verified ESG data wins contracts over one that cannot — even if pricing is comparable.

### 4. Regulatory Preparedness

While VSME is currently voluntary, the European Commission has signalled that proportionate SME reporting requirements may become mandatory by 2028–2029. Early adopters avoid the scramble and build institutional knowledge ahead of deadlines.

---

## Step-by-Step VSME Implementation Guide

### Step 1: Assess Your Reporting Obligation and Module

Before collecting any data, determine which VSME module is appropriate for your business.

**Action items:**
- Identify your largest customers and check whether they are subject to CSRD reporting.
- Request their specific data requirements — many large companies now issue standardised sustainability questionnaires aligned to ESRS value chain disclosures.
- Map their requirements against the three VSME modules to determine your minimum reporting scope.
- If you supply to multiple CSRD-reporting customers, target the **Business Partners module** to satisfy the broadest set of requirements.

### Step 2: Conduct a Baseline Data Inventory

Understand what data you already have and what gaps exist.

**Core data categories under VSME:**

- **Environmental:** Energy consumption (kWh), greenhouse gas emissions (Scope 1 and Scope 2 in tCO₂e), water consumption (m³), waste generated and diverted from landfill (tonnes).
- **Social:** Total workforce headcount, gender diversity breakdown, health and safety incidents (LTIR), training hours per employee, living wage compliance.
- **Governance:** Anti-corruption policy status, data protection measures, supply chain due diligence procedures.

**Action items:**
- Audit existing data sources: utility bills, payroll systems, HR records, waste management contracts.
- Identify gaps where data is not currently collected or is collected inconsistently.
- Prioritise gaps by impact: energy and emissions data are typically the first data points requested by enterprise customers.

### Step 3: Establish Data Collection Processes

Move from ad hoc data gathering to systematic collection.

**Action items:**
- Assign a **sustainability data owner** — this does not need to be a full-time role, but someone must be accountable. In companies under 50 employees, this is often the finance manager or operations lead.
- Set up a **data collection cadence**: monthly for energy, water, and waste; quarterly for workforce metrics; annually for governance policies.
- Standardise units and methodologies. Use the GHG Protocol for emissions calculations and the EFRAG implementation guidance for metric definitions.
- Create a simple spreadsheet or digital tool to centralise data. You do not need expensive ESG software at this stage — a well-structured spreadsheet with validation rules is sufficient for the Basic and Narrative-PAT modules.

### Step 4: Calculate Your Carbon Footprint

Greenhouse gas emissions are the single most requested data point from enterprise customers. VSME requires Scope 1 (direct emissions) and Scope 2 (purchased energy emissions) at minimum.

**Action items:**
- **Scope 1:** Inventory all direct emission sources — company vehicles (fuel consumption), on-site heating (natural gas or oil), refrigerant use, and any manufacturing process emissions.
- **Scope 2:** Collect electricity and district heating invoices. Apply location-based emission factors from the European Environment Agency (EEA) or your national energy agency.
- Use free calculation tools like the [SME Climate Hub calculator](https://smeclimatehub.org) or the GHG Protocol's SME tool.
- Document your calculation methodology — enterprise customers and auditors will ask how you arrived at your numbers.

> **Tip:** If your enterprise customers require Scope 3 data from their suppliers (your Scope 1 and 2 become their Scope 3), accuracy matters more than precision. A well-documented estimate is better than an undocumented guess.

### Step 5: Draft Your VSME Report

Structure your report according to the EFRAG VSME template.

**Report structure for the Business Partners module:**

1. **Company Profile:** Legal name, sector (NACE code), headcount, revenue band, primary business activities.
2. **Environmental Disclosures:** Energy mix, GHG emissions (Scope 1 and 2), emissions intensity ratios, water and waste metrics, environmental policies and targets.
3. **Social Disclosures:** Workforce composition, diversity metrics, health and safety performance, training and development, human rights due diligence.
4. **Governance Disclosures:** Business conduct policies, anti-corruption measures, data protection, supply chain management.
5. **Policies, Actions, and Targets (PAT):** For each material topic, describe your current policy, actions taken during the reporting period, and quantified targets for the next 1–3 years.

**Action items:**
- Download the EFRAG VSME reporting template (available on the EFRAG website).
- Complete each section using your baseline data.
- Keep narrative sections concise and factual — avoid greenwashing language.
- Include a methodology note explaining data sources, calculation methods, and any assumptions or estimates.

### Step 6: Validate and Review

Before publishing or sharing your VSME report, ensure data quality.

**Action items:**
- Conduct an **internal review** — have someone outside the data collection process check figures against source documents.
- Consider a **limited assurance engagement** with an external auditor. While not required under VSME, assured data carries more weight with enterprise customers. Costs for SME-level assurance typically range from €2K–€8K depending on complexity.
- Cross-reference your report against the specific data requests from your enterprise customers to ensure completeness.
- Run a final consistency check: do year-over-year trends make sense? Are there any outliers that need explanation?

### Step 7: Share, Integrate, and Iterate

Your VSME report is not a one-off document — it is the foundation of an ongoing sustainability data practice.

**Action items:**
- Share your report with enterprise customers through their preferred channels (sustainability questionnaires, procurement portals, or direct submission).
- Publish a summary on your website to signal commitment to transparency.
- Integrate sustainability KPIs into your regular management reporting — this normalises ESG data as part of business operations, not a separate compliance exercise.
- Set a calendar reminder to begin next year's data collection cycle at least 8 weeks before your reporting deadline.
- Track which metrics improve and which do not — use the data to identify cost savings (energy efficiency), risk reduction (safety improvements), and commercial opportunities (green product lines).

---

## VSME vs Full ESRS: A Side-by-Side Comparison

| Dimension | VSME (Business Partners Module) | Full ESRS |
|-----------|-------------------------------|-----------|
| **Target Audience** | SMEs, particularly supply chain participants | Large companies and listed SMEs under CSRD |
| **Total Data Points** | ~90 | 1,100+ |
| **Double Materiality Assessment** | Simplified or not required | Mandatory and comprehensive |
| **Scope 3 Emissions** | Not required (Scope 1 & 2 only) | Required for material categories |
| **Assurance Requirement** | Voluntary | Mandatory (limited, moving to reasonable) |
| **Estimated Implementation Cost** | €2K–€15K (first year) | €50K–€500K+ (first year) |
| **Estimated Time Investment** | 40–120 hours (first year) | 500–2,000+ hours (first year) |
| **Report Format** | Flexible (template-based) | Structured digital taxonomy (XBRL) |
| **Governance Disclosures** | Basic policy statements | Detailed board oversight and incentive structures |

---

## Key Data Points Under VSME Business Partners Module

For quick reference, here are the most commonly requested data points by enterprise customers:

**Environmental (highest priority for most sectors):**
- Total energy consumption (MWh) and renewable energy share (%)
- Scope 1 GHG emissions (tCO₂e)
- Scope 2 GHG emissions — location-based and market-based (tCO₂e)
- GHG emissions intensity (tCO₂e per €M revenue or per unit of output)
- Total water withdrawal (m³) by source
- Total waste generated (tonnes) and recycling/recovery rate (%)

**Social:**
- Total headcount (FTE) and contractor workforce
- Gender diversity (% female in workforce, management, and board)
- Lost-time injury rate (LTIR) and fatalities
- Average training hours per employee
- Living wage or fair wage policy status

**Governance:**
- Anti-corruption and anti-bribery policy (yes/no, scope)
- Data protection and privacy policy (GDPR compliance status)
- Supplier code of conduct (yes/no, coverage %)
- Whistleblower/reporting mechanism (yes/no)

---

## How ExecutESG Supports VSME Implementation

At Pomegroup, we recognised early that SME suppliers would face an increasing burden of sustainability data requests without proportionate tools to manage them. That is why we co-built **ExecutESG** — a platform designed specifically to help small and mid-sized companies collect, manage, and report sustainability data aligned to the VSME standard.

ExecutESG streamlines the process by:
- Providing pre-configured data collection templates mapped to VSME modules.
- Automating GHG calculations using emission factor databases updated for 2026.
- Generating customer-ready reports that align with the most common enterprise sustainability questionnaires.
- Tracking year-over-year performance so you can demonstrate progress, not just compliance.

If you are an ESG consultant or sustainability advisor looking to productize your expertise and serve SME clients at scale, we would love to explore a co-build partnership.

---

## Key Takeaways

- Post-Omnibus I, **SME suppliers are the new frontier of sustainability reporting** — not because they are legally required to report, but because their customers are.
- The VSME standard provides a **proportionate, modular framework** that avoids the complexity of full ESRS while delivering the data enterprise customers need.
- Start with a **baseline data inventory** and focus on the data points your largest customers are actually requesting.
- **Carbon footprint calculation** (Scope 1 and 2) is the single most impactful starting point.
- Implementation costs for VSME are a fraction of full ESRS — typically **€2K–€15K in the first year** — and decrease significantly in subsequent years as processes mature.
- Early adoption is a **competitive advantage**, not just a compliance cost. Suppliers with structured ESG data win more contracts, access better financing, and build resilience.

The companies that treat sustainability reporting as a strategic capability — rather than an administrative burden — will be the ones that thrive in the next decade of European regulation.`,
  },
  ...batch2Articles,
  ...batch3Articles,
  ...batch4Articles,
  ...batch5Articles,
  ...batch6Articles,
  ...batch7Articles,
  ...batch8Articles,
  ...batch9Articles,
  ...batch10Articles,
];


export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return blogArticles.map((article) => article.slug);
}

export function getArticlesByCategory(category: BlogArticle['category']): BlogArticle[] {
  return blogArticles.filter((article) => article.category === category);
}

export { defaultAuthor, defaultCta };
