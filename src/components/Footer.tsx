import React from 'react';
import { MessageSquare, Mail, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { COMPANY_INFO, getWhatsAppUrl } from '../data/catalog';
import { ActiveView } from './Navbar';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (view: ActiveView, sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#03050B] border-t border-white/10 text-slate-400">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Original Logo & Brand Identity */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <BrandLogo size="footer" showText={true} showUploadHelper={false} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {COMPANY_INFO.tagline} Providing Graphic Design, Recruitment & Staffing, Social Media Management, Social Media Marketing, and Business Solutions for local and international clients.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="REHMAN GWS on Facebook"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#0A66FF]/20 border border-white/10 hover:border-[#0A66FF]/50 hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="REHMAN GWS on Instagram"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#0A66FF]/20 border border-white/10 hover:border-[#0A66FF]/50 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="REHMAN GWS on LinkedIn"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#0A66FF]/20 border border-white/10 hover:border-[#0A66FF]/50 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="REHMAN GWS on TikTok"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#0A66FF]/20 border border-white/10 hover:border-[#0A66FF]/50 hover:text-white transition-colors"
              >
                TikTok
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="REHMAN GWS on YouTube"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#0A66FF]/20 border border-white/10 hover:border-[#0A66FF]/50 hover:text-white transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display text-sm font-bold text-white">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('jobs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Jobs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('employers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  For Employers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display text-sm font-bold text-white">Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services', 'graphic-design')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Graphic Design
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services', 'recruitment-staffing')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Recruitment & Staffing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services', 'social-media-management')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Social Media Management
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services', 'social-media-marketing')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Social Media Marketing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services', 'business-solutions')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Business Solutions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display text-sm font-bold text-white">Contact</h3>
            <div className="space-y-3.5 text-sm">
              <div>
                <div className="text-xs text-slate-500">WhatsApp Direct</div>
                <a
                  href={getWhatsAppUrl('Hello REHMAN GWS, I would like to discuss your services.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-200 hover:text-emerald-400 font-mono tabular-nums mt-0.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{COMPANY_INFO.whatsappNumber}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <div>
                <div className="text-xs text-slate-500">Corporate Email</div>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="inline-flex items-center gap-1.5 text-slate-200 hover:text-[#38BDF8] mt-0.5 break-all transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span>{COMPANY_INFO.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 REHMAN GWS – Global Work Solutions. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('jobs')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Career Portal
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => onNavigate('employers')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Employer Staffing Portal
            </button>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={getWhatsAppUrl('Hello REHMAN GWS, I would like to discuss your services.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with REHMAN GWS on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-xl border border-emerald-400/30 transition-transform duration-150 hover:scale-105"
      >
        <MessageSquare className="w-5 h-5 shrink-0" />
        <span className="text-xs font-semibold whitespace-nowrap hidden sm:inline">
          WhatsApp Us
        </span>
      </a>
    </footer>
  );
};
