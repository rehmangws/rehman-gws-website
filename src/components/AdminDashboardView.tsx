import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Eye,
  Trash2,
  Plus,
  Mail,
  MessageSquare,
  ShieldCheck,
  LogIn,
  LogOut,
  RefreshCw,
  X,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  ApplicantItem,
  StaffingRequestItem,
  JobItem,
  ContactMessageItem,
  EmailNotificationItem,
  updateApplicantRecord,
  deleteApplicantRecord,
  updateStaffingRequestStatus,
  deleteStaffingRequestRecord,
  createNewJobListing,
  updateJobStatus,
  deleteJobListing,
  updateContactMessageStatus,
  deleteContactMessageRecord,
} from '../services/dataService';
import { signInWithGoogle, signOutUser } from '../lib/firebase';
import {
  COMPANY_INFO,
  GRAPHIC_DESIGN_SERVICES,
  RECRUITMENT_CATEGORIES,
  SOCIAL_MEDIA_MANAGEMENT_SERVICES,
  SOCIAL_MEDIA_MARKETING_SERVICES,
  BUSINESS_SOLUTIONS_SERVICES,
} from '../data/catalog';
import { BrandLogo } from './BrandLogo';

interface AdminDashboardViewProps {
  currentUser: User | null;
  applicants: ApplicantItem[];
  staffingRequests: StaffingRequestItem[];
  jobs: JobItem[];
  contactMessages: ContactMessageItem[];
  emailNotifications: EmailNotificationItem[];
  configStatus: {
    notificationRecipient: string;
    resendConfigured: boolean;
    firebaseConfigured: boolean;
  };
  onRefreshData: () => Promise<void>;
  onLogout?: () => void;
}

type AdminSection =
  | 'applicants'
  | 'staffing'
  | 'jobs'
  | 'services'
  | 'messages'
  | 'settings';

const APPLICANT_STATUSES: ApplicantItem['status'][] = [
  'New',
  'Reviewed',
  'Shortlisted',
  'Contacted',
  'Interview',
  'Selected',
  'Rejected',
  'Hired',
  'Archived',
];

