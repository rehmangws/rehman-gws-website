export const COMPANY_INFO = {
  name: 'REHMAN GWS',
  subtitle: 'Global Work Solutions',
  tagline: 'Professional solutions for modern businesses.',
  whatsappNumber: '+92 370 2844033',
  whatsappRaw: '923702844033',
  email: 'rehmanglobal.contact@gmail.com',
  adminEmail: 'rehmanglobal.contact@gmail.com',
  images: {
    hero: '/src/assets/images/hero_global_business_1791294511210.jpg',
    graphicDesign: '/src/assets/images/service_graphic_design_1791294528840.jpg',
    recruitment: '/src/assets/images/service_recruitment_staffing_1791294544891.jpg',
    digitalMarketing: '/src/assets/images/service_digital_marketing_1791294560020.jpg',
  },
};

export function getWhatsAppUrl(prefillMessage: string): string {
  return `https://wa.me/${COMPANY_INFO.whatsappRaw}?text=${encodeURIComponent(prefillMessage)}`;
}

export interface GraphicDesignGroup {
  groupTitle: string;
  description: string;
  items: string[];
}

// All 36 required Graphic Design Services organized cleanly with full search/filter support
export const GRAPHIC_DESIGN_SERVICES: string[] = [
  'Logo Design',
  'Brand Identity',
  'Business Card Design',
  'Letterhead Design',
  'Company Profile Design',
  'Brochure Design',
  'Flyer Design',
  'Poster Design',
  'Social Media Post Design',
  'Social Media Banner Design',
  'Facebook Cover Design',
  'LinkedIn Banner Design',
  'Instagram Design',
  'YouTube Thumbnail Design',
  'YouTube Banner Design',
  'Advertisement Design',
  'Product Advertisement',
  'Packaging Design',
  'Label Design',
  'Menu Design',
  'Restaurant Menu Design',
  'Presentation Design',
  'Certificate Design',
  'Invitation Design',
  'CV / Resume Design',
  'Catalog Design',
  'Billboard Design',
  'Signboard Design',
  'Digital Ads Design',
  'Website Graphics',
  'UI Graphics',
  'Infographics',
  'Corporate Graphics',
  'Photo Editing',
  'Image Retouching',
  'Background Removal',
];

export const GRAPHIC_DESIGN_GROUPS: GraphicDesignGroup[] = [
  {
    groupTitle: '01. Brand Identity & Corporate Stationery',
    description: 'Authoritative visual systems for newly launched and established enterprises.',
    items: [
      'Logo Design',
      'Brand Identity',
      'Business Card Design',
      'Letterhead Design',
      'Company Profile Design',
      'Presentation Design',
      'Certificate Design',
      'CV / Resume Design',
      'Corporate Graphics',
    ],
  },
  {
    groupTitle: '02. Print, Editorial & Outdoor Media',
    description: 'High-resolution print collateral, menus, catalogs, and large-format outdoor signage.',
    items: [
      'Brochure Design',
      'Flyer Design',
      'Poster Design',
      'Catalog Design',
      'Menu Design',
      'Restaurant Menu Design',
      'Invitation Design',
      'Billboard Design',
      'Signboard Design',
    ],
  },
  {
    groupTitle: '03. Social Media & Digital Channel Visuals',
    description: 'Platform-native visual assets engineered for engagement and brand consistency.',
    items: [
      'Social Media Post Design',
      'Social Media Banner Design',
      'Facebook Cover Design',
      'LinkedIn Banner Design',
      'Instagram Design',
      'YouTube Thumbnail Design',
      'YouTube Banner Design',
      'Website Graphics',
      'UI Graphics',
    ],
  },
  {
    groupTitle: '04. Commercial Packaging, Ads & Retouching',
    description: 'Conversion-focused commercial ad creatives, retail packaging, and studio image editing.',
    items: [
      'Advertisement Design',
      'Product Advertisement',
      'Digital Ads Design',
      'Packaging Design',
      'Label Design',
      'Infographics',
      'Photo Editing',
      'Image Retouching',
      'Background Removal',
    ],
  },
];

export interface RecruitmentCategory {
  id: string;
  name: string;
  summary: string;
  roles: string[];
}

export const RECRUITMENT_CATEGORIES: RecruitmentCategory[] = [
  {
    id: 'hospitality',
    name: 'Hospitality',
    summary: 'Trained front-of-house, culinary, and accommodation personnel for hotels, resorts, cafés, and restaurants.',
    roles: [
      'Hotel Staff',
      'Restaurant Staff',
      'Chef',
      'Cook',
      'Waiter',
      'Waitress',
      'Kitchen Helper',
      'Barista',
      'Cashier',
      'Cleaner',
      'Housekeeping Staff',
      'Receptionist',
      'Hotel Management Staff',
    ],
  },
  {
    id: 'office-admin',
    name: 'Office & Administration',
    summary: 'Reliable administrative, finance, human resources, and executive support professionals.',
    roles: [
      'Office Assistant',
      'Receptionist',
      'Data Entry Operator',
      'Customer Support',
      'Admin Staff',
      'Office Manager',
      'HR Staff',
      'Accountant',
      'Sales Staff',
    ],
  },
  {
    id: 'it-digital',
    name: 'IT & Digital',
    summary: 'Vetted creative designers, software engineers, digital marketers, and technical specialists.',
    roles: [
      'Graphic Designer',
      'Web Designer',
      'Web Developer',
      'Software Developer',
      'Digital Marketer',
      'Social Media Manager',
      'SEO Specialist',
      'Video Editor',
      'Content Creator',
      'Lead Generation Specialist',
    ],
  },
  {
    id: 'sales-marketing',
    name: 'Sales & Marketing',
    summary: 'Revenue-focused business development, outbound sales, and customer support teams.',
    roles: [
      'Sales Executive',
      'Sales Representative',
      'Marketing Executive',
      'Business Development Executive',
      'Call Center Agent',
      'Customer Service Representative',
    ],
  },
  {
    id: 'general-workforce',
    name: 'General Workforce',
    summary: 'Skilled technical trades, logistics operators, security personnel, and site support workforce.',
    roles: [
      'Driver',
      'Security Guard',
      'Electrician',
      'Plumber',
      'Technician',
      'Helper',
      'General Worker',
      'Warehouse Staff',
      'Delivery Staff',
    ],
  },
];

