import React, { useState } from 'react';
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Globe,
  ShieldCheck,
  Sparkles,
  Award,
  Target,
  Clock,
  Sliders,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { COMPANY_INFO, getWhatsAppUrl, WHY_CHOOSE_CARDS } from '../data/catalog';
import { submitContactEnquiry, ContactMessageItem } from '../services/dataService';
import { ActiveView } from './Navbar';
import { BrandLogo } from './BrandLogo';
import { GlobalNetworkIllustration } from './BrandIllustrations';
import { ScrollReveal } from './ScrollReveal';

interface AboutSectionProps {
  onNavigate: (view: ActiveView, sectionId?: string) => void;
}

const WHY_ICONS = [
  ShieldCheck,
  Award,
  Globe,
  Target,
  Clock,
  Sliders,
  Lightbulb,
  TrendingUp,
];

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0">
      {/* Main About Header & Overview */}
      <section className="py-20 bg-brand-canvas bg-subtle-grid border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <ScrollReveal variant="fade-up" className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Corporate Profile · Global Work Solutions</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                About REHMAN GWS
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                REHMAN GWS – Global Work Solutions is a professional international service company providing integrated creative, workforce recruitment, and digital business solutions for businesses, brands, and organizations.
              </p>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Modern enterprises often face fragmented vendor coordination—working with separate providers for corporate identity design, staff recruitment, social media management, and digital advertising. REHMAN GWS unifies these five essential business pillars under one disciplined operational partner.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Contact Our Team</span>
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="scale-in" delayMs={120} className="lg:col-span-5">
              <GlobalNetworkIllustration />
            </ScrollReveal>
          </div>

          {/* Five Core Pillars Breakdown */}
          <div className="mt-20 space-y-8">
            <ScrollReveal variant="fade-up">
              <div className="max-w-2xl space-y-2">
                <div className="text-xs font-semibold text-[#38BDF8] uppercase tracking-wider">
                  Core Disciplines
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Five Integrated Practice Areas
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ScrollReveal variant="fade-up" delayMs={50}>
                <div className="brand-card p-6 rounded-xl space-y-3 h-full">
                  <div className="text-xs font-mono tabular-nums text-[#38BDF8]">01</div>
                  <h3 className="font-display text-lg font-bold text-white">Graphic Design</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Corporate brand identity systems, logos, stationery, company profiles, print media, packaging design, menus, billboards, and commercial digital graphics.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delayMs={100}>
                <div className="brand-card p-6 rounded-xl space-y-3 h-full">
                  <div className="text-xs font-mono tabular-nums text-amber-400">02</div>
                  <h3 className="font-display text-lg font-bold text-white">Recruitment & Staffing</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Structured candidate sourcing and workforce placement across Hospitality, Office & Administration, IT & Digital, Sales & Marketing, and General Workforce sectors.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delayMs={150}>
                <div className="brand-card p-6 rounded-xl space-y-3 h-full">
                  <div className="text-xs font-mono tabular-nums text-[#38BDF8]">03</div>
                  <h3 className="font-display text-lg font-bold text-white">Social Media Management</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    End-to-end stewardship of corporate channels on Facebook, Instagram, LinkedIn, TikTok, YouTube, Pinterest, and X—including monthly calendars, copywriting, and community management.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delayMs={200}>
                <div className="brand-card p-6 rounded-xl space-y-3 h-full">
                  <div className="text-xs font-mono tabular-nums text-[#38BDF8]">04</div>
                  <h3 className="font-display text-lg font-bold text-white">Social Media Marketing</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Targeted paid acquisition, Meta Ads, lead generation campaigns, audience research, competitor benchmarking, and transparent performance reporting.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delayMs={250} className="md:col-span-2 lg:col-span-2">
                <div className="brand-card p-6 rounded-xl space-y-3 h-full">
                  <div className="text-xs font-mono tabular-nums text-amber-400">05</div>
                  <h3 className="font-display text-lg font-bold text-white">Business Solutions</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Comprehensive business branding, online presence setup, Google Business Profile assistance, market research, client outreach support, and ongoing digital presence management for local and international organizations.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Why Businesses Choose REHMAN GWS */}
      <WhyChooseSection />
    </div>
  );
};

