// All copy and media for the work page lives here.
//
// Each company:
//   logo      → small tile next to the company name (version B)
//   title     → shown in the list at the top
//   modes     → badges for the kind of role: 'IC', 'Mgmt' or both
//   listOnly  → true to show it in the list at the top without its own section (version B)
//   headline  → the large line in the company's section
//   position  → the grey line under the headline
//   summary   → one or more paragraphs
//   caseStudies, gallery → either can be an empty list to hide it
//
// Gallery frames:
//   size: 'large'  → 16:10, for full-screen UI
//         'medium' → 4:5, for phone screens and close-ups
//   src:  put files in public/work/<company>/ and reference them as '/work/<company>/file.png'.
//         .mp4 / .webm play as muted loops (use these instead of .gif, they're much smaller).
//         Leave src out to show a grey placeholder.
//   ratio: optional 'width / height' so the frame matches the image instead of cropping it.
//   title is used as the image's alt text.

export const intro = {
  name: 'Vivian Lo',
  bioUrl: 'https://vvnlo.com/',
  title: 'Selected work',
  blurb:
    'My career has moved fluidly between IC and management, shaping how I lead and how I design. The work below spans hands-on product craft, team leadership, and product direction.',
  email: 'hello@vvnlo.com',
  linkedin: 'https://www.linkedin.com/in/lovivian/',
  x: 'https://x.com/loviv',
  // Link for the "View resume" button (opens in a new tab).
  resumeUrl: 'https://drive.google.com/file/d/1NjOhp70TOituDYWzV9vnS3QUSlmBAEV1/view?usp=sharing',
}

export const companies = [
  {
    id: 'brightwave',
    logo: '/work/logos/brightwave.svg',
    name: 'Brightwave',
    title: 'Head of Design',
    modes: ['IC'],
    years: '2025–now',
    headline: 'Building 0-to-1 AI research platform for finance',
    position: 'Head of Design',
    summary: [
      'As Brightwave’s founding designer, I helped transform an early AI research product into a multiplayer workspace for private markets.',
      'I redesigned the experience around how deal teams actually work: messy data rooms, parallel analysis, shared outputs, and a high bar for accuracy. Along the way, I helped shape product direction, establish new patterns for agentic UX, and build the systems that let a lean team ship quickly and consistently.',
    ],
    caseStudies: [
      { title: 'Brightwave research platform', href: '#' },
    ],
    gallery: [
      { size: 'large', ratio: '2400 / 1534', src: '/work/brightwave/1.webp', title: 'Brightwave home with recent projects' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/brightwave/2.webp', title: 'Project sources beside a CIM summary' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/brightwave/3a.webp', title: 'Agent building an LBO model beside the spreadsheet' },
      { size: 'large', ratio: '2253 / 1440', src: '/work/brightwave/3b.webp', title: 'Evidence, outputs and agents up close' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/brightwave/4.webp', title: 'Grid view extracting fields across documents' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/brightwave/5.webp', title: 'Agents adding source citations to an LBO model' },
      { size: 'large', ratio: '2400 / 1800', src: '/work/brightwave/6.webp', title: 'Brightwave on mobile: projects, chat and sources' },
    ],
  },
  {
    id: 'shopify',
    logo: '/work/logos/shopify.png',
    name: 'Shopify',
    title: 'Product Design Manager & Lead',
    modes: ['Mgmt'],
    years: '2022–25',
    headline: 'Led design for Search and Selling Strategies',
    position: 'Product Design Manager & Lead',
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
      { size: 'large', ratio: '2400 / 1534', src: '/work/shopify/1.webp', title: 'Search & Discovery app home with search performance' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/shopify/2.webp', title: 'Product recommendations in admin' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/shopify/3.webp', title: 'Bulk editing complementary and related products' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/shopify/4.webp', title: 'Building a storefront filter' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/shopify/5.webp', title: 'Semantic search settings and storefront results' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/shopify/6.webp', title: 'Product boosts and filter suggestions' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/shopify/7.webp', title: 'Creating a subscription plan' },
      { size: 'large', ratio: '2400 / 1534', src: '/work/shopify/8.webp', title: 'Subscribe and save on a product page, with subscription details' },
    ],
  },
  {
    id: 'n26',
    logo: '/work/logos/n26.png',
    name: 'N26',
    title: 'Head of Design, Engagement and US',
    modes: ['IC', 'Mgmt'],
    years: '2018–2022',
    headline: 'Grew the team from 6 to 13 and launched in the US',
    position: 'Head of Design, Engagement and US',
    summary: [
      'I established the design function in our US office and drove N26’s 0-to-1 launch and expansion in the US.',
      'I then led the overhaul of the app’s information architecture and the core money features that shaped N26: Spaces, Feed, Insights, Rules and Roundups. Along the way, I helped grow the design team through hypergrowth, including re-leveling the team.',
    ],
    caseStudies: [
      { title: 'Spaces', href: '#' },
      { title: 'N26 US', href: '#' },
      // A public PDF: opens in a new tab with no lock icon.
      { title: 'Management toolkit', href: '/work/n26/management-toolkit.pdf', open: true },
    ],
    gallery: [
      { size: 'large', ratio: '2000 / 1250', src: '/work/n26/1.webp', title: 'N26 home screen on a phone' },
      { size: 'large', ratio: '2337 / 1250', src: '/work/n26/2.webp', title: 'Home feed, Rules, bill splitting and Statistics' },
      { size: 'large', ratio: '2000 / 1250', src: '/work/n26/3.webp', title: 'Spaces, before and after' },
      { size: 'large', ratio: '2000 / 1250', src: '/work/n26/4.webp', title: 'N26 US onboarding' },
      { size: 'large', ratio: '2000 / 1250', src: '/work/n26/5.webp', title: 'Actions, transfers, MoneyBeam and ATM finder' },
      { size: 'large', ratio: '2000 / 1250', src: '/work/n26/6.webp', title: 'Cashback and Spaces' },
    ],
  },
  {
    id: 'ideo',
    logo: '/work/logos/ideo.png',
    name: 'IDEO',
    title: 'Project Lead',
    modes: ['IC'],
    years: '2013–18',
    headline: '[One line on the work at IDEO]',
    position: 'Project Lead',
    summary: [
      '[A sentence or two on the kind of projects you led at IDEO and for whom.]',
    ],
    // Listed under "Selected work" only: version B shows no section and no link for it.
    listOnly: true,
    // No case studies or images yet: the case study line and gallery are hidden when these are empty.
    caseStudies: [],
    gallery: [],
  },
]
