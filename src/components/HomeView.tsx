import React from 'react';
import {
  ArrowRight,
  Briefcase,
  Users,
  MessageSquare,
  Globe,
  Palette,
  Share2,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { COMPANY_INFO, getWhatsAppUrl } from '../data/catalog';
import { ActiveView } from './Navbar';
import { ServicesView } from './ServicesView';
import { WhyChooseSection, ContactSection } from './AboutAndContact';
import { ContactMessageItem } from '../services/dataService';
import { ScrollReveal } from './ScrollReveal';
import { GlobalNetworkIllustration } from './BrandIllustrations';

interface HomeViewProps {
  onNavigate: (view: ActiveView, sectionId?: string) => void;
  onSelectServiceForContact: (serviceName: string) => void;
  onSelectRoleForJobApplication: (role: string, category: string) => void;
  onSelectRoleForStaffRequest: (role: string, category: string) => void;
  selectedContactService?: string;
  onMessageSubmitted?: (msg: ContactMessageItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectServiceForContact,
  onSelectRoleForJobApplication,
  onSelectRoleForStaffRequest,
  selectedContactService,
  onMessageSubmitted,
}) => {
  return (
    <div className="space-y-0">
      {/* ==================================================
          1. HERO SECTION — FULL-WIDTH INTERNATIONAL UPGRADE
      ================================================== */}
      <section className="relative pt-12 pb-20 lg:py-24 bg-brand-canvas bg-subtle-grid border-b border-white/10 overflow-hidden">
        {/* Subtle ambient radial lights matching logo cobalt blue & crescent gold */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full bg-[#0A66FF]/15 blur-[130px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-10 w-[420px] h-[420px] rounded-full bg-amber-500/10 blur-[120px]"
        />

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column: Brand Proposition, 5 Pillars & 3 Primary Buttons */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-amber-400 tracking-wide">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>REHMAN GWS · Global Work Solutions</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.08] tracking-tight">
                Global Solutions. Creative Excellence. Business Growth.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                REHMAN GWS partners with local and international organizations to deliver unified{' '}
                <strong className="text-white font-semibold">Graphic Design</strong>,{' '}
                <strong className="text-white font-semibold">Recruitment & Staffing</strong>,{' '}
                <strong className="text-white font-semibold">Social Media Management</strong>,{' '}
                <strong className="text-white font-semibold">Social Media Marketing</strong>, and{' '}
                <strong className="text-white font-semibold">Business Solutions</strong>.
              </p>

              {/* 3 Primary Hero CTA Buttons */}
              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0A66FF] hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_28px_-4px_rgba(10,102,255,0.65)] transition-all whitespace-nowrap cursor-pointer"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('employers')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 hover:border-[#38BDF8]/50 text-white text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer"
                >
                  <span>Request Staff</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('jobs')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 hover:text-white text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer"
                >
                  <span>Apply for a Job</span>
                </button>
              </div>

              {/* Clean Unboxed 5-Service Discipline Strip */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
                <span className="text-slate-200 font-medium">Graphic Design</span>
                <span aria-hidden="true" className="text-amber-400">·</span>
                <span className="text-slate-200 font-medium">Recruitment & Staffing</span>
                <span aria-hidden="true" className="text-amber-400">·</span>
                <span className="text-slate-200 font-medium">Social Media Management</span>
                <span aria-hidden="true" className="text-amber-400">·</span>
                <span className="text-slate-200 font-medium">Social Media Marketing</span>
                <span aria-hidden="true" className="text-amber-400">·</span>
                <span className="text-slate-200 font-medium">Business Solutions</span>
              </div>
            </div>

            {/* Right Column: Sophisticated International Globe & Connected Business Network Visual */}
            <div className="lg:col-span-5">
              <ScrollReveal variant="scale-in" delayMs={120}>
                <GlobalNetworkIllustration />
              </ScrollReveal>
            </div>
          </div>

          {/* Two Prominent Gateway Portals Below Hero: FOR JOB SEEKERS & FOR EMPLOYERS */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portal A: Job Seekers */}
            <div className="brand-card rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#38BDF8]">
                  <Briefcase className="w-4 h-4" />
                  <span>Career Portal · For Job Seekers</span>
                </div>
                <h2 className="font-display text-xl font-bold text-white">
                  Your Next Opportunity Could Start Here.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Browse verified openings across Hospitality, Office, IT, Sales & General Workforce and submit your CV online.
                </p>
              </div>
              <div className="flex sm:flex-col gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate('jobs')}
                  className="px-5 py-2.5 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  Apply Now
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('jobs')}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-medium rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  View Jobs
                </button>
              </div>
            </div>

            {/* Portal B: Businesses / Employers */}
            <div className="brand-card rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <Users className="w-4 h-4" />
                  <span>Employer Portal · For Businesses</span>
                </div>
                <h2 className="font-display text-xl font-bold text-white">
                  Need the Right People for Your Business?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Tell us your staffing requirements and our recruitment team will review your request and connect you with suitable candidates.
                </p>
              </div>
              <div className="flex sm:flex-col gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate('employers')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  Request Staff
                </button>
                <a
                  href={getWhatsAppUrl('Hello REHMAN GWS, I would like to request staff for my business.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-medium rounded-xl text-center transition-colors whitespace-nowrap"
                >
                  Hire via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          2. TRUST / INTRODUCTION SECTION (CLEAN LIGHT CONTRAST SECTION)
      ================================================== */}
      <section className="py-20 bg-[#F8FAFC] text-slate-900 bg-light-grid border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-bold text-[#0A66FF] uppercase tracking-wider">
                International Corporate Profile
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Your Global Partner in Business Growth
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                REHMAN GWS provides professional creative, recruitment, and digital business solutions for local and international clients—combining design precision, reliable workforce sourcing, and strategic marketing execution.
              </p>
            </div>
          </div>

          {/* 4 Capability Pillar Cards on Light Canvas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <button
              type="button"
              onClick={() => onNavigate('services', 'graphic-design')}
              className="text-left p-6 rounded-2xl bg-white hover:bg-[#050811] text-slate-900 hover:text-white border border-slate-200/90 hover:border-[#0A66FF] shadow-sm hover:shadow-xl transition-all duration-200 space-y-3 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <Palette className="w-6 h-6 text-[#0A66FF] group-hover:text-[#38BDF8]" />
                <span className="font-mono tabular-nums text-xl font-bold text-slate-950 group-hover:text-white">
                  36+
                </span>
              </div>
              <div className="font-display text-lg font-bold">Graphic Design</div>
              <p className="text-xs text-slate-600 group-hover:text-slate-300 leading-relaxed">
                Logo design, brand identity, corporate profiles, packaging, menus, print media & UI graphics.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('services', 'recruitment-staffing')}
              className="text-left p-6 rounded-2xl bg-white hover:bg-[#050811] text-slate-900 hover:text-white border border-slate-200/90 hover:border-[#0A66FF] shadow-sm hover:shadow-xl transition-all duration-200 space-y-3 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <Users className="w-6 h-6 text-[#0A66FF] group-hover:text-amber-400" />
                <span className="font-mono tabular-nums text-xl font-bold text-slate-950 group-hover:text-white">
                  5 Sectors
                </span>
              </div>
              <div className="font-display text-lg font-bold">Recruitment & Staffing</div>
              <p className="text-xs text-slate-600 group-hover:text-slate-300 leading-relaxed">
                Hospitality, Office & Admin, IT & Digital, Sales & Marketing, and General Workforce roles.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('services', 'social-media-management')}
              className="text-left p-6 rounded-2xl bg-white hover:bg-[#050811] text-slate-900 hover:text-white border border-slate-200/90 hover:border-[#0A66FF] shadow-sm hover:shadow-xl transition-all duration-200 space-y-3 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <Share2 className="w-6 h-6 text-[#0A66FF] group-hover:text-[#38BDF8]" />
                <span className="font-mono tabular-nums text-xl font-bold text-slate-950 group-hover:text-white">
                  38 Scopes
                </span>
              </div>
              <div className="font-display text-lg font-bold">Social Media & Marketing</div>
              <p className="text-xs text-slate-600 group-hover:text-slate-300 leading-relaxed">
                Full-channel management, content calendars, Meta Ads, lead generation & analytics reports.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('services', 'business-solutions')}
              className="text-left p-6 rounded-2xl bg-white hover:bg-[#050811] text-slate-900 hover:text-white border border-slate-200/90 hover:border-[#0A66FF] shadow-sm hover:shadow-xl transition-all duration-200 space-y-3 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <Building2 className="w-6 h-6 text-[#0A66FF] group-hover:text-amber-400" />
                <span className="font-mono tabular-nums text-xl font-bold text-slate-950 group-hover:text-white">
                  12 Pillars
                </span>
              </div>
              <div className="font-display text-lg font-bold">Business Solutions</div>
              <p className="text-xs text-slate-600 group-hover:text-slate-300 leading-relaxed">
                Business branding, Google Business Profile setup, market research & client outreach.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. ALL SERVICES SECTIONS
      ================================================== */}
      <ServicesView
        onNavigate={onNavigate}
        onSelectServiceForContact={onSelectServiceForContact}
        onSelectRoleForJobApplication={onSelectRoleForJobApplication}
        onSelectRoleForStaffRequest={onSelectRoleForStaffRequest}
      />

      {/* ==================================================
          4. WHY CHOOSE REHMAN GWS
      ================================================== */}
      <WhyChooseSection />

      {/* ==================================================
          5. DUAL CTA BANNER (EMPLOYERS & JOB SEEKERS)
      ================================================== */}
      <section className="py-16 bg-[#050811] border-t border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0A1020] to-[#050811] border border-[#0A66FF]/40 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#38BDF8] uppercase tracking-wider">
                  Workforce Recruitment
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Need Staff? We Can Help.
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Whether you operate a hotel, restaurant, corporate office, retail brand, or digital agency, submit your staffing request and let our team source suitable candidates.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('employers')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <span>Request Staff</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#0A1020] to-[#050811] border border-amber-500/35 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  International Career Portal
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Looking for Your Next Opportunity?
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Explore open roles across 5 major industry sectors, upload your CV online, and join our verified candidate database for local and international employers.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('jobs')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('jobs')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  <span>View Jobs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. CONTACT US SECTION ("Let's Build Something Great Together")
      ================================================== */}
      <ContactSection
        initialService={selectedContactService}
        onMessageSubmitted={onMessageSubmitted}
      />
    </div>
  );
};
