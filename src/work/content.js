// All copy and media for the work page lives here.
//
// Each company:
//   title     → shown in the list at the top
//   headline  → the large line in the company's section
//   position  → the grey line under the headline
//   summary   → one or more paragraphs
//
// Gallery frames:
//   size: 'large'  → 16:10, for full-screen UI
//         'medium' → 4:5, for phone screens and close-ups
//   src:  put files in public/work/<company>/ and reference them as '/work/<company>/file.png'.
//         .mp4 / .webm play as muted loops (use these instead of .gif, they're much smaller).
//         Leave src out to show a grey placeholder.
//   title is used as the image's alt text.

export const intro = {
  name: 'Vivian Lo',
  bioUrl: 'https://vvnlo.com/',
  title: 'Selected work',
}

export const companies = [
  {
    id: 'brightwave',
    name: 'Brightwave',
    title: 'Head of Design, Founding Designer',
    years: '2025–now',
    headline: 'Building 0-to-1 AI research platform for finance',
    position: 'Head of Design, Founding Designer',
    summary: [
      'AI products for finance teams: a research platform for private market due diligence, and Tounami, compliance-ready agent infrastructure.',
    ],
    caseStudies: [
      { title: 'Brightwave research platform', href: '#' },
      { title: 'Tounami', href: '#' },
    ],
    gallery: [
      { size: 'large', title: 'Research workspace' },
      { size: 'medium', title: 'Source citations' },
      { size: 'medium', title: 'Agent progress' },
      { size: 'large', title: 'Tounami policy builder' },
      { size: 'medium', title: 'Tounami audit log' },
    ],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    title: 'Product Design Manager, Design Lead',
    years: '2022–25',
    headline: 'Led design for Search and Selling Strategies',
    position: 'Design lead & manager, Search & Selling Strategies',
    summary: [
      'I led design across Search and Selling Strategies, managing 7 designers across two teams and a broad portfolio spanning how buyers find products and how merchants grow their businesses with new product primitives.',
      'I helped take Shopify Search and Discovery app from MVP to a core platform used by millions of merchants, and brought products like subscriptions, bundles, and pre-orders onto better interoperability, and a consistent quality bar. I also led key parts of Shopify’s app ecosystem in admin, from discovery to installation to management.',
    ],
    caseStudies: [
      { title: 'AI-powered search', href: '#' },
      { title: 'S&D app', href: '#' },
      { title: 'Apps in admin', href: '#' },
    ],
    gallery: [
      { size: 'large', title: 'Search & Discovery app' },
      { size: 'medium', title: 'Shop app search' },
      { size: 'large', title: 'Subscriptions' },
      { size: 'medium', title: 'Bundles' },
      { size: 'medium', title: 'Pre-orders' },
      { size: 'large', title: 'Apps in admin' },
    ],
  },
  {
    id: 'n26',
    name: 'N26',
    title: 'Head of Design, Engagement and US',
    years: '2018–2022',
    headline: 'Grew the team from 6 to 13 and launched in the US',
    position: 'Head of Design, Engagement and US',
    summary: [
      'Led the overhaul of the app’s information architecture and the core money features that shaped N26: Spaces, Feed, Insights, Rules and Roundups.',
    ],
    caseStudies: [
      { title: 'Spaces', href: '#' },
      { title: 'N26 US', href: '#' },
    ],
    gallery: [
      { size: 'medium', title: 'Spaces' },
      { size: 'medium', title: 'Shared payments' },
      { size: 'medium', title: 'Insights' },
      { size: 'large', title: 'N26 US home' },
      { size: 'medium', title: 'US onboarding' },
    ],
  },
]
