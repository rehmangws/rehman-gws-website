import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Building2,
  ArrowRight,
  Users,
} from 'lucide-react';
import { submitStaffingRequest, StaffingRequestItem } from '../services/dataService';
import { getWhatsAppUrl } from '../data/catalog';

interface EmployerPortalViewProps {
  initialPosition?: string;
  initialCategory?: string;
  onRequestSubmitted: (request: StaffingRequestItem) => void;
}

export const EmployerPortalView: React.FC<EmployerPortalViewProps> = ({
  initialPosition = '',
  initialCategory = '',
  onRequestSubmitted,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [position, setPosition] = useState(initialPosition);
  const [numberRequired, setNumberRequired] = useState('1');
  const [category, setCategory] = useState(initialCategory || 'Hospitality');
  const [experienceRequired, setExperienceRequired] = useState('2+ Years');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [salaryBudget, setSalaryBudget] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<StaffingRequestItem | null>(null);

  const formSectionRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialPosition) setPosition(initialPosition);
    if (initialCategory) setCategory(initialCategory);
  }, [initialPosition, initialCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !businessName.trim() ||
      !contactPerson.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !businessType.trim() ||
      !country.trim() ||
      !city.trim() ||
      !position.trim() ||
      !category.trim()
    ) {
      setErrorMsg('Please fill in all mandatory (*) staffing request fields.');
      return;
    }

    setSubmitting(true);
    try {
      const { staffingRequest } = await submitStaffingRequest({
        businessName,
        contactPerson,
        email,
        phone,
        businessType,
        country,
        city,
        position,
        category,
        numberRequired: Math.max(1, parseInt(numberRequired, 10) || 1),
        experienceRequired,
        employmentType,
        salaryBudget,
        requiredSkills,
        jobDescription,
        additionalRequirements,
      });

      setSubmittedRequest(staffingRequest);
      onRequestSubmitted(staffingRequest);

      setBusinessName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setBusinessType('');
      setCountry('');
      setCity('');
      setSalaryBudget('');
      setRequiredSkills('');
      setJobDescription('');
      setAdditionalRequirements('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit staffing request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-canvas bg-subtle-grid min-h-screen py-16 space-y-16">
      {/* 1. EMPLOYER HERO CTA BANNER */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#0A1020] via-[#070C18] to-[#050811] border border-white/15 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>REHMAN GWS · Employer Staffing Portal</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Need the Right People for Your Business?
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Tell us your staffing requirements and our team will review your request. We source candidates for hospitality, office administration, IT & digital, sales, and general site operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0A66FF] hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_24px_-4px_rgba(10,102,255,0.65)] transition-all whitespace-nowrap cursor-pointer"
            >
              <span>Request Staff</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={getWhatsAppUrl('Hello REHMAN GWS, I would like to request staff for my business.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold rounded-xl transition-all whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Recruitment</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. MAIN STAFFING REQUEST FORM & SIDEBAR */}
      <section
        ref={formSectionRef}
        id="employer-staff-form"
        className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start scroll-mt-24"
      >
        <div className="lg:col-span-8 bg-[#0A1020] border border-white/15 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="space-y-2 pb-6 mb-6 border-b border-white/10">
            <div className="text-xs font-semibold text-[#38BDF8] uppercase tracking-wider">
              Official Workforce Requisition
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              Request Staff Form
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Provide your organization details and role specifications below.
            </p>
          </div>

          {submittedRequest ? (
            <div
              role="status"
              aria-live="polite"
              className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-6"
            >
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-white">
                    Staffing Request Submitted Successfully
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Thank you, {submittedRequest.contactPerson}. Your staffing request for{' '}
                    <span className="font-semibold text-white">
                      {submittedRequest.numberRequired} × {submittedRequest.position}
                    </span>{' '}
                    at <span className="font-semibold text-white">{submittedRequest.businessName}</span> has been registered in our recruitment database.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400">Request ID: </span>
                      <span className="font-mono tabular-nums font-semibold text-amber-400">
                        {submittedRequest.requestId}
                      </span>
                    </div>
                    <span aria-hidden="true">·</span>
                    <div>
                      <span className="text-slate-400">Category: </span>
                      <span className="text-white">{submittedRequest.category}</span>
                    </div>
                    <span aria-hidden="true">·</span>
                    <div>
                      <span className="text-slate-400">Status: </span>
                      <span className="text-emerald-400 font-medium">{submittedRequest.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                <a
                  href={getWhatsAppUrl(
                    `Hello REHMAN GWS, I submitted a Staffing Request (ID: ${submittedRequest.requestId}) for ${submittedRequest.businessName} (${submittedRequest.numberRequired} x ${submittedRequest.position}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Priority Follow-Up on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSubmittedRequest(null)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-950/50 border border-red-500/40 flex items-center gap-3 text-xs sm:text-sm text-red-200"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="staff-businessName" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Business Name *
                  </label>
                  <input
                    id="staff-businessName"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Company, Hotel, Restaurant, or Agency Name"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="staff-contactPerson" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Contact Person *
                  </label>
                  <input
                    id="staff-contactPerson"
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Full Name & Title"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="staff-email" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Business Email *
                  </label>
                  <input
                    id="staff-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hr@yourcompany.com"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="staff-phone" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="staff-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 0000000"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="staff-businessType" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Business Type *
                  </label>
                  <input
                    id="staff-businessType"
                    type="text"
                    required
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="e.g. Hotel, Restaurant, Corporate Office, Retail, Agency"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="staff-category" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Job Category *
                  </label>
                  <select
                    id="staff-category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#0A66FF]"
                  >
                    <option value="Hospitality">Hospitality</option>
                    <option value="Office & Administration">Office & Administration</option>
                    <option value="IT & Digital">IT & Digital</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="General Workforce">General Workforce</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="staff-country" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Country *
                  </label>
                  <input
                    id="staff-country"
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. UAE, Saudi Arabia, Qatar, UK, Pakistan"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="staff-city" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    City / Location *
                  </label>
                  <input
                    id="staff-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Dubai, Riyadh, Doha, Lahore"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="staff-position" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Position Required *
                  </label>
                  <input
                    id="staff-position"
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Chef, Waiter, Receptionist, Graphic Designer"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="staff-numberRequired" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Number of Employees *
                  </label>
                  <input
                    id="staff-numberRequired"
                    type="number"
                    min={1}
                    max={10000}
                    required
                    value={numberRequired}
                    onChange={(e) => setNumberRequired(e.target.value)}
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="staff-experience" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Experience Required
                  </label>
                  <select
                    id="staff-experience"
                    value={experienceRequired}
                    onChange={(e) => setExperienceRequired(e.target.value)}
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#0A66FF]"
                  >
                    <option value="Entry Level / Fresh">Entry Level / Fresh</option>
                    <option value="1+ Years">1+ Years</option>
                    <option value="2+ Years">2+ Years</option>
                    <option value="3+ Years">3+ Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="staff-employmentType" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Employment Type
                  </label>
                  <select
                    id="staff-employmentType"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#0A66FF]"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="staff-salaryBudget" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Salary / Budget (Optional)
                  </label>
                  <input
                    id="staff-salaryBudget"
                    type="text"
                    value={salaryBudget}
                    onChange={(e) => setSalaryBudget(e.target.value)}
                    placeholder="e.g. $1,500 - $2,000 / mo + Visa"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="staff-requiredSkills" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Required Skills
                  </label>
                  <input
                    id="staff-requiredSkills"
                    type="text"
                    value={requiredSkills}
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    placeholder="e.g. English fluency, POS systems, culinary certification"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="staff-jobDescription" className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Job Description
                </label>
                <textarea
                  id="staff-jobDescription"
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Describe the daily responsibilities, shift schedule, and role expectations..."
                  className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                />
              </div>

              <div>
                <label htmlFor="staff-additional" className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Additional Requirements
                </label>
                <textarea
                  id="staff-additional"
                  rows={2}
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="Accommodation details, onboarding timeline, language requirements, etc."
                  className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  Every staffing request is logged with a unique reference code and routed to our recruitment team.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#0A66FF] hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-[0_0_24px_-4px_rgba(10,102,255,0.65)] transition-all whitespace-nowrap cursor-pointer"
                >
                  {submitting ? 'Submitting Request...' : 'Submit Staffing Request'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Side Panel: Structured Workforce Fulfillment */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[#0A1020] border border-white/15 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0A66FF]/15 border border-[#0A66FF]/30 flex items-center justify-center text-[#38BDF8]">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="font-display text-lg font-bold text-white">
                Structured Workforce Fulfillment
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              REHMAN GWS supports hospitality groups, corporate offices, retail chains, digital agencies, and logistics operators with tailored candidate sourcing.
            </p>
            <div className="space-y-4 pt-3 border-t border-white/10 text-xs">
              <div className="p-3.5 rounded-xl bg-[#050811] border border-white/5">
                <div className="font-mono text-amber-400 text-[11px]">STEP 01</div>
                <div className="font-bold text-white mt-0.5">Requirement Review</div>
                <p className="text-slate-400 mt-1">
                  We verify role specifications, skill benchmarks, and location parameters.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#050811] border border-white/5">
                <div className="font-mono text-[#38BDF8] text-[11px]">STEP 02</div>
                <div className="font-bold text-white mt-0.5">Candidate Screening</div>
                <p className="text-slate-400 mt-1">
                  We shortlist qualified profiles from our active applicant database and targeted talent pools.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#050811] border border-white/5">
                <div className="font-mono text-emerald-400 text-[11px]">STEP 03</div>
                <div className="font-bold text-white mt-0.5">Interview & Placement</div>
                <p className="text-slate-400 mt-1">
                  Coordinate candidate interviews and streamline selection for your hiring managers.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <div className="text-xs text-slate-400">Need immediate assistance?</div>
              <a
                href={getWhatsAppUrl('Hello REHMAN GWS, I would like to request staff for my business.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Recruitment Team</span>
              </a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};
