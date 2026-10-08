import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export type ActiveView =
  | 'home'
  | 'about'
  | 'services'
  | 'jobs'
  | 'employers'
  | 'contact'
  | 'admin-login'
  | 'admin-dashboard';

interface NavbarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView, sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (view: ActiveView, sectionId?: string) => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    onNavigate(view, sectionId);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-[#050811]/95 backdrop-blur-2xl border-b border-white/15 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]'
          : 'bg-[#050811]/75 backdrop-blur-xl border-b border-white/10'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Original REHMAN GWS Logo & Brand Lockup */}
        <BrandLogo
          size="header"
          showText={true}
          showUploadHelper={false}
          onLogoClick={() => handleNav('home')}
        />

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden xl:flex items-center gap-5 text-[13px] font-medium text-slate-300"
        >
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`hover:text-white transition-colors whitespace-nowrap py-1.5 border-b-2 cursor-pointer ${
              activeView === 'home' ? 'border-[#0A66FF] text-white font-semibold' : 'border-transparent'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNav('about')}
            className={`hover:text-white transition-colors whitespace-nowrap py-1.5 border-b-2 cursor-pointer ${
              activeView === 'about' ? 'border-[#0A66FF] text-white font-semibold' : 'border-transparent'
            }`}
          >
            About
          </button>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => handleNav('services')}
              aria-expanded={servicesDropdownOpen}
              className={`flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap py-1.5 border-b-2 cursor-pointer ${
                activeView === 'services' ? 'border-[#0A66FF] text-white font-semibold' : 'border-transparent'
              }`}
            >
              <span>Services</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {servicesDropdownOpen && (
              <div className="absolute left-0 top-full pt-2 w-64 z-50">
                <div className="bg-[#0A1020] border border-white/15 rounded-xl shadow-2xl py-2 backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => handleNav('services', 'graphic-design')}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-[#0A66FF]/15 hover:text-white transition-colors cursor-pointer"
                  >
                    Graphic Design Services
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('services', 'recruitment-staffing')}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-[#0A66FF]/15 hover:text-white transition-colors cursor-pointer"
                  >
                    Recruitment & Staffing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('services', 'social-media-management')}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-[#0A66FF]/15 hover:text-white transition-colors cursor-pointer"
                  >
                    Social Media Management
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('services', 'social-media-marketing')}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-[#0A66FF]/15 hover:text-white transition-colors cursor-pointer"
                  >
                    Social Media Marketing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('services', 'business-solutions')}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-[#0A66FF]/15 hover:text-white transition-colors cursor-pointer"
                  >
                    Business Solutions
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNav('services', 'recruitment-staffing')}
            className="hover:text-white transition-colors whitespace-nowrap py-1.5 border-b-2 border-transparent cursor-pointer"
          >
            Recruitment
          </button>

          <button
            type="button"
            onClick={() => handleNav('services', 'social-media-management')}
            className="hover:text-white transition-colors whitespace-nowrap py-1.5 border-b-2 border-transparent cursor-pointer"
          >
            Social Media
          </button>

          <button
            type="button"
            onClick={() => handleNav('jobs')}
            className={`hover:text-white transition-colors whitespace-nowrap py-1.5 border-b-2 cursor-pointer ${
              activeView === 'jobs' ? 'border-[#0A66FF] text-white font-semibold' : 'border-transparent'
            }`}
          >
            Jobs
          </button>

          <button
            type="button"
            onClick={() => handleNav('employers')}
            className={`hover:text-white transition-colors whitespace-nowrap py-1.5 border-b-2 cursor-pointer ${
              activeView === 'employers' ? 'border-[#0A66FF] text-white font-semibold' : 'border-transparent'
            }`}
          >
            For Employers
          </button>

          <button
            type="button"
            onClick={() => handleNav('contact')}
            className={`hover:text-white transition-colors whitespace-nowrap py-1.5 border-b-2 cursor-pointer ${
              activeView === 'contact' ? 'border-[#0A66FF] text-white font-semibold' : 'border-transparent'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Prominent Primary Action Buttons ("Find a Job" and "Request Staff") */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('jobs')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-100 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-amber-400/40 rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            Find a Job
          </button>
          <button
            type="button"
            onClick={() => handleNav('employers')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#0A66FF] hover:bg-blue-500 shadow-[0_0_20px_-4px_rgba(10,102,255,0.6)] rounded-lg transition-all whitespace-nowrap cursor-pointer"
          >
            <span>Request Staff</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          className="xl:hidden p-2.5 rounded-lg text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070B16]/98 backdrop-blur-2xl border-b border-white/15 px-4 pt-4 pb-6 space-y-2 max-h-[82vh] overflow-y-auto">
          <div className="pb-3 mb-2 border-b border-white/10">
            <BrandLogo size="header" showText={true} showUploadHelper={false} />
          </div>
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-100 hover:bg-white/5"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleNav('about')}
            className="block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-100 hover:bg-white/5"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleNav('services')}
            className="block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-100 hover:bg-white/5"
          >
            Services
          </button>
          <div className="pl-4 space-y-1 border-l border-[#0A66FF]/40 ml-3">
            <button
              type="button"
              onClick={() => handleNav('services', 'graphic-design')}
              className="block w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white"
            >
              Graphic Design Services
            </button>
            <button
              type="button"
              onClick={() => handleNav('services', 'recruitment-staffing')}
              className="block w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white"
            >
              Recruitment & Staffing
            </button>
            <button
              type="button"
              onClick={() => handleNav('services', 'social-media-management')}
              className="block w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white"
            >
              Social Media Management
            </button>
            <button
              type="button"
              onClick={() => handleNav('services', 'social-media-marketing')}
              className="block w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white"
            >
              Social Media Marketing
            </button>
            <button
              type="button"
              onClick={() => handleNav('services', 'business-solutions')}
              className="block w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white"
            >
              Business Solutions
            </button>
          </div>
          <button
            type="button"
            onClick={() => handleNav('jobs')}
            className="block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-100 hover:bg-white/5"
          >
            Jobs
          </button>
          <button
            type="button"
            onClick={() => handleNav('employers')}
            className="block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-100 hover:bg-white/5"
          >
            For Employers
          </button>
          <button
            type="button"
            onClick={() => handleNav('contact')}
            className="block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-100 hover:bg-white/5"
          >
            Contact
          </button>

          <div className="pt-4 grid grid-cols-1 gap-2.5">
            <button
              type="button"
              onClick={() => handleNav('jobs')}
              className="w-full py-3 px-4 text-center text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg transition-colors"
            >
              Find a Job
            </button>
            <button
              type="button"
              onClick={() => handleNav('employers')}
              className="w-full py-3 px-4 text-center text-sm font-semibold text-white bg-[#0A66FF] hover:bg-blue-500 rounded-lg transition-colors"
            >
              Request Staff
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