export const SOCIAL_MEDIA_MANAGEMENT_SERVICES: string[] = [
  'Facebook Page Management',
  'Instagram Management',
  'TikTok Management',
  'LinkedIn Management',
  'YouTube Management',
  'Pinterest Management',
  'X/Twitter Management',
  'Content Planning',
  'Content Scheduling',
  'Social Media Posts',
  'Caption Writing',
  'Hashtag Research',
  'Community Management',
  'Comment Management',
  'Message Management',
  'Monthly Content Calendar',
  'Account Optimization',
  'Social Media Reporting',
  'Brand Page Management',
];

export const SOCIAL_MEDIA_MARKETING_SERVICES: string[] = [
  'Facebook Marketing',
  'Instagram Marketing',
  'TikTok Marketing',
  'LinkedIn Marketing',
  'YouTube Marketing',
  'Social Media Advertising',
  'Meta Ads',
  'Lead Generation',
  'Brand Awareness Campaigns',
  'Engagement Campaigns',
  'Traffic Campaigns',
  'Conversion Campaigns',
  'Content Marketing',
  'Influencer Marketing',
  'Audience Research',
  'Competitor Research',
  'Campaign Strategy',
  'Marketing Analytics',
  'Performance Reports',
];

export const BUSINESS_SOLUTIONS_SERVICES: { title: string; description: string }[] = [
  {
    title: 'Business Branding',
    description: 'Cohesive brand positioning, corporate identity architecture, and visual standards across every touchpoint.',
  },
  {
    title: 'Digital Business Solutions',
    description: 'End-to-end digital workflows and modern online infrastructure tailored to operational needs.',
  },
  {
    title: 'Lead Generation',
    description: 'Targeted B2B and B2C prospect pipelines engineered to connect your sales team with qualified buyers.',
  },
  {
    title: 'Business Research',
    description: 'Structured market intelligence, sector benchmarking, and competitor landscape evaluations.',
  },
  {
    title: 'Online Presence Setup',
    description: 'Complete digital footprint initialization for new companies entering local or international markets.',
  },
  {
    title: 'Google Business Profile Assistance',
    description: 'Profile setup, local search optimization, and structured business listing management.',
  },
  {
    title: 'Social Media Setup',
    description: 'Professional configuration of corporate profiles across LinkedIn, Meta, TikTok, X, and YouTube.',
  },
  {
    title: 'Business Profile Creation',
    description: 'Executive company profiles, capability decks, and corporate credential documents.',
  },
  {
    title: 'Marketing Strategy',
    description: 'Full-funnel communication plans aligned with quarterly revenue and client acquisition goals.',
  },
  {
    title: 'Client Outreach Support',
    description: 'Structured outreach campaigns, presentation collateral, and B2B communication frameworks.',
  },
  {
    title: 'Business Promotion',
    description: 'Multi-channel promotional campaigns for product launches, seasonal offers, and brand expansions.',
  },
  {
    title: 'Digital Presence Management',
    description: 'Ongoing stewardship of your brand reputation, digital assets, and cross-channel consistency.',
  },
];

export const WHY_CHOOSE_CARDS: { index: string; title: string; description: string }[] = [
  {
    index: '01',
    title: 'Professional Team',
    description: 'Experienced designers, recruitment specialists, and digital strategists working to international corporate standards.',
  },
  {
    index: '02',
    title: 'Quality Work',
    description: 'Meticulous quality assurance on every brand identity system, candidate shortlist, and marketing campaign.',
  },
  {
    index: '03',
    title: 'Global Approach',
    description: 'Cross-border capability serving organizations across Pakistan, the Middle East, Europe, and international markets.',
  },
  {
    index: '04',
    title: 'Client-Focused Solutions',
    description: 'Dedicated account coordination built around your specific industry timelines and operational requirements.',
  },
  {
    index: '05',
    title: 'Reliable Communication',
    description: 'Direct, responsive communication via WhatsApp and email with clear project milestones and status updates.',
  },
  {
    index: '06',
    title: 'Customized Solutions',
    description: 'Flexible service engagements scaled to match single-role hiring, bulk workforce staffing, or full brand retainers.',
  },
  {
    index: '07',
    title: 'Creative Thinking',
    description: 'Original visual design and strategic positioning that differentiate your business in competitive sectors.',
  },
  {
    index: '08',
    title: 'Business-Focused Strategy',
    description: 'Every creative asset, staffing placement, and ad campaign is aligned with practical commercial growth.',
  },
];
