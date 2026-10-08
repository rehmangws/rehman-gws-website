import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  MessageSquare,
  Palette,
  Users,
  Share2,
  TrendingUp,
  Briefcase,
  Globe,
  CheckCircle2,
  Layers,
  Sparkles,
  BarChart3,
  Building2,
} from 'lucide-react';
import {
  COMPANY_INFO,
  getWhatsAppUrl,
  GRAPHIC_DESIGN_GROUPS,
  GRAPHIC_DESIGN_SERVICES,
  RECRUITMENT_CATEGORIES,
  SOCIAL_MEDIA_MANAGEMENT_SERVICES,
  SOCIAL_MEDIA_MARKETING_SERVICES,
  BUSINESS_SOLUTIONS_SERVICES,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';
import { ActiveView } from './Navbar';
import { ScrollReveal } from './ScrollReveal';
import {
  GraphicDesignIllustration,
  RecruitmentFlowIllustration,
  SocialMediaIllustration,
  MarketingGrowthIllustration,
  BusinessSolutionsIllustration,
  ServiceCardMiniIllustration,
} from './BrandIllustrations';

interface ServicesViewProps {
  onNavigate: (view: ActiveView, sectionId?: string) => void;
  onSelectServiceForContact: (serviceName: string) => void;
  onSelectRoleForJobApplication: (role: string, category: string) => void;
  onSelectRoleForStaffRequest: (role: string, category: string) => void;
}

const PORTFOLIO_GRAPHIC_HIGHLIGHTS = [
  {
    title: 'Logo Design',
    category: 'Brand Mark & Symbolism',
    detail: 'Timeless corporate emblems, monograms, and bilingual brand marks crafted with vector precision.',
  },
  {
    title: 'Brand Identity',
    category: 'Complete Visual Systems',
    detail: 'Comprehensive brand guidelines, typography systems, color architecture, and stationery suites.',
  },
  {
    title: 'Social Media Design',
    category: 'Multi-Channel Visuals',
    detail: 'Cohesive post grids, carousel templates, story graphics, and cover banners across all platforms.',
  },
  {
    title: 'Advertising Design',
    category: 'Commercial Campaigns',
    detail: 'High-impact print and digital ad creatives engineered to capture executive and consumer attention.',
  },
  {
    title: 'Packaging Design',
    category: 'Retail & Product Dielines',
    detail: 'Structural box design, luxury product labels, and retail-ready packaging systems.',
  },
  {
    title: 'Restaurant Menu Design',
    category: 'Hospitality & Fine Dining',
    detail: 'Editorial dine-in menus, digital QR menu boards, and takeaway catalogs for hospitality brands.',
  },
  {
    title: 'Company Profile',
    category: 'Corporate Publications',
    detail: 'Multi-page executive capability decks, annual reports, and B2B credential brochures.',
  },
  {
    title: 'Presentation Design',
    category: 'Pitch & Boardroom Decks',
    detail: 'Structured investor pitch decks, corporate keynotes, and data-driven visual presentations.',
  },
  {
    title: 'CV / Resume Design',
    category: 'Executive Career Profiles',
    detail: 'Clean, international-standard executive resumes and professional portfolio layouts.',
  },
  {
    title: 'YouTube Graphics',
    category: 'Video Channel Branding',
    detail: 'High-CTR custom thumbnails, channel banners, and broadcast lower-thirds.',
  },
  {
    title: 'Website Graphics',
    category: 'UI & Digital Assets',
    detail: 'Custom web hero visuals, interface illustrations, infographics, and conversion banners.',
  },
  {
    title: 'Photo Editing',
    category: 'Studio Retouching',
    detail: 'Commercial product retouching, color grading, background removal, and image restoration.',
  },
];

const CORE_SOCIAL_CAPABILITIES = [
  { title: 'Content Planning', detail: 'Monthly editorial calendars aligned with brand milestones.' },
  { title: 'Content Creation', detail: 'Bespoke graphics, copywriting, captions, and visual storytelling.' },
  { title: 'Account Management', detail: 'Daily stewardship and profile optimization across all channels.' },
  { title: 'Posting', detail: 'Consistent, peak-hour publishing and cross-platform formatting.' },
  { title: 'Community Management', detail: 'Timely comment moderation, inbox management, and audience care.' },
  { title: 'Social Media Marketing', detail: 'Full-funnel paid growth and brand awareness campaigns.' },
  { title: 'Meta Ads', detail: 'Precision-targeted Facebook & Instagram advertising sets.' },
  { title: 'Lead Generation', detail: 'Conversion-focused campaigns capturing qualified business enquiries.' },
  { title: 'Analytics', detail: 'Deep audience behavior tracking, pixel analysis, and attribution.' },
  { title: 'Reporting', detail: 'Transparent monthly performance reports with clear ROI metrics.' },
];

export const ServicesView: React.FC<ServicesViewProps> = ({
  onNavigate,
  onSelectServiceForContact,
  onSelectRoleForJobApplication,
  onSelectRoleForStaffRequest,
}) => {
  // Graphic Design filter state
  const [designSearch, setDesignSearch] = useState('');
  const [activeDesignGroup, setActiveDesignGroup] = useState<string>('ALL');

  // Recruitment & Staffing search & accordion state
  const [staffSearch, setStaffSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    hospitality: true,
    'office-admin': true,
    'it-digital': true,
    'sales-marketing': false,
    'general-workforce': false,
  });

  const toggleRecruitmentCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllCategories = () => {
    const allOpen: Record<string, boolean> = {};
    RECRUITMENT_CATEGORIES.forEach((c) => {
      allOpen[c.id] = true;
    });
    setExpandedCategories(allOpen);
  };

  const filteredGraphicDesignItems = GRAPHIC_DESIGN_SERVICES.filter((item) =>
    item.toLowerCase().includes(designSearch.trim().toLowerCase())
  );

  const filteredRecruitmentCategories = RECRUITMENT_CATEGORIES.map((cat) => {
    const query = staffSearch.trim().toLowerCase();
    if (!query) return cat;
    const matchedRoles = cat.roles.filter(
      (role) =>
        role.toLowerCase().includes(query) ||
        cat.name.toLowerCase().includes(query)
    );
    return { ...cat, roles: matchedRoles };
  }).filter((cat) => cat.roles.length > 0);

  return (
    <div className="space-y-0">
      {/* ==================================================
          MASTER SERVICES OVERVIEW (5 PREMIUM SERVICE CARDS)
      ================================================== */}
      <section className="relative py-20 bg-brand-canvas bg-subtle-grid border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>REHMAN GWS · Core Practice Areas</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Our Professional Services
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Integrated creative design, international workforce recruitment, social media management, performance marketing, and corporate business solutions engineered for modern organizations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('employers')}
                className="px-5 py-3 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-[0_0_24px_-4px_rgba(10,102,255,0.55)] transition-all whitespace-nowrap cursor-pointer"
              >
                Request Staff
              </button>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-5 py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer"
              >
                Discuss a Project
              </button>
            </div>
          </div>

          {/* 5 Main Service Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1: GRAPHIC DESIGN */}
            <div className="brand-card rounded-2xl p-7 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#0A66FF]/15 border border-[#0A66FF]/30 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 group-hover:bg-[#0A66FF] group-hover:text-white transition-all duration-200">
                    <Palette className="w-6 h-6" />
                  </div>
                  <span className="font-mono tabular-nums text-xs text-slate-400">01 / 05</span>
                </div>
                <ServiceCardMiniIllustration type="design" />
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    Graphic Design
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Complete corporate identity systems, brand guidelines, print collateral, packaging, and digital advertising graphics.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
                  Logo Design · Brand Identity · Company Profile · Packaging · Social Media Visuals · Menus · UI Graphics
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <a
                  href="#graphic-design"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#38BDF8] group-hover:text-white transition-colors"
                >
                  <span>Explore 36 Design Categories</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Pillar 2: RECRUITMENT & STAFFING */}
            <div className="brand-card rounded-2xl p-7 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="font-mono tabular-nums text-xs text-slate-400">02 / 05</span>
                </div>
                <ServiceCardMiniIllustration type="recruitment" />
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    Recruitment & Staffing
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Connecting hotels, offices, agencies, and commercial enterprises with vetted local and international candidates.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
                  Hospitality · Office & Administration · IT & Digital · Sales & Marketing · General Workforce
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <a
                  href="#recruitment-staffing"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 group-hover:text-white transition-colors"
                >
                  <span>Explore Workforce Solutions</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Pillar 3: SOCIAL MEDIA MANAGEMENT */}
            <div className="brand-card rounded-2xl p-7 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#0A66FF]/15 border border-[#0A66FF]/30 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 group-hover:bg-[#0A66FF] group-hover:text-white transition-all duration-200">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <span className="font-mono tabular-nums text-xs text-slate-400">03 / 05</span>
                </div>
                <ServiceCardMiniIllustration type="social" />
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    Social Media Management
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Full-cycle content planning, scheduling, visual posts, caption copywriting, and daily community management.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
                  Facebook · Instagram · TikTok · LinkedIn · YouTube · Content Calendars · Page Optimization
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <a
                  href="#social-media-management"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#38BDF8] group-hover:text-white transition-colors"
                >
                  <span>View Management Scope</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Pillar 4: SOCIAL MEDIA MARKETING */}
            <div className="brand-card rounded-2xl p-7 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#0A66FF]/15 border border-[#0A66FF]/30 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 group-hover:bg-[#0A66FF] group-hover:text-white transition-all duration-200">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="font-mono tabular-nums text-xs text-slate-400">04 / 05</span>
                </div>
                <ServiceCardMiniIllustration type="marketing" />
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    Social Media Marketing
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Data-driven paid advertising, Meta Ads, B2B/B2C lead generation, audience research, and ROI reporting.
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
                  Meta Ads · Lead Generation · Traffic & Conversion Campaigns · Audience Research · Analytics
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <a
                  href="#social-media-marketing"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#38BDF8] group-hover:text-white transition-colors"
                >
                  <span>Explore Marketing Campaigns</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Pillar 5: BUSINESS SOLUTIONS */}
            <div className="brand-card rounded-2xl p-7 flex flex-col justify-between space-y-6 md:col-span-2 lg:col-span-2 group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-mono tabular-nums text-xs text-slate-400">05 / 05 · Integrated Advisory</span>
                      <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        Business Solutions
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Strategic commercial infrastructure for new and growing enterprises—covering business branding, online presence setup, Google Business Profile assistance, market research, lead generation, and client outreach support.
                  </p>
                  <div className="pt-2 border-t border-white/10 text-xs text-slate-400">
                    Business Branding · Google Business Profile · Online Presence Setup · Market Research · Client Outreach
                  </div>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectServiceForContact('Business Solutions')}
                    className="w-full py-3 px-4 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Discuss Your Business</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href="#business-solutions"
                    className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-medium rounded-xl text-center transition-colors"
                  >
                    View All 12 Solutions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          1. GRAPHIC DESIGN SECTION (PORTFOLIO-STYLE + 36 CATEGORIES)
      ================================================== */}
      <section
        id="graphic-design"
        className="py-20 bg-[#F8FAFC] text-slate-900 bg-light-grid border-b border-slate-200 scroll-mt-20"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0A66FF] tracking-wider uppercase">
                <Layers className="w-4 h-4" />
                <span>01 · Creative Studio & Brand Architecture</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Graphic Design Services
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Visual identity is the silent ambassador of your enterprise. Our design studio delivers disciplined corporate branding, executive publications, commercial packaging, and digital graphics across <span className="font-mono tabular-nums font-bold text-slate-950">36</span> specialized categories.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectServiceForContact('Graphic Design Services')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66FF] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Get Graphic Design Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={getWhatsAppUrl('Hello REHMAN GWS, I would like to discuss Graphic Design Services.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Discuss on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <ScrollReveal variant="scale-in">
                <GraphicDesignIllustration />
              </ScrollReveal>
            </div>
          </div>

          {/* Portfolio-Style Showcase Grid of 12 Featured Design Specializations */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h4 className="font-display text-xl font-bold text-slate-950">
                  Featured Creative Specializations
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Select any specialization below to request a custom design brief or consultation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PORTFOLIO_GRAPHIC_HIGHLIGHTS.map((item, idx) => (
                <div
                  key={item.title}
                  onClick={() => onSelectServiceForContact(`Graphic Design: ${item.title}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectServiceForContact(`Graphic Design: ${item.title}`);
                    }
                  }}
                  className="group bg-white hover:bg-[#050811] border border-slate-200/90 hover:border-[#0A66FF] rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#0A66FF] group-hover:text-amber-400 transition-colors">
                        {item.category}
                      </span>
                      <span className="font-mono tabular-nums text-slate-400 group-hover:text-slate-500">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h5 className="font-display text-base font-bold text-slate-900 group-hover:text-white transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-xs text-slate-600 group-hover:text-slate-300 leading-relaxed transition-colors">
                      {item.detail}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 group-hover:border-white/10 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-[#38BDF8] transition-colors">
                    <span>Request Design</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Complete 36 Graphic Design Categories Directory */}
          <div className="bg-[#050811] text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-lg font-bold text-white">
                  Complete Directory of All 36 Graphic Design Services
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filter by category group or search any specific design deliverable.
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={designSearch}
                  onChange={(e) => setDesignSearch(e.target.value)}
                  placeholder="Search all 36 design services..."
                  aria-label="Search graphic design services"
                  className="w-full pl-9 pr-4 py-2 bg-[#0A1020] border border-white/15 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0A1020] border border-white/10 rounded-lg w-fit">
              <button
                type="button"
                onClick={() => setActiveDesignGroup('ALL')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeDesignGroup === 'ALL'
                    ? 'bg-[#0A66FF] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All 36 Services
              </button>
              {GRAPHIC_DESIGN_GROUPS.map((g) => (
                <button
                  key={g.groupTitle}
                  type="button"
                  onClick={() => setActiveDesignGroup(g.groupTitle)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    activeDesignGroup === g.groupTitle
                      ? 'bg-[#0A66FF] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {g.groupTitle.split('.')[1]?.trim() || g.groupTitle}
                </button>
              ))}
            </div>

            {designSearch.trim() !== '' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {filteredGraphicDesignItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onSelectServiceForContact(`Graphic Design: ${item}`)}
                    className="text-left p-3 rounded-lg bg-[#0A1020] border border-white/10 hover:border-[#0A66FF] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white">
                      {item}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#38BDF8] shrink-0" />
                  </button>
                ))}
                {filteredGraphicDesignItems.length === 0 && (
                  <p className="text-sm text-slate-400 col-span-full py-4">
                    No matching design category found. Contact us for custom graphic design requirements.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {GRAPHIC_DESIGN_GROUPS.filter(
                  (g) => activeDesignGroup === 'ALL' || g.groupTitle === activeDesignGroup
                ).map((group) => (
                  <div
                    key={group.groupTitle}
                    className="p-5 rounded-xl bg-[#0A1020] border border-white/10 space-y-3"
                  >
                    <div>
                      <h5 className="text-sm font-bold text-white">{group.groupTitle}</h5>
                      <p className="text-xs text-slate-400 mt-0.5">{group.description}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {group.items.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => onSelectServiceForContact(`Graphic Design: ${item}`)}
                          className="text-left px-3 py-2 rounded-lg bg-[#050811] hover:bg-[#0A66FF]/15 border border-white/5 hover:border-[#0A66FF]/40 text-xs text-slate-200 hover:text-white transition-colors flex items-center justify-between group cursor-pointer"
                        >
                          <span className="truncate">{item}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-[#38BDF8] shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================
          2. RECRUITMENT & STAFFING SOLUTIONS
      ================================================== */}
      <section
        id="recruitment-staffing"
        className="py-20 bg-brand-canvas bg-subtle-grid border-b border-white/10 scroll-mt-20"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase">
                <Users className="w-4 h-4" />
                <span>02 · International Workforce & Talent Matching</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Recruitment & Staffing Solutions
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                We help businesses connect with suitable candidates for their workforce requirements. From luxury hospitality groups and corporate offices to digital agencies and logistics hubs, our structured recruitment pipeline connects verified talent with growing employers.
              </p>

              {/* Visual Matching Ecosystem Flow: Candidates -> Matching -> Businesses -> Global Workforce */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#0A1020] border border-white/10 space-y-1">
                  <div className="text-xs font-mono text-[#38BDF8]">STEP 01</div>
                  <div className="font-display text-sm font-bold text-white">Candidates</div>
                  <p className="text-[11px] text-slate-400">Skilled applicants & CV screening</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0A1020] border border-white/10 space-y-1">
                  <div className="text-xs font-mono text-amber-400">STEP 02</div>
                  <div className="font-display text-sm font-bold text-white">Matching</div>
                  <p className="text-[11px] text-slate-400">Role & experience verification</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0A1020] border border-white/10 space-y-1">
                  <div className="text-xs font-mono text-[#38BDF8]">STEP 03</div>
                  <div className="font-display text-sm font-bold text-white">Businesses</div>
                  <p className="text-[11px] text-slate-400">Employer shortlist & interviews</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0A1020] border border-white/10 space-y-1">
                  <div className="text-xs font-mono text-emerald-400">STEP 04</div>
                  <div className="font-display text-sm font-bold text-white">Global Workforce</div>
                  <p className="text-[11px] text-slate-400">Reliable placement & onboarding</p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('employers')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-[0_0_24px_-4px_rgba(10,102,255,0.6)] transition-all whitespace-nowrap cursor-pointer"
                >
                  <span>Request Staff</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('jobs')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-100 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer"
                >
                  <span>Browse Opportunities</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <ScrollReveal variant="scale-in">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
                  <ResilientImage
                    src={COMPANY_INFO.images.recruitment}
                    alt="REHMAN GWS International Recruitment and Staffing Consultation"
                    fallbackTitle="Recruitment & Staffing"
                    fallbackSubtitle="Hospitality · Office · IT · Sales · Workforce"
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Animated End-to-End Recruitment Flow Illustration: Business -> REHMAN GWS -> Qualified Candidate */}
          <ScrollReveal variant="fade-up">
            <RecruitmentFlowIllustration />
          </ScrollReveal>

          {/* Searchable & Expandable 5 Workforce Categories */}
          <div className="bg-[#0A1020]/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-lg font-bold text-white">
                  Five Core Workforce Sectors & Roles
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Search any role below, or click <strong className="text-white">Hire</strong> to request staff or <strong className="text-white">Apply</strong> as a job seeker.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={staffSearch}
                    onChange={(e) => {
                      setStaffSearch(e.target.value);
                      if (e.target.value.trim()) expandAllCategories();
                    }}
                    placeholder="Search roles (e.g. Chef, Accountant, Driver)..."
                    aria-label="Search recruitment roles"
                    className="w-full pl-9 pr-4 py-2 bg-[#050811] border border-white/15 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>
                <button
                  type="button"
                  onClick={expandAllCategories}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#050811] border border-white/10 rounded-lg whitespace-nowrap cursor-pointer"
                >
                  Expand All
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredRecruitmentCategories.map((category) => {
                const isExpanded = Boolean(expandedCategories[category.id]);
                return (
                  <div
                    key={category.id}
                    className="rounded-xl bg-[#050811] border border-white/10 overflow-hidden transition-colors hover:border-white/20"
                  >
                    <button
                      type="button"
                      onClick={() => toggleRecruitmentCategory(category.id)}
                      aria-expanded={isExpanded}
                      className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="font-display text-base font-bold text-white">
                            {category.name}
                          </span>
                          <span className="text-xs text-amber-400 font-mono tabular-nums">
                            · {category.roles.length} Roles
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{category.summary}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {category.roles.map((role) => (
                          <div
                            key={role}
                            className="p-3 rounded-lg bg-[#0A1020] border border-white/5 hover:border-[#0A66FF]/40 flex items-center justify-between gap-2 transition-colors"
                          >
                            <span className="text-xs font-medium text-slate-200 truncate">
                              {role}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => onSelectRoleForStaffRequest(role, category.name)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-[#38BDF8] hover:text-white bg-[#0A66FF]/15 hover:bg-[#0A66FF] rounded transition-colors whitespace-nowrap cursor-pointer"
                              >
                                Hire
                              </button>
                              <button
                                type="button"
                                onClick={() => onSelectRoleForJobApplication(role, category.name)}
                                className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 rounded transition-colors whitespace-nowrap cursor-pointer"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Strong Employer CTA Banner inside Recruitment Section */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-[#0A66FF]/20 via-[#0A1020] to-amber-500/10 border border-[#0A66FF]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  For Employers & Hiring Managers
                </div>
                <h5 className="font-display text-lg font-bold text-white">
                  Need Staff? Tell Us Your Workforce Requirements
                </h5>
                <p className="text-xs text-slate-300">
                  Submit a staffing request for single placements or complete departmental teams.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('employers')}
                className="px-6 py-3 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg whitespace-nowrap cursor-pointer shrink-0"
              >
                Request Staff
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          3 & 4. SOCIAL MEDIA MANAGEMENT & MARKETING
      ================================================== */}
      <section className="py-20 bg-[#050811] border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Header & Platforms Bar */}
          <div className="space-y-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#38BDF8] tracking-wider uppercase">
                <Sparkles className="w-4 h-4" />
                <span>03 & 04 · Social Media Management & Performance Marketing</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Build Brand Authority & Measurable Digital Growth
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                From daily account stewardship and editorial content calendars to high-converting Meta, TikTok, LinkedIn, and YouTube ad campaigns.
              </p>
            </div>

            {/* Elegant Monochromatic / Brand-Tinted Platform Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {[
                { name: 'Facebook', desc: 'Brand Pages & Meta Ads' },
                { name: 'Instagram', desc: 'Visual Grids, Reels & Growth' },
                { name: 'TikTok', desc: 'Short-Form Video & Viral Ads' },
                { name: 'LinkedIn', desc: 'Corporate B2B Authority' },
                { name: 'YouTube', desc: 'Channel Management & Video SEO' },
              ].map((plat) => (
                <div
                  key={plat.name}
                  className="p-4 rounded-xl bg-[#0A1020] border border-white/10 hover:border-[#0A66FF]/50 transition-colors flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-white">{plat.name}</span>
                    <Globe className="w-4 h-4 text-[#38BDF8]" />
                  </div>
                  <span className="text-xs text-slate-400">{plat.desc}</span>
                </div>
              ))}
            </div>

            {/* 10 Core Social Media Capabilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {CORE_SOCIAL_CAPABILITIES.map((cap, idx) => (
                <div
                  key={cap.title}
                  className="p-4 rounded-xl bg-[#0A1020]/70 border border-white/10 space-y-1.5"
                >
                  <div className="text-[11px] font-mono text-amber-400">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="font-display text-sm font-bold text-white">{cap.title}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.detail}</p>
                </div>
              ))}
            </div>

            {/* Dual Animated Brand Illustrations for Social Media Management & Marketing Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <ScrollReveal variant="slide-left">
                <SocialMediaIllustration />
              </ScrollReveal>
              <ScrollReveal variant="slide-right" delayMs={100}>
                <MarketingGrowthIllustration />
              </ScrollReveal>
            </div>
          </div>

          {/* Detailed Two-Column Breakdown: Management (19 items) & Marketing (19 items) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3. SOCIAL MEDIA MANAGEMENT */}
            <div
              id="social-media-management"
              className="brand-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-8 scroll-mt-24"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    03 · Retainer Channel Stewardship
                  </div>
                  <h4 className="font-display text-2xl font-bold text-white">
                    Social Media Management
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Structured monthly content calendars, editorial post creation, community management, and profile optimization across every major social platform.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SOCIAL_MEDIA_MANAGEMENT_SERVICES.map((service) => (
                    <div
                      key={service}
                      className="px-3.5 py-2.5 rounded-lg bg-[#050811] border border-white/5 text-xs font-medium text-slate-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectServiceForContact('Social Media Management')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Manage My Social Media</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={getWhatsAppUrl('Hello REHMAN GWS, I would like you to manage my brand social media accounts.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-medium rounded-xl transition-colors whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Consultation</span>
                </a>
              </div>
            </div>

            {/* 4. SOCIAL MEDIA MARKETING */}
            <div
              id="social-media-marketing"
              className="brand-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-8 scroll-mt-24"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#38BDF8] uppercase tracking-wider">
                    04 · Paid Acquisition & Lead Generation
                  </div>
                  <h4 className="font-display text-2xl font-bold text-white">
                    Social Media Marketing
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Targeted Meta, TikTok, LinkedIn, and YouTube advertising campaigns built around audience research, conversion tracking, and transparent performance reporting.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SOCIAL_MEDIA_MARKETING_SERVICES.map((service) => (
                    <div
                      key={service}
                      className="px-3.5 py-2.5 rounded-lg bg-[#050811] border border-white/5 text-xs font-medium text-slate-200 flex items-center gap-2"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectServiceForContact('Social Media Marketing')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Start Marketing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={getWhatsAppUrl('Hello REHMAN GWS, I would like to start a Social Media Marketing campaign.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-medium rounded-xl transition-colors whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Strategy Call</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. BUSINESS SOLUTIONS SECTION
      ================================================== */}
      <section
        id="business-solutions"
        className="py-20 bg-brand-canvas bg-subtle-grid border-b border-white/10 scroll-mt-20"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-wider uppercase">
                <Building2 className="w-4 h-4" />
                <span>05 · Corporate Growth & Digital Infrastructure</span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Business Solutions
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                End-to-end operational and commercial setup for new ventures and expanding companies—covering business branding, Google Business Profile assistance, lead generation, market research, and client outreach support.
              </p>
            </div>
            <div className="lg:col-span-5">
              <ScrollReveal variant="scale-in">
                <BusinessSolutionsIllustration />
              </ScrollReveal>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BUSINESS_SOLUTIONS_SERVICES.map((item, idx) => (
              <div
                key={item.title}
                className="brand-card p-6 rounded-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="text-xs font-mono tabular-nums text-amber-400">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <h4 className="font-display text-lg font-bold text-white">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectServiceForContact(`Business Solutions: ${item.title}`)}
                  className="text-left text-xs font-semibold text-[#38BDF8] hover:text-white inline-flex items-center gap-1.5 pt-2 cursor-pointer"
                >
                  <span>Enquire about {item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* CTA Banner: Ready to Grow Your Digital Presence? */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[#0A1020] via-[#0F1D3A] to-[#0A1020] border border-[#0A66FF]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Integrated Corporate Advisory
              </div>
              <h4 className="font-display text-2xl font-bold text-white">
                Ready to Grow Your Digital Presence?
              </h4>
              <p className="text-sm text-slate-300">
                Combine corporate branding, social media management, and qualified lead generation under one dedicated team.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onSelectServiceForContact('Business Solutions Package')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Discuss Your Business</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