const STAFFING_STATUSES: StaffingRequestItem['status'][] = [
  'New',
  'Contacted',
  'In Progress',
  'Candidates Found',
  'Interview',
  'Filled',
  'Closed',
];

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  applicants,
  staffingRequests,
  jobs,
  contactMessages,
  emailNotifications,
  configStatus,
  onRefreshData,
  onLogout,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('applicants');
  const [refreshing, setRefreshing] = useState(false);

  // Applicant Filters & Pagination
  const [appSearch, setAppSearch] = useState('');
  const [appCategory, setAppCategory] = useState('ALL');
  const [appPosition, setAppPosition] = useState('');
  const [appLocation, setAppLocation] = useState('');
  const [appExperience, setAppExperience] = useState('ALL');
  const [appStatusFilter, setAppStatusFilter] = useState('ALL');
  const [appSort, setAppSort] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [appPage, setAppPage] = useState(1);
  const PAGE_SIZE = 8;

  // Selected Applicant Modal for CV View & Notes
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantItem | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Staffing Filters & Pagination
  const [staffSearch, setStaffSearch] = useState('');
  const [staffStatusFilter, setStaffStatusFilter] = useState('ALL');
  const [staffCategoryFilter, setStaffCategoryFilter] = useState('ALL');
  const [staffSort, setStaffSort] = useState<'newest' | 'oldest'>('newest');
  const [staffPage, setStaffPage] = useState(1);
  const [selectedStaffRequest, setSelectedStaffRequest] = useState<StaffingRequestItem | null>(null);

  // New Job Modal / Form
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('REHMAN GWS Client Partner');
  const [newJobCategory, setNewJobCategory] = useState('Hospitality');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobType, setNewJobType] = useState('Full-time');
  const [newJobExperience, setNewJobExperience] = useState('2+ Years');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [creatingJob, setCreatingJob] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefreshData();
    } finally {
      setRefreshing(false);
    }
  };

  // Summary Metrics
  const totalApplicants = applicants.length;
  const newApplicantsCount = applicants.filter((a) => a.status === 'New').length;
  const shortlistedApplicantsCount = applicants.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Hired'
  ).length;
  const totalStaffingRequests = staffingRequests.length;
  const newStaffingRequestsCount = staffingRequests.filter((r) => r.status === 'New').length;
  const totalJobsCount = jobs.length;
  const totalContactMessagesCount = contactMessages.length;

  // Filtered & Sorted Applicants
  const filteredApplicants = useMemo(() => {
    return applicants
      .filter((a) => {
        const q = appSearch.trim().toLowerCase();
        const matchesSearch =
          !q ||
          a.fullName.toLowerCase().includes(q) ||
          a.applicantId.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.phone.toLowerCase().includes(q) ||
          a.skills.toLowerCase().includes(q);
        const matchesCategory = appCategory === 'ALL' || a.category === appCategory;
        const matchesPos =
          !appPosition.trim() ||
          a.position.toLowerCase().includes(appPosition.trim().toLowerCase());
        const matchesLoc =
          !appLocation.trim() ||
          `${a.city} ${a.country}`.toLowerCase().includes(appLocation.trim().toLowerCase());
        const matchesExp =
          appExperience === 'ALL' ||
          a.experience.toLowerCase().includes(appExperience.toLowerCase());
        const matchesStatus = appStatusFilter === 'ALL' || a.status === appStatusFilter;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesPos &&
          matchesLoc &&
          matchesExp &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        if (appSort === 'name') return a.fullName.localeCompare(b.fullName);
        if (appSort === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    applicants,
    appSearch,
    appCategory,
    appPosition,
    appLocation,
    appExperience,
    appStatusFilter,
    appSort,
  ]);

  const totalAppPages = Math.max(1, Math.ceil(filteredApplicants.length / PAGE_SIZE));
  const paginatedApplicants = filteredApplicants.slice(
    (appPage - 1) * PAGE_SIZE,
    appPage * PAGE_SIZE
  );

  // Filtered & Sorted Staffing Requests
  const filteredStaffRequests = useMemo(() => {
    return staffingRequests
      .filter((r) => {
        const q = staffSearch.trim().toLowerCase();
        const matchesSearch =
          !q ||
          r.businessName.toLowerCase().includes(q) ||
          r.requestId.toLowerCase().includes(q) ||
          r.contactPerson.toLowerCase().includes(q) ||
          r.position.toLowerCase().includes(q) ||
          `${r.city} ${r.country}`.toLowerCase().includes(q);
        const matchesStatus = staffStatusFilter === 'ALL' || r.status === staffStatusFilter;
        const matchesCat = staffCategoryFilter === 'ALL' || r.category === staffCategoryFilter;
        return matchesSearch && matchesStatus && matchesCat;
      })
      .sort((a, b) => {
        if (staffSort === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [staffingRequests, staffSearch, staffStatusFilter, staffCategoryFilter, staffSort]);

  const totalStaffPages = Math.max(1, Math.ceil(filteredStaffRequests.length / PAGE_SIZE));
  const paginatedStaffRequests = filteredStaffRequests.slice(
    (staffPage - 1) * PAGE_SIZE,
    staffPage * PAGE_SIZE
  );

  const handleApplicantStatusChange = async (
    applicantId: string,
    status: ApplicantItem['status']
  ) => {
    await updateApplicantRecord(applicantId, { status });
    await onRefreshData();
  };

  const handleSaveApplicantNotes = async () => {
    if (!selectedApplicant) return;
    setSavingNotes(true);
    try {
      const updated = await updateApplicantRecord(selectedApplicant.applicantId, {
        notes: notesDraft,
      });
      setSelectedApplicant(updated);
      await onRefreshData();
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteApplicant = async (applicantId: string) => {
    await deleteApplicantRecord(applicantId);
    if (selectedApplicant?.applicantId === applicantId) {
      setSelectedApplicant(null);
    }
    await onRefreshData();
  };

  const handleStaffStatusChange = async (
    requestId: string,
    status: StaffingRequestItem['status']
  ) => {
    await updateStaffingRequestStatus(requestId, status);
    await onRefreshData();
  };

  const handleDeleteStaffRequest = async (requestId: string) => {
    await deleteStaffingRequestRecord(requestId);
    if (selectedStaffRequest?.requestId === requestId) {
      setSelectedStaffRequest(null);
    }
    await onRefreshData();
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobLocation.trim() || !newJobDescription.trim()) return;
    setCreatingJob(true);
    try {
      await createNewJobListing({
        title: newJobTitle,
        company: newJobCompany,
        category: newJobCategory,
        location: newJobLocation,
        employmentType: newJobType,
        experience: newJobExperience,
        salary: newJobSalary,
        description: newJobDescription,
      });
      setNewJobTitle('');
      setNewJobLocation('');
      setNewJobSalary('');
      setNewJobDescription('');
      await onRefreshData();
    } finally {
      setCreatingJob(false);
    }
  };

  const cleanPhoneForWhatsApp = (phoneStr: string) => {
    return phoneStr.replace(/[^0-9]/g, '') || COMPANY_INFO.whatsappRaw;
  };

  return (
    <div className="bg-brand-canvas bg-subtle-grid min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Top Bar: Original Logo, Title, Auth Status & Refresh */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <BrandLogo size="card" showText={false} showUploadHelper={true} />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>REHMAN GWS · Executive Administration Console</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                Admin Dashboard
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0A1020] hover:bg-white/10 border border-white/15 rounded-xl text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Sync Data</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#0A1020] border border-white/15 rounded-xl px-3 py-1.5">
                <span className="text-xs text-slate-300 truncate max-w-[180px]">
                  {currentUser.email}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await signOutUser();
                    if (onLogout) onLogout();
                  }}
                  className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-1 ml-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66FF] hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-[0_0_20px_-4px_rgba(10,102,255,0.6)] transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in with Google ({COMPANY_INFO.adminEmail})</span>
              </button>
            )}
          </div>
        </div>

        {/* 7 Summary KPI Cards (Strictly Tabular Numerals, Single-Elevation Depth) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
          <div className="p-4 rounded-xl bg-[#0A1020] border border-white/12">
            <div className="text-xs text-slate-400">Total Job Applications</div>
            <div className="font-mono tabular-nums text-2xl font-bold text-white mt-1">
              {totalApplicants}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A1020] border border-white/12">
            <div className="text-xs text-slate-400">New Applications</div>
            <div className="font-mono tabular-nums text-2xl font-bold text-[#38BDF8] mt-1">
              {newApplicantsCount}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A1020] border border-white/12">
            <div className="text-xs text-slate-400">Shortlisted / Hired</div>
            <div className="font-mono tabular-nums text-2xl font-bold text-emerald-400 mt-1">
              {shortlistedApplicantsCount}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A1020] border border-white/12">
            <div className="text-xs text-slate-400">Total Staffing Requests</div>
            <div className="font-mono tabular-nums text-2xl font-bold text-white mt-1">
              {totalStaffingRequests}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A1020] border border-white/12">
            <div className="text-xs text-slate-400">New Requests</div>
            <div className="font-mono tabular-nums text-2xl font-bold text-amber-400 mt-1">
              {newStaffingRequestsCount}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A1020] border border-white/12">
            <div className="text-xs text-slate-400">Total Jobs</div>
            <div className="font-mono tabular-nums text-2xl font-bold text-emerald-400 mt-1">
              {totalJobsCount}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0A1020] border border-white/12">
            <div className="text-xs text-slate-400">Total Contact Messages</div>
            <div className="font-mono tabular-nums text-2xl font-bold text-[#38BDF8] mt-1">
              {totalContactMessagesCount}
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#0A1020] border border-white/12 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveSection('applicants')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'applicants'
                ? 'bg-[#0A66FF] text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Applicants ({applicants.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('staffing')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'staffing'
                ? 'bg-[#0A66FF] text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Staffing Requests ({staffingRequests.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('jobs')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'jobs'
                ? 'bg-[#0A66FF] text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Jobs ({jobs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('services')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'services'
                ? 'bg-[#0A66FF] text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('messages')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'messages'
                ? 'bg-[#0A66FF] text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Messages & Email Logs ({contactMessages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('settings')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'settings'
                ? 'bg-[#0A66FF] text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Settings
          </button>
        </div>

      {/* SECTION 1: APPLICANTS TABLE & FILTERS */}
      {activeSection === 'applicants' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-2">
              <label htmlFor="admin-app-search" className="block text-xs text-slate-400 mb-1">
                Search Applicants
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-app-search"
                  type="text"
                  value={appSearch}
                  onChange={(e) => {
                    setAppSearch(e.target.value);
                    setAppPage(1);
                  }}
                  placeholder="ID, Name, Email, Phone, Skills..."
                  className="w-full pl-8 pr-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-app-cat" className="block text-xs text-slate-400 mb-1">
                Category
              </label>
              <select
                id="admin-app-cat"
                value={appCategory}
                onChange={(e) => {
                  setAppCategory(e.target.value);
                  setAppPage(1);
                }}
                className="w-full px-2.5 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-xs text-white"
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
              <label htmlFor="admin-app-pos" className="block text-xs text-slate-400 mb-1">
                Position
              </label>
              <input
                id="admin-app-pos"
                type="text"
                value={appPosition}
                onChange={(e) => {
                  setAppPosition(e.target.value);
                  setAppPage(1);
                }}
                placeholder="Filter position..."
                className="w-full px-2.5 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label htmlFor="admin-app-loc" className="block text-xs text-slate-400 mb-1">
                Location
              </label>
              <input
                id="admin-app-loc"
                type="text"
                value={appLocation}
                onChange={(e) => {
                  setAppLocation(e.target.value);
                  setAppPage(1);
                }}
                placeholder="City or Country..."
                className="w-full px-2.5 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-xs text-white"
              />
            </div>

            <div>
              <label htmlFor="admin-app-status" className="block text-xs text-slate-400 mb-1">
                Status / Sort
              </label>
              <div className="flex gap-1.5">
                <select
                  id="admin-app-status"
                  value={appStatusFilter}
                  onChange={(e) => {
                    setAppStatusFilter(e.target.value);
                    setAppPage(1);
                  }}
                  className="w-full px-2 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-xs text-white"
                >
                  <option value="ALL">All Statuses</option>
                  {APPLICANT_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Sort applicants"
                  value={appSort}
                  onChange={(e) => setAppSort(e.target.value as 'newest' | 'oldest' | 'name')}
                  className="px-2 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-xs text-white"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Responsive Desktop Table & Mobile Cards */}
          <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0B0F19] text-[11px] font-semibold text-slate-400">
                    <th className="py-3.5 px-4">Applicant ID</th>
                    <th className="py-3.5 px-4">Name & Contact</th>
                    <th className="py-3.5 px-4">Position & Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">CV</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {paginatedApplicants.map((app) => (
                    <tr key={app.applicantId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-amber-400 whitespace-nowrap">
                        {app.applicantId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{app.fullName}</div>
                        <div className="text-slate-400 text-[11px]">
                          {app.email} · {app.phone}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{app.position}</div>
                        <div className="text-slate-400 text-[11px]">
                          {app.category} · {app.experience}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {app.city}, {app.country}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400 whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          aria-label={`Change status for ${app.fullName}`}
                          value={app.status}
                          onChange={(e) =>
                            handleApplicantStatusChange(
                              app.applicantId,
                              e.target.value as ApplicantItem['status']
                            )
                          }
                          className="px-2.5 py-1.5 bg-[#0B0F19] border border-white/15 rounded-md text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          {APPLICANT_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedApplicant(app);
                              setNotesDraft(app.notes || '');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded text-[11px] font-medium cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View CV</span>
                          </button>
                          <a
                            href={app.cvUrl}
                            download={app.cvFileName || `${app.applicantId}_CV.txt`}
                            aria-label={`Download CV for ${app.fullName}`}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-[11px]"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={`https://wa.me/${cleanPhoneForWhatsApp(app.phone)}?text=${encodeURIComponent(
                              `Hello ${app.fullName}, regarding your application (${app.applicantId}) with REHMAN GWS for ${app.position}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`WhatsApp ${app.fullName}`}
                            className="p-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`mailto:${app.email}?subject=${encodeURIComponent(
                              `REHMAN GWS Application Update (${app.applicantId})`
                            )}`}
                            aria-label={`Email ${app.fullName}`}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteApplicant(app.applicantId)}
                            aria-label={`Delete applicant ${app.fullName}`}
                            className="p-1.5 rounded bg-red-600/15 hover:bg-red-600/30 text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedApplicants.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No applicants found matching the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="px-4 py-3 bg-[#0B0F19] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>
                Showing <span className="font-mono tabular-nums text-white">{paginatedApplicants.length}</span> of{' '}
                <span className="font-mono tabular-nums text-white">{filteredApplicants.length}</span> applicants
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={appPage <= 1}
                  onClick={() => setAppPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded text-white cursor-pointer"
                >
                  Previous
                </button>
                <span className="font-mono tabular-nums">
                  Page {appPage} / {totalAppPages}
                </span>
                <button
                  type="button"
                  disabled={appPage >= totalAppPages}
                  onClick={() => setAppPage((p) => Math.min(totalAppPages, p + 1))}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded text-white cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: STAFFING REQUESTS TABLE */}
      {activeSection === 'staffing' && (
        <div className="space-y-6">
          <div className="bg-[#111827] border border-white/10 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label htmlFor="admin-staff-search" className="block text-xs text-slate-400 mb-1">
                Search Staffing Requests
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-staff-search"
                  type="text"
                  value={staffSearch}
                  onChange={(e) => {
                    setStaffSearch(e.target.value);
                    setStaffPage(1);
                  }}
                  placeholder="Request ID, Business, Position..."
                  className="w-full pl-8 pr-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-staff-cat" className="block text-xs text-slate-400 mb-1">
                Category
              </label>
              <select
                id="admin-staff-cat"
                value={staffCategoryFilter}
                onChange={(e) => {
                  setStaffCategoryFilter(e.target.value);
                  setStaffPage(1);
                }}
                className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-xs text-white"
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
              <label htmlFor="admin-staff-status" className="block text-xs text-slate-400 mb-1">
                Status
              </label>
              <select
                id="admin-staff-status"
                value={staffStatusFilter}
                onChange={(e) => {
                  setStaffStatusFilter(e.target.value);
                  setStaffPage(1);
                }}
                className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-xs text-white"
              >
                <option value="ALL">All Statuses</option>
                {STAFFING_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="admin-staff-sort" className="block text-xs text-slate-400 mb-1">
                Sort Order
              </label>
              <select
                id="admin-staff-sort"
                value={staffSort}
                onChange={(e) => setStaffSort(e.target.value as 'newest' | 'oldest')}
                className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-xs text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0B0F19] text-[11px] font-semibold text-slate-400">
                    <th className="py-3.5 px-4">Request ID</th>
                    <th className="py-3.5 px-4">Business & Contact</th>
                    <th className="py-3.5 px-4">Position & Category</th>
                    <th className="py-3.5 px-4 text-right">Qty</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {paginatedStaffRequests.map((req) => (
                    <tr key={req.requestId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-amber-400 whitespace-nowrap">
                        {req.requestId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{req.businessName}</div>
                        <div className="text-slate-400 text-[11px]">
                          {req.contactPerson} · {req.businessType}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{req.position}</div>
                        <div className="text-slate-400 text-[11px]">
                          {req.category} · {req.employmentType}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-white">
                        {req.numberRequired}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {req.city}, {req.country}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400 whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          aria-label={`Change status for ${req.businessName}`}
                          value={req.status}
                          onChange={(e) =>
                            handleStaffStatusChange(
                              req.requestId,
                              e.target.value as StaffingRequestItem['status']
                            )
                          }
                          className="px-2.5 py-1.5 bg-[#0B0F19] border border-white/15 rounded-md text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          {STAFFING_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedStaffRequest(req)}
                            className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded text-[11px] font-medium cursor-pointer"
                          >
                            Details
                          </button>
                          <a
                            href={`https://wa.me/${cleanPhoneForWhatsApp(req.phone)}?text=${encodeURIComponent(
                              `Hello ${req.contactPerson}, regarding your Staffing Request (${req.requestId}) for ${req.businessName} with REHMAN GWS.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`WhatsApp ${req.businessName}`}
                            className="p-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteStaffRequest(req.requestId)}
                            aria-label={`Delete request ${req.requestId}`}
                            className="p-1.5 rounded bg-red-600/15 hover:bg-red-600/30 text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedStaffRequests.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No staffing requests match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 bg-[#0B0F19] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>
                Showing <span className="font-mono tabular-nums text-white">{paginatedStaffRequests.length}</span> of{' '}
                <span className="font-mono tabular-nums text-white">{filteredStaffRequests.length}</span> requests
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={staffPage <= 1}
                  onClick={() => setStaffPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded text-white cursor-pointer"
                >
                  Previous
                </button>
                <span className="font-mono tabular-nums">
                  Page {staffPage} / {totalStaffPages}
                </span>
                <button
                  type="button"
                  disabled={staffPage >= totalStaffPages}
                  onClick={() => setStaffPage((p) => Math.min(totalStaffPages, p + 1))}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-40 rounded text-white cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: JOBS MANAGEMENT */}
      {activeSection === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-[#111827] border border-white/10 rounded-xl p-6 space-y-4 h-fit">
            <div className="flex items-center gap-2 text-white font-display font-bold text-lg">
              <Plus className="w-5 h-5 text-blue-400" />
              <span>Publish New Job Opportunity</span>
            </div>
            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="new-job-title" className="block text-slate-300 mb-1">
                  Job Title *
                </label>
                <input
                  id="new-job-title"
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Senior Graphic Designer"
                  className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-job-company" className="block text-slate-300 mb-1">
                    Company / Division
                  </label>
                  <input
                    id="new-job-company"
                    type="text"
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label htmlFor="new-job-cat" className="block text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    id="new-job-cat"
                    value={newJobCategory}
                    onChange={(e) => setNewJobCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-white"
                  >
                    <option value="Hospitality">Hospitality</option>
                    <option value="Office & Administration">Office & Administration</option>
                    <option value="IT & Digital">IT & Digital</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="General Workforce">General Workforce</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-job-loc" className="block text-slate-300 mb-1">
                    Location *
                  </label>
                  <input
                    id="new-job-loc"
                    type="text"
                    required
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    placeholder="e.g. Dubai, UAE"
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label htmlFor="new-job-type" className="block text-slate-300 mb-1">
                    Employment Type
                  </label>
                  <select
                    id="new-job-type"
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="new-job-exp" className="block text-slate-300 mb-1">
                    Experience
                  </label>
                  <input
                    id="new-job-exp"
                    type="text"
                    value={newJobExperience}
                    onChange={(e) => setNewJobExperience(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label htmlFor="new-job-sal" className="block text-slate-300 mb-1">
                    Salary Range
                  </label>
                  <input
                    id="new-job-sal"
                    type="text"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    placeholder="e.g. $1,800 / mo"
                    className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="new-job-desc" className="block text-slate-300 mb-1">
                  Short Description *
                </label>
                <textarea
                  id="new-job-desc"
                  rows={3}
                  required
                  value={newJobDescription}
                  onChange={(e) => setNewJobDescription(e.target.value)}
                  placeholder="Describe role responsibilities and requirements..."
                  className="w-full px-3 py-2 bg-[#0B0F19] border border-white/15 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                disabled={creatingJob}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {creatingJob ? 'Publishing...' : 'Publish Job Listing'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="p-5 rounded-xl bg-[#111827] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono tabular-nums text-amber-400">{job.jobId}</span>
                    <span>·</span>
                    <span>{job.category}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white">{job.title}</h3>
                  <div className="text-xs text-slate-400">
                    {job.company} · {job.employmentType} · {job.experience}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={async () => {
                      await updateJobStatus(
                        job.jobId,
                        job.status === 'Open' ? 'Closed' : 'Open'
                      );
                      await onRefreshData();
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                      job.status === 'Open'
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-700/40 text-slate-300 border border-white/10'
                    }`}
                  >
                    {job.status} (Toggle)
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteJobListing(job.jobId);
                      await onRefreshData();
                    }}
                    aria-label={`Delete job ${job.title}`}
                    className="p-2 rounded bg-red-600/15 hover:bg-red-600/30 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: SERVICES CATALOG OVERVIEW */}
      {activeSection === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#111827] border border-white/10 space-y-2">
            <div className="font-mono tabular-nums text-2xl font-bold text-white">
              {GRAPHIC_DESIGN_SERVICES.length}
            </div>
            <h3 className="font-display text-lg font-bold text-white">Graphic Design Services</h3>
            <p className="text-xs text-slate-400">
              Active categories covering Logo Design, Brand Identity, Corporate Profiles, Packaging, Print & UI Graphics.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#111827] border border-white/10 space-y-2">
            <div className="font-mono tabular-nums text-2xl font-bold text-blue-400">
              {RECRUITMENT_CATEGORIES.reduce((acc, c) => acc + c.roles.length, 0)}
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Recruitment & Staffing Roles
            </h3>
            <p className="text-xs text-slate-400">
              Across Hospitality, Office & Administration, IT & Digital, Sales & Marketing, and General Workforce.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#111827] border border-white/10 space-y-2">
            <div className="font-mono tabular-nums text-2xl font-bold text-amber-400">
              {SOCIAL_MEDIA_MANAGEMENT_SERVICES.length +
                SOCIAL_MEDIA_MARKETING_SERVICES.length +
                BUSINESS_SOLUTIONS_SERVICES.length}
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Digital & Business Solutions
            </h3>
            <p className="text-xs text-slate-400">
              Social Media Management ({SOCIAL_MEDIA_MANAGEMENT_SERVICES.length}), Social Media Marketing ({SOCIAL_MEDIA_MARKETING_SERVICES.length}), and Business Solutions ({BUSINESS_SOLUTIONS_SERVICES.length}).
            </p>
          </div>
        </div>
      )}

      {/* SECTION 5: CONTACT MESSAGES & EMAIL NOTIFICATION OUTBOX */}
      {activeSection === 'messages' && (
        <div className="space-y-10">
          {/* Contact Enquiries */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-white">
              Direct Contact Enquiries ({contactMessages.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactMessages.map((msg) => (
                <div
                  key={msg.messageId}
                  className="p-5 rounded-xl bg-[#111827] border border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono tabular-nums text-amber-400">{msg.messageId}</span>
                      <span className="font-mono tabular-nums">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold text-white">
                      {msg.name} {msg.company ? `· ${msg.company}` : ''}
                    </h3>
                    <div className="text-xs text-blue-400 font-medium">{msg.serviceRequired}</div>
                    <div className="text-xs text-slate-400">
                      {msg.email} {msg.phone ? `· ${msg.phone}` : ''}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed pt-1">{msg.message}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <select
                      aria-label={`Change status for message ${msg.messageId}`}
                      value={msg.status}
                      onChange={async (e) => {
                        await updateContactMessageStatus(
                          msg.messageId,
                          e.target.value as ContactMessageItem['status']
                        );
                        await onRefreshData();
                      }}
                      className="px-2.5 py-1 bg-[#0B0F19] border border-white/15 rounded text-xs text-white"
                    >
                      <option value="New">New</option>
                      <option value="Replied">Replied</option>
                      <option value="Archived">Archived</option>
                    </select>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(
                          `REHMAN GWS – Regarding ${msg.serviceRequired}`
                        )}`}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-slate-200"
                      >
                        Reply Email
                      </a>
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteContactMessageRecord(msg.messageId);
                          await onRefreshData();
                        }}
                        aria-label={`Delete message ${msg.messageId}`}
                        className="p-1.5 rounded bg-red-600/15 hover:bg-red-600/30 text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatched Email Notifications Log (Section 18 verification) */}
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                Email Notifications Dispatched ({emailNotifications.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every job application, staffing request, and business enquiry dispatches an automated notification to{' '}
                <span className="text-white font-mono">{configStatus.notificationRecipient}</span>.
              </p>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-xl divide-y divide-white/10">
              {emailNotifications.map((notif) => (
                <div key={notif.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-white">{notif.subject}</span>
                      <span className="font-mono tabular-nums text-amber-400">
                        · {notif.referenceId}
                      </span>
                    </div>
                    <p className="text-slate-300 pl-5">{notif.summary}</p>
                    <div className="text-[11px] text-slate-500 pl-5">
                      To: {notif.to} · {notif.deliveryMethod}
                    </div>
                  </div>
                  <div className="font-mono tabular-nums text-slate-400 shrink-0 pl-5 sm:pl-0">
                    {new Date(notif.sentAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: SETTINGS & ENVIRONMENT SETUP */}
      {activeSection === 'settings' && (
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 max-w-3xl">
          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold text-white">
              Backend, Security & Notification Configuration
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              REHMAN GWS uses a dual-layer persistent architecture combining Firebase Authentication & Firestore with an Express API server for sequential reference ID assignment and email notification routing.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-white/10 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Firebase Firestore & Auth</div>
                <div className="text-slate-400 mt-0.5">
                  Configured via firebase-applet-config.json with zero-trust firestore.rules
                </div>
              </div>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-white/10 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Notification Recipient Email</div>
                <div className="text-slate-400 mt-0.5 font-mono">
                  {configStatus.notificationRecipient}
                </div>
              </div>
              <span className="text-emerald-400 font-semibold">Configured</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white">External SMTP / Resend Relay (Optional)</div>
                <span className="text-amber-400 font-medium">
                  {configStatus.resendConfigured ? 'Resend API Active' : 'Server Outbox Active'}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                To enable external email relay in production alongside the built-in Admin Notification Outbox, add{' '}
                <code className="text-slate-200 font-mono">RESEND_API_KEY</code> and{' '}
                <code className="text-slate-200 font-mono">NOTIFICATION_EMAIL="rehmanglobal.contact@gmail.com"</code>{' '}
                in your environment secrets. Never hard-code secret API keys in frontend files.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW APPLICANT CV & EDIT NOTES */}
      {selectedApplicant && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-applicant-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[#111827] border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="font-mono tabular-nums text-xs text-amber-400">
                  {selectedApplicant.applicantId} · {selectedApplicant.status}
                </div>
                <h2 id="modal-applicant-title" className="font-display text-xl font-bold text-white mt-0.5">
                  {selectedApplicant.fullName}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  Applying for: <span className="text-white">{selectedApplicant.position}</span> ({selectedApplicant.category})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                aria-label="Close applicant modal"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-white/10 space-y-1">
                <div className="text-slate-500">Email & Phone</div>
                <div className="text-white font-medium">{selectedApplicant.email}</div>
                <div className="text-slate-300 font-mono">{selectedApplicant.phone}</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-white/10 space-y-1">
                <div className="text-slate-500">Location & Availability</div>
                <div className="text-white font-medium">
                  {selectedApplicant.city}, {selectedApplicant.country}
                </div>
                <div className="text-slate-300">
                  {selectedApplicant.experience} · {selectedApplicant.availability}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="text-slate-400 font-medium">Candidate Skills</div>
              <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-white/10 text-slate-200">
                {selectedApplicant.skills}
              </div>
            </div>

            {selectedApplicant.message && (
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-400 font-medium">Cover Message</div>
                <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-white/10 text-slate-300">
                  {selectedApplicant.message}
                </div>
              </div>
            )}

            {/* CV File Attachment Preview & Download */}
            <div className="p-4 rounded-xl bg-[#0B0F19] border border-blue-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white">
                    {selectedApplicant.cvFileName || 'Candidate_CV.pdf'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Encrypted Applicant CV Document
                  </div>
                </div>
              </div>
              <a
                href={selectedApplicant.cvUrl}
                download={selectedApplicant.cvFileName || `${selectedApplicant.applicantId}_CV.txt`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CV</span>
              </a>
            </div>

            {/* Admin Notes */}
            <div className="space-y-2 text-xs">
              <label htmlFor="applicant-notes-input" className="block text-slate-300 font-medium">
                Internal Recruitment Notes
              </label>
              <textarea
                id="applicant-notes-input"
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Add interview feedback, salary expectations, or screening notes..."
                className="w-full px-3.5 py-2.5 bg-[#0B0F19] border border-white/15 rounded-lg text-white"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={savingNotes}
                  onClick={handleSaveApplicantNotes}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg cursor-pointer"
                >
                  {savingNotes ? 'Saving Notes...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW STAFFING REQUEST DETAILS */}
      {selectedStaffRequest && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-staff-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[#111827] border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="font-mono tabular-nums text-xs text-amber-400">
                  {selectedStaffRequest.requestId} · {selectedStaffRequest.status}
                </div>
                <h2 id="modal-staff-title" className="font-display text-xl font-bold text-white mt-0.5">
                  {selectedStaffRequest.businessName}
                </h2>
                <div className="text-xs text-slate-400">
                  {selectedStaffRequest.businessType} · {selectedStaffRequest.city}, {selectedStaffRequest.country}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStaffRequest(null)}
                aria-label="Close staffing request modal"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-white/10 space-y-1">
                <div className="text-slate-500">Primary Contact</div>
                <div className="text-white font-semibold">{selectedStaffRequest.contactPerson}</div>
                <div className="text-slate-300">{selectedStaffRequest.email}</div>
                <div className="text-slate-300 font-mono">{selectedStaffRequest.phone}</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-white/10 space-y-1">
                <div className="text-slate-500">Workforce Requirement</div>
                <div className="text-white font-semibold">
                  {selectedStaffRequest.numberRequired} × {selectedStaffRequest.position}
                </div>
                <div className="text-slate-300">
                  {selectedStaffRequest.category} · {selectedStaffRequest.employmentType}
                </div>
                <div className="text-amber-400 font-mono">
                  Budget: {selectedStaffRequest.salaryBudget || 'Standard Market Rate'}
                </div>
              </div>
            </div>

            {selectedStaffRequest.requiredSkills && (
              <div className="text-xs space-y-1">
                <div className="text-slate-400 font-medium">Required Skills</div>
                <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-white/10 text-slate-200">
                  {selectedStaffRequest.requiredSkills}
                </div>
              </div>
            )}

            {selectedStaffRequest.jobDescription && (
              <div className="text-xs space-y-1">
                <div className="text-slate-400 font-medium">Job Description</div>
                <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-white/10 text-slate-200">
                  {selectedStaffRequest.jobDescription}
                </div>
              </div>
            )}

            {selectedStaffRequest.additionalRequirements && (
              <div className="text-xs space-y-1">
                <div className="text-slate-400 font-medium">Additional Requirements</div>
                <div className="p-3.5 rounded-lg bg-[#0B0F19] border border-white/10 text-slate-200">
                  {selectedStaffRequest.additionalRequirements}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
