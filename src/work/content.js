// All copy and media for the work page lives here.
//
// Gallery frames:
//   size: 'large'  → 3:2, for full-screen UI
//         'medium' → 4:5, for phone screens and close-ups
//         'grid'   → 3:2 frame split into four close-ups (pass `items`)
//   src:  put files in public/work/<company>/ and reference them as '/work/<company>/file.png'.
//         .mp4 / .webm play as muted loops (use these instead of .gif, they're much smaller).
//         Leave src out to show a placeholder; `art` picks the placeholder shape.
//   motion: true shows the GIF badge.
//
// Anything in [brackets] is a placeholder to fill in.

export const intro = {
  name: 'Vivian Lo',
  bioUrl: 'https://vvnlo.com/',
  email: 'hello@vvnlo.com',
  title: 'Selected work',
  summary: 'Products I designed and teams I led at Brightwave, Shopify and N26.',
  nda: 'Some case studies are password-protected under NDA. Email hello@vvnlo.com for access.',
}

export const companies = [
  {
    id: 'brightwave',
    name: 'Brightwave',
    logo: 'B',
    years: '2025–now',
    oneLiner: 'Built two AI products from zero, hands-on',
    claim: 'Built two AI products from zero, designing most of it myself.',
    summary:
      'AI products for finance teams: a research platform for private market due diligence, and Tounami, compliance-ready agent infrastructure.',
    roles: ['Head of Product & Design · 2025–now'],
    gallery: [
      { size: 'large', title: 'Research workspace', note: 'Brightwave', tone: 'blue', art: 'ui', motion: true },
      { size: 'medium', title: 'Source citations', tone: 'sand', art: 'stack' },
      { size: 'medium', title: 'Agent progress', tone: 'stone', art: 'toast', motion: true },
      { size: 'large', title: 'Policy builder', note: 'Tounami', tone: 'sage', art: 'ui' },
      {
        size: 'grid',
        title: 'Details',
        note: 'Tounami',
        items: [
          { title: 'Audit log', tone: 'stone', art: 'rows' },
          { title: 'Approval flow', tone: 'blue', art: 'toast', motion: true },
          { title: 'Model settings', tone: 'sand', art: 'pills' },
          { title: 'Risk flags', tone: 'rose', art: 'stack' },
        ],
      },
    ],
    caseStudies: [
      { title: 'Brightwave research platform', href: '#', locked: true },
      { title: 'Tounami', href: '#', locked: true },
    ],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    logo: 'S',
    years: '2022–25',
    oneLiner: 'Led design for Search and Selling Strategies',
    claim: 'Led design for Search and Selling Strategies, [X] designers across three teams.',
    summary:
      'Search across the storefront, Shop app and admin, and the selling tools merchants use to grow: subscriptions, bundles, pre-orders and more.',
    // Shopify shows its teams instead of a roles line. Gallery frames link to a team via `team`.
    teams: [
      {
        id: 'search',
        name: 'Search',
        role: 'Head of Design · 2023–25 · [X] designers',
        scope: 'Took Shopify Search from MVP to the default backbone for millions of merchants.',
        projects: ['AI-powered search', 'Search API', 'Buyer search UX', 'Merchant search tools', 'Shop app search'],
      },
      {
        id: 'selling',
        name: 'Selling Strategies',
        role: 'Head of Design · 2024–25 · [X] designers',
        scope: 'Aligned five selling products on shared primitives and one quality bar.',
        projects: ['Subscriptions', 'Bundles', 'Combined Listings', 'Pre-orders', 'Try Before You Buy'],
      },
      {
        id: 'ecosystem',
        name: 'Ecosystem',
        role: 'Design Lead · 2022–23 · [X] designers',
        scope: 'The full app lifecycle inside Shopify admin, from discovery to removal.',
        projects: ['App Store', 'Install', 'Apps in admin', 'Removal'],
      },
    ],
    gallery: [
      { size: 'large', title: 'Search & Discovery', team: 'search', note: 'Search', tone: 'stone', art: 'ui', motion: true },
      { size: 'medium', title: 'Shop app search', team: 'search', note: 'Search', tone: 'sage', art: 'phone', motion: true },
      { size: 'medium', title: 'Search filters', team: 'search', note: 'Search', tone: 'sand', art: 'pills' },
      { size: 'large', title: 'Subscriptions', team: 'selling', note: 'Selling Strategies', tone: 'rose', art: 'ui' },
      {
        size: 'grid',
        title: 'Selling tools',
        team: 'selling', note: 'Selling Strategies',
        items: [
          { title: 'Bundles', tone: 'sand', art: 'stack' },
          { title: 'Pre-orders', tone: 'blue', art: 'toast', motion: true },
          { title: 'Combined Listings', tone: 'stone', art: 'pills' },
          { title: 'Try Before You Buy', tone: 'sage', art: 'rows' },
        ],
      },
      { size: 'large', title: 'Apps in admin', team: 'ecosystem', note: 'Ecosystem', tone: 'blue', art: 'ui', motion: true },
    ],
    caseStudies: [
      { title: 'AI-powered search', href: '#', locked: true },
      { title: 'S&D app', href: '#', locked: true },
      { title: 'Apps in admin', href: '#', locked: true },
    ],
  },
  {
    id: 'n26',
    name: 'N26',
    logo: 'N',
    years: '2018–22',
    oneLiner: 'Grew the team from 6 to 13 and launched in the US',
    claim: 'Grew the design team and took N26 to the US.',
    summary:
      'Led the overhaul of the app’s information architecture and the core money features that shaped N26: Spaces, Feed, Insights, Rules and Roundups.',
    roles: ['Head of Design, Engagement & US · [Years]', 'Senior Product Design Lead, US · [Years]'],
    gallery: [
      { size: 'medium', title: 'Spaces', tone: 'sage', art: 'phone', motion: true },
      { size: 'medium', title: 'Shared payments', tone: 'sand', art: 'toast' },
      { size: 'medium', title: 'Insights', tone: 'rose', art: 'stack' },
      { size: 'large', title: 'Home', note: 'N26 US', tone: 'night', art: 'ui', motion: true },
      { size: 'medium', title: 'Onboarding & KYC', note: 'N26 US', tone: 'stone', art: 'phone' },
      { size: 'medium', title: 'Rules & Roundups', tone: 'blue', art: 'pills' },
    ],
    caseStudies: [
      { title: 'Spaces', href: '#', locked: true },
      { title: 'N26 US', href: '#', locked: true },
    ],
  },
]

export const earlier = {
  id: 'ideo',
  name: 'IDEO',
  logo: 'I',
  years: '[Years]',
  oneLiner: '[Your role, one phrase]',
  text: '[One sentence on your role and the kind of work, e.g. the clients or problems you designed for.]',
}