export const WhyChooseSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#F8FAFC] text-slate-900 bg-light-grid border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ScrollReveal variant="fade-up">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0A66FF] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Operational Excellence</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Why Businesses Choose REHMAN GWS
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Built on professional standards, creative thinking, reliable communication, and business-focused strategy.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_CHOOSE_CARDS.map((card, i) => {
            const IconComponent = WHY_ICONS[i % WHY_ICONS.length];
            return (
              <ScrollReveal key={card.index} variant="fade-up" delayMs={i * 50}>
                <div className="p-6 rounded-2xl bg-white hover:bg-[#050811] text-slate-900 hover:text-white border border-slate-200/90 hover:border-[#0A66FF] shadow-sm hover:shadow-xl transition-all duration-200 space-y-4 h-full group">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-[#0A66FF]/20 flex items-center justify-center text-[#0A66FF] group-hover:text-amber-400 group-hover:scale-110 transition-all duration-200">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono tabular-nums text-slate-400 group-hover:text-slate-500 font-semibold">
                      {card.index}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-950 group-hover:text-white transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 group-hover:text-slate-300 leading-relaxed transition-colors">
                    {card.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface ContactSectionProps {
  initialService?: string;
  onMessageSubmitted?: (msg: ContactMessageItem) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialService = 'Graphic Design Services',
  onMessageSubmitted,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [serviceRequired, setServiceRequired] = useState(initialService);
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedMsg, setSubmittedMsg] = useState<ContactMessageItem | null>(null);

  React.useEffect(() => {
    if (initialService) setServiceRequired(initialService);
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !serviceRequired.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, email, service required, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const { contactMessage } = await submitContactEnquiry({
        name,
        email,
        phone,
        company,
        serviceRequired,
        message,
      });
      setSubmittedMsg(contactMessage);
      onMessageSubmitted?.(contactMessage);

      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="py-20 bg-brand-canvas bg-subtle-grid">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up">
          <div className="bg-[#0A1020]/95 border border-white/15 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Direct Contact Details & Subtle Global Network Visual */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2.5">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Let&apos;s Work Together</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Let&apos;s Build Something Great Together.
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed pt-1">
                    Connect with REHMAN GWS – Global Work Solutions to discuss graphic design projects, workforce staffing requirements, social media retainers, or business growth solutions.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-[#050811] border border-white/10 space-y-5">
                  <div>
                    <BrandLogo size="card" showText={true} showUploadHelper={false} />
                  </div>

                  <div className="space-y-3.5 pt-3 border-t border-white/10 text-sm">
                    <div>
                      <div className="text-xs text-slate-500">WhatsApp</div>
                      <a
                        href={getWhatsAppUrl('Hello REHMAN GWS, I would like to discuss your services.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white hover:text-emerald-400 font-mono tabular-nums font-semibold mt-0.5 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{COMPANY_INFO.whatsappNumber}</span>
                      </a>
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">Email</div>
                      <a
                        href={`mailto:${COMPANY_INFO.email}`}
                        className="inline-flex items-center gap-2 text-white hover:text-[#38BDF8] font-medium mt-0.5 break-all transition-colors"
                      >
                        <Mail className="w-4 h-4 text-[#38BDF8] shrink-0" />
                        <span>{COMPANY_INFO.email}</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={getWhatsAppUrl('Hello REHMAN GWS, I would like to discuss your services.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp CTA</span>
                  </a>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                  >
                    <Mail className="w-4 h-4 text-[#38BDF8]" />
                    <span>Email CTA</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Online Contact Form */}
              <div className="lg:col-span-7">
                {submittedMsg ? (
                  <div
                    role="status"
                    aria-live="polite"
                    className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-5"
                  >
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <h3 className="font-display text-2xl font-bold text-white">
                          Enquiry Sent Successfully
                        </h3>
                        <p className="text-sm text-slate-200 leading-relaxed">
                          Thank you, {submittedMsg.name}. Your message regarding{' '}
                          <span className="font-semibold text-white">
                            {submittedMsg.serviceRequired}
                          </span>{' '}
                          has been logged under reference{' '}
                          <span className="font-mono text-amber-400 font-semibold">
                            {submittedMsg.messageId}
                          </span>
                          . Our team will respond shortly.
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setSubmittedMsg(null)}
                        className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Send Another Message
                      </button>
                      <a
                        href={getWhatsAppUrl(
                          `Hello REHMAN GWS, I just submitted enquiry ${submittedMsg.messageId} regarding ${submittedMsg.serviceRequired}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Continue on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div
                        role="alert"
                        className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 flex items-center gap-2.5 text-xs text-red-200"
                      >
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          Phone / WhatsApp
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 300 0000000"
                          className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-company"
                          className="block text-xs font-medium text-slate-300 mb-1.5"
                        >
                          Company / Organization
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Your Company Name"
                          className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-service"
                        className="block text-xs font-medium text-slate-300 mb-1.5"
                      >
                        Service Required *
                      </label>
                      <select
                        id="contact-service"
                        value={serviceRequired}
                        onChange={(e) => setServiceRequired(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#0A66FF]"
                      >
                        <option value="Graphic Design Services">Graphic Design Services</option>
                        <option value="Recruitment & Staffing Services">
                          Recruitment & Staffing Services
                        </option>
                        <option value="Social Media Management">Social Media Management</option>
                        <option value="Social Media Marketing">Social Media Marketing</option>
                        <option value="Business Solutions">Business Solutions</option>
                        <option value="Custom Corporate Package">Custom Corporate Package</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-medium text-slate-300 mb-1.5"
                      >
                        Project or Staffing Details *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your project, timeline, or business requirements..."
                        className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#0A66FF] hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-[0_0_24px_-4px_rgba(10,102,255,0.65)] transition-all cursor-pointer"
                    >
                      <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
