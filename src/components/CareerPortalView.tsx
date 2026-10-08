import React, { useState, useRef } from 'react';
import {
  Search,
  Upload,
  CheckCircle2,
  FileText,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { JobItem, submitJobApplication, ApplicantItem } from '../services/dataService';
import { RECRUITMENT_CATEGORIES, getWhatsAppUrl } from '../data/catalog';

interface CareerPortalViewProps {
  jobs: JobItem[];
  initialPosition?: string;
  initialCategory?: string;
  onApplicationSubmitted: (applicant: ApplicantItem) => void;
}

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg'];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB max CV size for secure storage

export const CareerPortalView: React.FC<CareerPortalViewProps> = ({
  jobs,
  initialPosition = '',
  initialCategory = '',
  onApplicationSubmitted,
}) => {
  // Search and Filter States
  const [searchTitle, setSearchTitle] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterEmploymentType, setFilterEmploymentType] = useState('ALL');
  const [filterExperience, setFilterExperience] = useState('ALL');

  // Application Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [position, setPosition] = useState(initialPosition);
  const [category, setCategory] = useState(initialCategory || 'Hospitality');
  const [experience, setExperience] = useState('2+ Years');
  const [skills, setSkills] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [availability, setAvailability] = useState('Immediate');
  const [cvFileName, setCvFileName] = useState('');
  const [cvDataUrl, setCvDataUrl] = useState('');
  const [message, setMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<ApplicantItem | null>(null);

  const jobsGridRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (initialPosition) setPosition(initialPosition);
    if (initialCategory) setCategory(initialCategory);
  }, [initialPosition, initialCategory]);

  const openJobs = jobs.filter((j) => j.status === 'Open');

  const filteredJobs = openJobs.filter((job) => {
    const matchesTitle =
      !searchTitle.trim() ||
      job.title.toLowerCase().includes(searchTitle.trim().toLowerCase()) ||
      job.description.toLowerCase().includes(searchTitle.trim().toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || job.category === filterCategory;
    const matchesLocation =
      !filterLocation.trim() ||
      job.location.toLowerCase().includes(filterLocation.trim().toLowerCase());
    const matchesType =
      filterEmploymentType === 'ALL' ||
      job.employmentType.toLowerCase() === filterEmploymentType.toLowerCase();
    const matchesExp =
      filterExperience === 'ALL' ||
      job.experience.toLowerCase().includes(filterExperience.toLowerCase());

    return matchesTitle && matchesCategory && matchesLocation && matchesType && matchesExp;
  });

  const handleSelectJobToApply = (job: JobItem) => {
    setPosition(job.title);
    setCategory(job.category);
    setSubmittedRecord(null);
    setErrorMsg('');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectRoleChip = (roleName: string, catName: string) => {
    setPosition(roleName);
    setCategory(catName);
    setSubmittedRecord(null);
    setErrorMsg('');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const processSelectedFile = (file: File) => {
    setErrorMsg('');
    const lowerName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
    if (!hasValidExt) {
      setErrorMsg('Invalid file type. Allowed formats: PDF, DOC, DOCX, TXT, PNG, JPG.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg('CV file size exceeds the 2MB security limit. Please upload a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setCvDataUrl(result.slice(0, 340000));
      setCvFileName(file.name);
    };
    reader.onerror = () => {
      setErrorMsg('Could not read the selected file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processSelectedFile(file);
  };

  const handleGenerateStructuredCv = () => {
    const candidateName = fullName.trim() || 'Candidate';
    const targetRole = position.trim() || 'Professional Role';
    const summaryText = [
      `CURRICULUM VITAE - ${candidateName}`,
      `Target Position: ${targetRole} (${category})`,
      `Email: ${email || 'Provided in form'} | Phone: ${phone || 'Provided in form'}`,
      `Location: ${city || 'City'}, ${country || 'Country'}`,
      `Experience: ${experience}`,
      `Core Skills: ${skills || 'Professional domain competencies'}`,
      `Availability: ${availability}`,
      `Generated via REHMAN GWS Career Portal Profile Builder.`,
    ].join('\n');

    const encoded = `data:text/plain;base64,${btoa(unescape(encodeURIComponent(summaryText)))}`;
    setCvDataUrl(encoded);
    setCvFileName(`${candidateName.replace(/\s+/g, '_')}_CV_Profile.txt`);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !country.trim() ||
      !city.trim() ||
      !position.trim() ||
      !category.trim() ||
      !experience.trim() ||
      !skills.trim()
    ) {
      setErrorMsg('Please fill in all required (*) fields.');
      return;
    }

    if (!cvDataUrl) {
      setErrorMsg('Please upload your CV / Resume file (or click "Attach Structured CV Summary" below).');
      return;
    }

    setSubmitting(true);
    try {
      const { applicant } = await submitJobApplication({
        fullName,
        email,
        phone,
        country,
        city,
        position,
        category,
        experience,
        skills,
        expectedSalary,
        availability,
        cvUrl: cvDataUrl,
        cvFileName: cvFileName || 'Candidate_Resume.pdf',
        message,
      });

      setSubmittedRecord(applicant);
      onApplicationSubmitted(applicant);

      setFullName('');
      setEmail('');
      setPhone('');
      setCountry('');
      setCity('');
      setSkills('');
      setExpectedSalary('');
      setMessage('');
      setCvFileName('');
      setCvDataUrl('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-canvas bg-subtle-grid min-h-screen py-16 space-y-20">
      {/* 1. CAREER PORTAL HERO BANNER */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#0A1020] via-[#070C18] to-[#050811] border border-white/15 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              <span>REHMAN GWS · International Career Portal</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Your Next Opportunity Could Start Here.
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Browse verified openings across Hospitality, Office & Administration, IT & Digital, Sales & Marketing, and General Workforce—or submit your CV online to join our candidate pool.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            <button
              type="button"
              onClick={() => jobsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer"
            >
              View Jobs
            </button>
            <button
              type="button"
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0A66FF] hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_24px_-4px_rgba(10,102,255,0.65)] transition-all whitespace-nowrap cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. SEARCH, FILTERS & JOB CARDS */}
      <section ref={jobsGridRef} id="job-listings-grid" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Find Your Next Opportunity
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Filter open roles by title, sector category, location, employment type, or experience level.
            </p>
          </div>
          <span className="font-mono tabular-nums text-xs text-amber-400">
            {filteredJobs.length} Open Positions Available
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#0A1020] border border-white/15 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 shadow-xl">
          <div>
            <label htmlFor="job-search-title" className="block text-xs font-medium text-slate-300 mb-1.5">
              Job Title or Keyword
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="job-search-title"
                type="text"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="e.g. Designer, Chef..."
                className="w-full pl-9 pr-3 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="job-filter-category" className="block text-xs font-medium text-slate-300 mb-1.5">
              Category
            </label>
            <select
              id="job-filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#0A66FF]"
            >
              <option value="ALL">All Categories</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Office & Administration">Office & Administration</option>
              <option value="IT & Digital">IT & Digital</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="General Workforce">General Workforce</option>
            </select>
          </div>

          <div>
            <label htmlFor="job-filter-location" className="block text-xs font-medium text-slate-300 mb-1.5">
              Location
            </label>
            <input
              id="job-filter-location"
              type="text"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              placeholder="e.g. Dubai, Remote, UK..."
              className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
            />
          </div>

          <div>
            <label htmlFor="job-filter-type" className="block text-xs font-medium text-slate-300 mb-1.5">
              Employment Type
            </label>
            <select
              id="job-filter-type"
              value={filterEmploymentType}
              onChange={(e) => setFilterEmploymentType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#0A66FF]"
            >
              <option value="ALL">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label htmlFor="job-filter-experience" className="block text-xs font-medium text-slate-300 mb-1.5">
              Experience
            </label>
            <select
              id="job-filter-experience"
              value={filterExperience}
              onChange={(e) => setFilterExperience(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#0A66FF]"
            >
              <option value="ALL">Any Experience</option>
              <option value="1">1+ Years</option>
              <option value="2">2+ Years</option>
              <option value="3">3+ Years</option>
              <option value="4">4+ Years</option>
              <option value="5">5+ Years</option>
            </select>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <article
              key={job.jobId}
              className="brand-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-amber-400">{job.category}</span>
                  <span className="font-mono tabular-nums text-slate-500">{job.jobId}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  {job.title}
                </h3>
                <div className="text-xs font-semibold text-[#38BDF8]">
                  {job.company}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 pt-1">
                  <span>{job.location}</span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span>{job.employmentType}</span>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span>{job.experience} Experience</span>
                  {job.salary && (
                    <>
                      <span aria-hidden="true" className="text-slate-500">·</span>
                      <span className="font-mono tabular-nums text-amber-300">{job.salary}</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed pt-2">
                  {job.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <span className="text-xs text-emerald-400 font-medium">
                  Verified Opportunity
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectJobToApply(job)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}

          {filteredJobs.length === 0 && (
            <div className="col-span-full bg-[#0A1020] border border-white/15 rounded-2xl p-10 text-center space-y-3">
              <p className="text-base font-bold text-white">
                No open positions match your current filter criteria.
              </p>
              <p className="text-xs text-slate-400">
                Reset the filters below or submit your application directly for any role in the form below.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTitle('');
                  setFilterCategory('ALL');
                  setFilterLocation('');
                  setFilterEmploymentType('ALL');
                  setFilterExperience('ALL');
                }}
                className="px-4 py-2 bg-[#0A66FF] hover:bg-blue-500 text-xs font-semibold text-white rounded-xl cursor-pointer"
              >
                Reset Job Filters
              </button>
            </div>
          )}
        </div>

        {/* Quick Browse by Role Directory */}
        <div className="bg-[#0A1020] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-5">
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Browse All Recruitment Role Categories
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any position below to automatically prefill your job application form.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 pt-2">
            {RECRUITMENT_CATEGORIES.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <div className="text-xs font-bold text-[#38BDF8] border-b border-white/10 pb-1.5">
                  {cat.name}
                </div>
                <div className="flex flex-col gap-1">
                  {cat.roles.slice(0, 7).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleSelectRoleChip(role, cat.name)}
                      className="text-left text-xs text-slate-300 hover:text-amber-400 py-1 transition-colors truncate cursor-pointer"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. REDESIGNED JOB APPLICATION FORM ("Apply for a Position") */}
      <section ref={formRef} id="apply-form" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-[#0A1020] border border-white/15 rounded-2xl p-6 sm:p-10 lg:p-12 max-w-4xl mx-auto shadow-2xl">
          <div className="space-y-2 pb-8 border-b border-white/10">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Online Candidate Application
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Apply for a Position
            </h2>
            <p className="text-sm text-slate-300">
              Complete the form below and upload your CV/Resume. Every application receives a unique tracking ID and is reviewed by our recruitment specialists.
            </p>
          </div>

          {submittedRecord ? (
            <div
              role="status"
              aria-live="polite"
              className="my-8 p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-5"
            >
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-bold text-white">
                    Application Submitted Successfully
                  </h3>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Thank you for applying with REHMAN GWS. Our team will review your application.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400">Applicant ID: </span>
                      <span className="font-mono tabular-nums font-semibold text-amber-400">
                        {submittedRecord.applicantId}
                      </span>
                    </div>
                    <span aria-hidden="true">·</span>
                    <div>
                      <span className="text-slate-400">Position: </span>
                      <span className="font-medium text-white">{submittedRecord.position}</span>
                    </div>
                    <span aria-hidden="true">·</span>
                    <div>
                      <span className="text-slate-400">Status: </span>
                      <span className="font-medium text-emerald-400">{submittedRecord.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
                <a
                  href={getWhatsAppUrl(
                    `Hello REHMAN GWS, I have submitted my job application (Applicant ID: ${submittedRecord.applicantId}) for the position of ${submittedRecord.position}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Follow Up on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSubmittedRecord(null)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-8 space-y-6">
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
                  <label htmlFor="app-fullName" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="app-fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="app-email" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Email *
                  </label>
                  <input
                    id="app-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="app-phone" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="app-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="app-country" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Country *
                  </label>
                  <input
                    id="app-country"
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Pakistan, UAE, Saudi Arabia, UK"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="app-city" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    City *
                  </label>
                  <input
                    id="app-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lahore, Dubai, Riyadh"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="app-category" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Job Category *
                  </label>
                  <select
                    id="app-category"
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
                  <label htmlFor="app-position" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Position Applying For *
                  </label>
                  <input
                    id="app-position"
                    type="text"
                    required
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g. Graphic Designer, Hotel Receptionist, Accountant"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="app-experience" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Experience *
                  </label>
                  <select
                    id="app-experience"
                    required
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#0A66FF]"
                  >
                    <option value="Entry Level / Fresh">Entry Level / Fresh</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2+ Years">2+ Years</option>
                    <option value="3+ Years">3+ Years</option>
                    <option value="5+ Years">5+ Years</option>
                    <option value="8+ Years">8+ Years</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="app-salary" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Expected Salary (Optional)
                  </label>
                  <input
                    id="app-salary"
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="e.g. $1,500 / mo or Negotiable"
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                  />
                </div>

                <div>
                  <label htmlFor="app-availability" className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Availability
                  </label>
                  <select
                    id="app-availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#0A66FF]"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="1 Week Notice">1 Week Notice</option>
                    <option value="2 Weeks Notice">2 Weeks Notice</option>
                    <option value="1 Month Notice">1 Month Notice</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="app-skills" className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Skills *
                </label>
                <input
                  id="app-skills"
                  type="text"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="List your key professional skills separated by commas"
                  className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                />
              </div>

              {/* Drag-and-Drop Style CV / Resume Upload Area */}
              <div>
                <label htmlFor="app-cv-upload" className="block text-xs font-semibold text-slate-200 mb-1.5">
                  CV / Resume Upload * <span className="text-slate-400 font-normal">(PDF, DOC, DOCX, TXT · Max 2MB)</span>
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                  }}
                  onDrop={handleDrop}
                  className={`p-6 rounded-2xl bg-[#050811] border-2 border-dashed transition-colors space-y-4 ${
                    dragActive
                      ? 'border-[#0A66FF] bg-[#0A66FF]/10'
                      : 'border-white/20 hover:border-[#0A66FF]/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#0A66FF]/15 border border-[#0A66FF]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-slate-200">
                          Drag and drop your CV file here, or browse from your device
                        </div>
                        <input
                          id="app-cv-upload"
                          type="file"
                          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                          className="block w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0A66FF] file:text-white hover:file:bg-blue-500 cursor-pointer"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateStructuredCv}
                      className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-medium text-slate-300 hover:text-white whitespace-nowrap cursor-pointer"
                    >
                      Attach Structured CV Summary
                    </button>
                  </div>

                  {cvFileName && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span>Attached: {cvFileName} (Ready for encrypted submission)</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="app-message" className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Additional Message
                </label>
                <textarea
                  id="app-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share any additional information, portfolio links, or relocation preferences..."
                  className="w-full px-4 py-3 bg-[#050811] border border-white/15 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0A66FF]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  Your CV and personal data are transmitted securely and only accessible to authorized REHMAN GWS recruitment administrators.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#0A66FF] hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-[0_0_24px_-4px_rgba(10,102,255,0.65)] transition-all whitespace-nowrap cursor-pointer"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
