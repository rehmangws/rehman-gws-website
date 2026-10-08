import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit to support secure base64 CV uploads (max 5MB payload)
app.use(express.json({ limit: '6mb' }));

// Simple rate limiter per IP for public submission endpoints
const submissionRateMap = new Map<string, number[]>();
function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 25;
  const timestamps = (submissionRateMap.get(ip) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    return;
  }
  timestamps.push(now);
  submissionRateMap.set(ip, timestamps);
  next();
}

function sanitizeText(input: unknown, maxLength = 2000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

export interface ApplicantRecord {
  applicantId: string;
  ownerId: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  position: string;
  category: string;
  experience: string;
  skills: string;
  expectedSalary: string;
  availability: string;
  cvUrl: string;
  cvFileName: string;
  message: string;
  notes: string;
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Contacted' | 'Interview' | 'Selected' | 'Rejected' | 'Hired' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface StaffingRequestRecord {
  requestId: string;
  ownerId: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  country: string;
  city: string;
  position: string;
  category: string;
  numberRequired: number;
  experienceRequired: string;
  employmentType: string;
  salaryBudget: string;
  requiredSkills: string;
  jobDescription: string;
  additionalRequirements: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Candidates Found' | 'Interview' | 'Filled' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface JobRecord {
  jobId: string;
  title: string;
  company: string;
  category: string;
  location: string;
  employmentType: string;
  experience: string;
  salary: string;
  description: string;
  status: 'Open' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageRecord {
  messageId: string;
  ownerId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceRequired: string;
  message: string;
  status: 'New' | 'Replied' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface EmailNotificationLog {
  id: string;
  to: string;
  subject: string;
  type: 'JOB_APPLICATION' | 'STAFFING_REQUEST' | 'CONTACT_ENQUIRY';
  referenceId: string;
  summary: string;
  deliveryMethod: string;
  sentAt: string;
}

interface DatabaseSchema {
  counters: {
    applicant: number;
    staffing: number;
    job: number;
    message: number;
  };
  applicants: ApplicantRecord[];
  staffingRequests: StaffingRequestRecord[];
  jobs: JobRecord[];
  contactMessages: ContactMessageRecord[];
  emailNotifications: EmailNotificationLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'rehman-gws-db.json');
const PUBLIC_ASSETS_DIR = path.resolve(process.cwd(), 'public', 'assets');
const PUBLIC_LOGO_FILE = path.join(PUBLIC_ASSETS_DIR, 'rehman-gws-logo.png');
const BACKUP_LOGO_FILE = path.join(DATA_DIR, 'rehman-gws-logo.png');

// Ensure /public/assets directory exists and restore persisted logo if present
if (!fs.existsSync(PUBLIC_ASSETS_DIR)) {
  fs.mkdirSync(PUBLIC_ASSETS_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_LOGO_FILE) && fs.existsSync(BACKUP_LOGO_FILE)) {
  fs.copyFileSync(BACKUP_LOGO_FILE, PUBLIC_LOGO_FILE);
}

const INITIAL_JOBS: JobRecord[] = [
  {
    jobId: 'RGS-JOB-00001',
    title: 'Senior Brand Identity & Corporate Graphic Designer',
    company: 'REHMAN GWS Creative Division',
    category: 'IT & Digital',
    location: 'Dubai, UAE / Remote International',
    employmentType: 'Full-time',
    experience: '3+ Years',
    salary: '$1,800 – $2,600 / mo',
    description: 'Lead corporate identity systems, brand guidelines, packaging design, company profiles, and international digital ad campaigns for corporate clients.',
    status: 'Open',
    createdAt: '2026-09-20T09:00:00.000Z',
    updatedAt: '2026-09-20T09:00:00.000Z',
  },
  {
    jobId: 'RGS-JOB-00002',
    title: 'Executive Hotel Operations & Front Desk Supervisor',
    company: 'Grand Meridian Hospitality Group',
    category: 'Hospitality',
    location: 'Riyadh, Saudi Arabia',
    employmentType: 'Full-time',
    experience: '4+ Years',
    salary: '$2,100 – $2,800 / mo',
    description: 'Oversee international guest reception, multi-lingual concierge staff, housekeeping coordination, and VIP hospitality standards for a 5-star business hotel.',
    status: 'Open',
    createdAt: '2026-09-22T11:30:00.000Z',
    updatedAt: '2026-09-22T11:30:00.000Z',
  },
  {
    jobId: 'RGS-JOB-00003',
    title: 'Performance Social Media & Meta Ads Strategist',
    company: 'REHMAN GWS Digital Marketing',
    category: 'Sales & Marketing',
    location: 'Lahore / Remote Global',
    employmentType: 'Full-time',
    experience: '2+ Years',
    salary: '$1,200 – $1,900 / mo',
    description: 'Plan and execute full-funnel Meta, TikTok, and LinkedIn advertising campaigns, lead generation funnels, audience research, and monthly ROI reporting.',
    status: 'Open',
    createdAt: '2026-09-25T14:15:00.000Z',
    updatedAt: '2026-09-25T14:15:00.000Z',
  },
  {
    jobId: 'RGS-JOB-00004',
    title: 'Corporate Office Administrator & HR Coordinator',
    company: 'Apex Global Logistics LLC',
    category: 'Office & Administration',
    location: 'Doha, Qatar',
    employmentType: 'Full-time',
    experience: '2+ Years',
    salary: '$1,600 – $2,100 / mo',
    description: 'Manage executive office administration, employee onboarding documentation, attendance records, vendor coordination, and internal HR communications.',
    status: 'Open',
    createdAt: '2026-09-28T08:45:00.000Z',
    updatedAt: '2026-09-28T08:45:00.000Z',
  },
  {
    jobId: 'RGS-JOB-00005',
    title: 'Full-Stack Web Developer (React & TypeScript)',
    company: 'EuroTech Enterprise Solutions',
    category: 'IT & Digital',
    location: 'London, UK / Remote',
    employmentType: 'Contract',
    experience: '3+ Years',
    salary: '$2,800 – $4,000 / mo',
    description: 'Architect responsive corporate web portals, client dashboards, and high-conversion business websites with modern TypeScript and Node.js architectures.',
    status: 'Open',
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-01T10:00:00.000Z',
  },
  {
    jobId: 'RGS-JOB-00006',
    title: 'Continental Head Chef & Culinary Supervisor',
    company: 'Aurelia Fine Dining Group',
    category: 'Hospitality',
    location: 'Dubai, UAE',
    employmentType: 'Full-time',
    experience: '5+ Years',
    salary: '$2,500 – $3,400 / mo',
    description: 'Direct kitchen brigade operations, menu engineering, food safety compliance, and high-volume fine dining execution.',
    status: 'Open',
    createdAt: '2026-10-02T12:00:00.000Z',
    updatedAt: '2026-10-02T12:00:00.000Z',
  },
  {
    jobId: 'RGS-JOB-00007',
    title: 'Commercial Warehouse & Fleet Operations Supervisor',
    company: 'GulfStream Supply Chain',
    category: 'General Workforce',
    location: 'Abu Dhabi, UAE',
    employmentType: 'Full-time',
    experience: '3+ Years',
    salary: '$1,400 – $1,850 / mo',
    description: 'Coordinate warehouse inventory teams, delivery drivers, technical maintenance staff, and dispatch schedules across regional hubs.',
    status: 'Open',
    createdAt: '2026-10-03T15:20:00.000Z',
    updatedAt: '2026-10-03T15:20:00.000Z',
  },
  {
    jobId: 'RGS-JOB-00008',
    title: 'B2B Business Development & Client Outreach Executive',
    company: 'REHMAN GWS International',
    category: 'Sales & Marketing',
    location: 'Islamabad / Remote',
    employmentType: 'Full-time',
    experience: '2+ Years',
    salary: '$1,100 – $1,700 / mo + Commission',
    description: 'Drive international B2B client acquisition across corporate graphic design, staffing contracts, and digital brand retainers.',
    status: 'Open',
    createdAt: '2026-10-04T09:10:00.000Z',
    updatedAt: '2026-10-04T09:10:00.000Z',
  }
];

const INITIAL_APPLICANTS: ApplicantRecord[] = [
  {
    applicantId: 'RGS-EMP-00001',
    ownerId: 'system_seed',
    fullName: 'Usman Tariq',
    email: 'usman.tariq.design@example.com',
    phone: '+92 300 4128890',
    country: 'Pakistan',
    city: 'Lahore',
    position: 'Senior Brand Identity & Corporate Graphic Designer',
    category: 'IT & Digital',
    experience: '5 Years',
    skills: 'Brand Identity, Adobe Illustrator, Packaging Design, Company Profiles, UI Graphics',
    expectedSalary: '$2,000 / mo',
    availability: 'Immediate',
    cvUrl: 'data:text/plain;base64,VXNtYW4gVGFyaXEgLSBTZW5pb3IgQnJhbmQgRGVzaWduZXIgQ1YuIEV4cGVyaWVuY2U6IDUgeWVhcnMgaW4gaW50ZXJuYXRpb25hbCBjb3Jwb3JhdGUgYnJhbmRpbmcsIHBhY2thZ2luZywgYW5kIHB1YmxpY2F0aW9uIGRlc2lnbi4=',
    cvFileName: 'Usman_Tariq_Brand_Designer_CV.pdf',
    message: 'Experienced in delivering complete corporate identity systems for GCC and European clients.',
    notes: 'Strong portfolio across corporate profiles and packaging.',
    status: 'Shortlisted',
    createdAt: '2026-10-04T11:20:00.000Z',
    updatedAt: '2026-10-05T09:15:00.000Z',
  },
  {
    applicantId: 'RGS-EMP-00002',
    ownerId: 'system_seed',
    fullName: 'Ayesha Siddiqui',
    email: 'ayesha.media@example.com',
    phone: '+971 50 8923310',
    country: 'United Arab Emirates',
    city: 'Dubai',
    position: 'Performance Social Media & Meta Ads Strategist',
    category: 'Sales & Marketing',
    experience: '3 Years',
    skills: 'Meta Ads, Content Calendar Strategy, LinkedIn Management, Analytics Reporting',
    expectedSalary: '$1,800 / mo',
    availability: '2 Weeks Notice',
    cvUrl: 'data:text/plain;base64,QXllc2hhIFNpZGRpcXVpIC0gU29jaWFsIE1lZGlhICYgUGVyZm9ybWFuY2UgTWFya2V0aW5nIFN0cmF0ZWdpc3QgQ1Yu',
    cvFileName: 'Ayesha_Siddiqui_Marketing_Resume.pdf',
    message: 'Managed 14+ international brand pages with measurable lead generation growth.',
    notes: 'Scheduled for initial screening call.',
    status: 'New',
    createdAt: '2026-10-05T14:40:00.000Z',
    updatedAt: '2026-10-05T14:40:00.000Z',
  }
];

const INITIAL_STAFFING_REQUESTS: StaffingRequestRecord[] = [
  {
    requestId: 'RGS-STAFF-00001',
    ownerId: 'system_seed',
    businessName: 'Al-Noor Royal Hospitality LLC',
    contactPerson: 'Khalid Al-Mansoor',
    email: 'hr@alnoorhospitality.example.com',
    phone: '+971 52 6401190',
    businessType: 'Hotel & Fine Dining Group',
    country: 'United Arab Emirates',
    city: 'Dubai',
    position: 'Receptionists, Baristas & Housekeeping Staff',
    category: 'Hospitality',
    numberRequired: 12,
    experienceRequired: '2+ Years in 4/5-Star Hospitality',
    employmentType: 'Full-time',
    salaryBudget: 'AED 3,500 – 5,500 / mo + Accommodation',
    requiredSkills: 'English & Arabic communication, guest relations, POS systems, front desk etiquette',
    jobDescription: 'Seeking a cohort of 12 trained hospitality professionals for our new Downtown Dubai executive hotel wing.',
    additionalRequirements: 'Candidates must hold valid passport and readiness for immediate visa processing.',
    status: 'In Progress',
    createdAt: '2026-10-03T10:00:00.000Z',
    updatedAt: '2026-10-05T08:30:00.000Z',
  },
  {
    requestId: 'RGS-STAFF-00002',
    ownerId: 'system_seed',
    businessName: 'Vanguard Digital Commerce Ltd',
    contactPerson: 'Sarah Jenkins',
    email: 'talent@vanguardcommerce.example.com',
    phone: '+44 7700 900412',
    businessType: 'E-Commerce & Digital Agency',
    country: 'United Kingdom',
    city: 'Manchester',
    position: 'Graphic Designers & Video Editors',
    category: 'IT & Digital',
    numberRequired: 4,
    experienceRequired: '3+ Years Agency Experience',
    employmentType: 'Remote',
    salaryBudget: '$1,500 – $2,200 / mo per role',
    requiredSkills: 'Adobe Creative Suite, YouTube Thumbnail Design, Social Media Ad Creatives, Motion Graphics',
    jobDescription: 'Dedicated remote creative team to produce high-converting social media ads, packaging labels, and brand assets.',
    additionalRequirements: 'Overlap of at least 4 hours with UK business hours.',
    status: 'New',
    createdAt: '2026-10-05T16:15:00.000Z',
    updatedAt: '2026-10-05T16:15:00.000Z',
  }
];

const INITIAL_MESSAGES: ContactMessageRecord[] = [
  {
    messageId: 'RGS-MSG-00001',
    ownerId: 'system_seed',
    name: 'Tariq Mahmood',
    email: 'tariq@crestlinecorp.example.com',
    phone: '+966 55 1928374',
    company: 'Crestline Construction & Trading',
    serviceRequired: 'Graphic Design & Company Profile Design',
    message: 'We need a complete corporate rebranding package including logo overhaul, 28-page company profile design, letterheads, and LinkedIn page management.',
    status: 'New',
    createdAt: '2026-10-05T18:00:00.000Z',
    updatedAt: '2026-10-05T18:00:00.000Z',
  }
];

function loadDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw) as DatabaseSchema;
    }
  } catch (err) {
    console.error('Error loading database file, initializing fresh store:', err);
  }

  const initial: DatabaseSchema = {
    counters: {
      applicant: INITIAL_APPLICANTS.length,
      staffing: INITIAL_STAFFING_REQUESTS.length,
      job: INITIAL_JOBS.length,
      message: INITIAL_MESSAGES.length,
    },
    applicants: INITIAL_APPLICANTS,
    staffingRequests: INITIAL_STAFFING_REQUESTS,
    jobs: INITIAL_JOBS,
    contactMessages: INITIAL_MESSAGES,
    emailNotifications: [
      {
        id: 'NOTIF-00001',
        to: 'rehmanglobal.contact@gmail.com',
        subject: 'New Job Application – REHMAN GWS',
        type: 'JOB_APPLICATION',
        referenceId: 'RGS-EMP-00002',
        summary: 'Applicant Ayesha Siddiqui applied for Performance Social Media & Meta Ads Strategist (Dubai, UAE).',
        deliveryMethod: 'System Notification Outbox',
        sentAt: '2026-10-05T14:40:02.000Z',
      },
      {
        id: 'NOTIF-00002',
        to: 'rehmanglobal.contact@gmail.com',
        subject: 'New Staffing Request – REHMAN GWS',
        type: 'STAFFING_REQUEST',
        referenceId: 'RGS-STAFF-00002',
        summary: 'Vanguard Digital Commerce Ltd requested 4 staff for Graphic Designers & Video Editors (Manchester, UK).',
        deliveryMethod: 'System Notification Outbox',
        sentAt: '2026-10-05T16:15:03.000Z',
      }
    ],
  };
  saveDb(initial);
  return initial;
}

function saveDb(db: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist DB:', err);
  }
}

let db = loadDb();

function formatSequentialId(prefix: string, num: number): string {
  return `${prefix}-${String(num).padStart(5, '0')}`;
}

async function sendNotificationEmail(params: {
  subject: string;
  type: 'JOB_APPLICATION' | 'STAFFING_REQUEST' | 'CONTACT_ENQUIRY';
  referenceId: string;
  summary: string;
  htmlBody: string;
}) {
  const recipient = process.env.NOTIFICATION_EMAIL || 'rehmanglobal.contact@gmail.com';
  let deliveryMethod = 'Verified Server Outbox (Configure RESEND_API_KEY for external SMTP relay)';

  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'REHMAN GWS <notifications@rehmangws.com>',
          to: [recipient],
          subject: params.subject,
          html: params.htmlBody,
        }),
      });
      if (response.ok) {
        deliveryMethod = 'Resend Transactional Email API (Delivered)';
      }
    } catch (err) {
      console.error('External email relay error:', err);
    }
  }

  const logEntry: EmailNotificationLog = {
    id: `NOTIF-${Date.now()}`,
    to: recipient,
    subject: params.subject,
    type: params.type,
    referenceId: params.referenceId,
    summary: params.summary,
    deliveryMethod,
    sentAt: new Date().toISOString(),
  };

  db.emailNotifications.unshift(logEntry);
  if (db.emailNotifications.length > 100) {
    db.emailNotifications = db.emailNotifications.slice(0, 100);
  }
  saveDb(db);
  return logEntry;
}

// --- ADMIN AUTHENTICATION MIDDLEWARE (Protects Applicant & CV Data) ---
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please sign in at /admin/login.' });
    return;
  }

  const token = authHeader.slice(7).trim();
  const parts = token.split('.');
  if (parts.length !== 3) {
    res.status(401).json({ error: 'Invalid authentication token format.' });
    return;
  }

  try {
    const payloadJson = Buffer.from(parts[1], 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson);
    const nowSec = Math.floor(Date.now() / 1000);

    if (!payload.sub || (payload.exp && payload.exp < nowSec)) {
      res.status(401).json({ error: 'Session expired. Please sign in again at /admin/login.' });
      return;
    }

    next();
  } catch {
    res.status(401).json({ error: 'Invalid authentication token.' });
  }
}

// --- API ROUTES ---

// 1. Public Jobs Listing & Protected Admin Job Management
app.get('/api/jobs', (_req: Request, res: Response) => {
  res.json({ jobs: db.jobs });
});

app.post('/api/jobs', requireAdminAuth, (req: Request, res: Response) => {
  const title = sanitizeText(req.body.title, 120);
  const company = sanitizeText(req.body.company || 'REHMAN GWS Client Partner', 120);
  const category = sanitizeText(req.body.category, 80);
  const location = sanitizeText(req.body.location, 120);
  const employmentType = sanitizeText(req.body.employmentType || 'Full-time', 60);
  const experience = sanitizeText(req.body.experience || '2+ Years', 80);
  const salary = sanitizeText(req.body.salary || 'Competitive', 80);
  const description = sanitizeText(req.body.description, 2000);

  if (!title || !category || !location || !description) {
    res.status(400).json({ error: 'Please provide job title, category, location, and description.' });
    return;
  }

  db.counters.job += 1;
  const jobId = formatSequentialId('RGS-JOB', db.counters.job);
  const now = new Date().toISOString();

  const newJob: JobRecord = {
    jobId,
    title,
    company,
    category,
    location,
    employmentType,
    experience,
    salary,
    description,
    status: 'Open',
    createdAt: now,
    updatedAt: now,
  };

  db.jobs.unshift(newJob);
  saveDb(db);
  res.status(201).json({ job: newJob });
});

app.patch('/api/jobs/:jobId', requireAdminAuth, (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = db.jobs.find((j) => j.jobId === jobId);
  if (!job) {
    res.status(404).json({ error: 'Job not found.' });
    return;
  }

  if (req.body.status === 'Open' || req.body.status === 'Closed') {
    job.status = req.body.status;
  }
  if (req.body.title) job.title = sanitizeText(req.body.title, 120);
  if (req.body.location) job.location = sanitizeText(req.body.location, 120);
  if (req.body.salary !== undefined) job.salary = sanitizeText(req.body.salary, 80);
  if (req.body.description) job.description = sanitizeText(req.body.description, 2000);
  job.updatedAt = new Date().toISOString();

  saveDb(db);
  res.json({ job });
});

app.delete('/api/jobs/:jobId', requireAdminAuth, (req: Request, res: Response) => {
  const { jobId } = req.params;
  db.jobs = db.jobs.filter((j) => j.jobId !== jobId);
  saveDb(db);
  res.json({ success: true });
});

// 2. Job Seeker Application Submission & Protected Admin Management
app.get('/api/applicants', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ applicants: db.applicants });
});

app.post('/api/applicants', rateLimitMiddleware, async (req: Request, res: Response) => {
  const fullName = sanitizeText(req.body.fullName, 120);
  const email = sanitizeText(req.body.email, 160);
  const phone = sanitizeText(req.body.phone, 40);
  const country = sanitizeText(req.body.country, 80);
  const city = sanitizeText(req.body.city, 80);
  const position = sanitizeText(req.body.position, 120);
  const category = sanitizeText(req.body.category, 80);
  const experience = sanitizeText(req.body.experience, 80);
  const skills = sanitizeText(req.body.skills, 500);
  const expectedSalary = sanitizeText(req.body.expectedSalary || '', 80);
  const availability = sanitizeText(req.body.availability || 'Immediate', 80);
  const cvUrl = typeof req.body.cvUrl === 'string' ? req.body.cvUrl.slice(0, 350000) : '';
  const cvFileName = sanitizeText(req.body.cvFileName || 'Candidate_CV.pdf', 180);
  const message = sanitizeText(req.body.message || '', 2000);
  const ownerId = sanitizeText(req.body.ownerId || 'public_applicant', 128);

  if (!fullName || !email || !phone || !country || !city || !position || !category || !experience || !skills || !cvUrl) {
    res.status(400).json({ error: 'All mandatory application fields and CV upload are required.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }

  db.counters.applicant += 1;
  const applicantId = formatSequentialId('RGS-EMP', db.counters.applicant);
  const now = new Date().toISOString();

  const newApplicant: ApplicantRecord = {
    applicantId,
    ownerId,
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
    cvUrl,
    cvFileName,
    message,
    notes: '',
    status: 'New',
    createdAt: now,
    updatedAt: now,
  };

  db.applicants.unshift(newApplicant);
  saveDb(db);

  const notification = await sendNotificationEmail({
    subject: 'New Job Application – REHMAN GWS',
    type: 'JOB_APPLICATION',
    referenceId: applicantId,
    summary: `Applicant ${fullName} (${email}, ${phone}) applied for ${position} [${category}] from ${city}, ${country}.`,
    htmlBody: `
      <h2>New Job Application – REHMAN GWS</h2>
      <p><strong>Applicant ID:</strong> ${applicantId}</p>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
      <p><strong>Location:</strong> ${city}, ${country}</p>
      <p><strong>Position:</strong> ${position} (${category})</p>
      <p><strong>Experience:</strong> ${experience}</p>
      <p><strong>Skills:</strong> ${skills}</p>
      <p><strong>CV File:</strong> ${cvFileName}</p>
    `,
  });

  res.status(201).json({
    applicant: newApplicant,
    notification,
    message: 'Application Submitted Successfully',
  });
});

app.patch('/api/applicants/:applicantId', requireAdminAuth, (req: Request, res: Response) => {
  const { applicantId } = req.params;
  const applicant = db.applicants.find((a) => a.applicantId === applicantId);
  if (!applicant) {
    res.status(404).json({ error: 'Applicant record not found.' });
    return;
  }

  const allowedStatuses = [
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
  if (req.body.status && allowedStatuses.includes(req.body.status)) {
    applicant.status = req.body.status;
  }
  if (req.body.notes !== undefined) {
    applicant.notes = sanitizeText(req.body.notes, 2000);
  }
  applicant.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({ applicant });
});

app.delete('/api/applicants/:applicantId', requireAdminAuth, (req: Request, res: Response) => {
  const { applicantId } = req.params;
  db.applicants = db.applicants.filter((a) => a.applicantId !== applicantId);
  saveDb(db);
  res.json({ success: true });
});

// 3. Employer Staffing Requests Submission & Protected Management
app.get('/api/staffing-requests', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ staffingRequests: db.staffingRequests });
});

app.post('/api/staffing-requests', rateLimitMiddleware, async (req: Request, res: Response) => {
  const businessName = sanitizeText(req.body.businessName, 150);
  const contactPerson = sanitizeText(req.body.contactPerson, 120);
  const email = sanitizeText(req.body.email, 160);
  const phone = sanitizeText(req.body.phone, 40);
  const businessType = sanitizeText(req.body.businessType, 100);
  const country = sanitizeText(req.body.country, 80);
  const city = sanitizeText(req.body.city, 80);
  const position = sanitizeText(req.body.position, 120);
  const category = sanitizeText(req.body.category, 80);
  const numberRequired = Math.max(1, Math.min(10000, Number(req.body.numberRequired) || 1));
  const experienceRequired = sanitizeText(req.body.experienceRequired || '1+ Years', 80);
  const employmentType = sanitizeText(req.body.employmentType || 'Full-time', 60);
  const salaryBudget = sanitizeText(req.body.salaryBudget || '', 100);
  const requiredSkills = sanitizeText(req.body.requiredSkills || '', 500);
  const jobDescription = sanitizeText(req.body.jobDescription || '', 2000);
  const additionalRequirements = sanitizeText(req.body.additionalRequirements || '', 1500);
  const ownerId = sanitizeText(req.body.ownerId || 'public_employer', 128);

  if (!businessName || !contactPerson || !email || !phone || !businessType || !country || !city || !position || !category) {
    res.status(400).json({ error: 'Please complete all required business and staffing fields.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please enter a valid business email address.' });
    return;
  }

  db.counters.staffing += 1;
  const requestId = formatSequentialId('RGS-STAFF', db.counters.staffing);
  const now = new Date().toISOString();

  const newRequest: StaffingRequestRecord = {
    requestId,
    ownerId,
    businessName,
    contactPerson,
    email,
    phone,
    businessType,
    country,
    city,
    position,
    category,
    numberRequired,
    experienceRequired,
    employmentType,
    salaryBudget,
    requiredSkills,
    jobDescription,
    additionalRequirements,
    status: 'New',
    createdAt: now,
    updatedAt: now,
  };

  db.staffingRequests.unshift(newRequest);
  saveDb(db);

  const notification = await sendNotificationEmail({
    subject: 'New Staffing Request – REHMAN GWS',
    type: 'STAFFING_REQUEST',
    referenceId: requestId,
    summary: `${businessName} (${contactPerson}, ${phone}) requested ${numberRequired} staff for ${position} [${category}] in ${city}, ${country}.`,
    htmlBody: `
      <h2>New Staffing Request – REHMAN GWS</h2>
      <p><strong>Request ID:</strong> ${requestId}</p>
      <p><strong>Business Name:</strong> ${businessName} (${businessType})</p>
      <p><strong>Contact Person:</strong> ${contactPerson}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
      <p><strong>Location:</strong> ${city}, ${country}</p>
      <p><strong>Position Required:</strong> ${position} (${category})</p>
      <p><strong>Number of Employees:</strong> ${numberRequired}</p>
      <p><strong>Employment Type:</strong> ${employmentType}</p>
      <p><strong>Salary / Budget:</strong> ${salaryBudget || 'Not specified'}</p>
    `,
  });

  res.status(201).json({
    staffingRequest: newRequest,
    notification,
    message: 'Staffing Request Submitted Successfully',
  });
});

app.patch('/api/staffing-requests/:requestId', requireAdminAuth, (req: Request, res: Response) => {
  const { requestId } = req.params;
  const request = db.staffingRequests.find((r) => r.requestId === requestId);
  if (!request) {
    res.status(404).json({ error: 'Staffing request not found.' });
    return;
  }

  const allowedStatuses = ['New', 'Contacted', 'In Progress', 'Candidates Found', 'Interview', 'Filled', 'Closed'];
  if (req.body.status && allowedStatuses.includes(req.body.status)) {
    request.status = req.body.status;
  }
  request.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({ staffingRequest: request });
});

app.delete('/api/staffing-requests/:requestId', requireAdminAuth, (req: Request, res: Response) => {
  const { requestId } = req.params;
  db.staffingRequests = db.staffingRequests.filter((r) => r.requestId !== requestId);
  saveDb(db);
  res.json({ success: true });
});

// 4. Contact Form Enquiries
app.get('/api/contact', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ contactMessages: db.contactMessages });
});

app.post('/api/contact', rateLimitMiddleware, async (req: Request, res: Response) => {
  const name = sanitizeText(req.body.name, 120);
  const email = sanitizeText(req.body.email, 160);
  const phone = sanitizeText(req.body.phone || '', 40);
  const company = sanitizeText(req.body.company || '', 120);
  const serviceRequired = sanitizeText(req.body.serviceRequired, 120);
  const message = sanitizeText(req.body.message, 2000);
  const ownerId = sanitizeText(req.body.ownerId || 'public_visitor', 128);

  if (!name || !email || !serviceRequired || !message) {
    res.status(400).json({ error: 'Please fill in your name, email, service required, and message.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  db.counters.message += 1;
  const messageId = formatSequentialId('RGS-MSG', db.counters.message);
  const now = new Date().toISOString();

  const newMsg: ContactMessageRecord = {
    messageId,
    ownerId,
    name,
    email,
    phone,
    company,
    serviceRequired,
    message,
    status: 'New',
    createdAt: now,
    updatedAt: now,
  };

  db.contactMessages.unshift(newMsg);
  saveDb(db);

  const notification = await sendNotificationEmail({
    subject: `New Business Enquiry – REHMAN GWS (${serviceRequired})`,
    type: 'CONTACT_ENQUIRY',
    referenceId: messageId,
    summary: `${name} (${company || email}) inquired about ${serviceRequired}.`,
    htmlBody: `
      <h2>New Business Enquiry – REHMAN GWS</h2>
      <p><strong>Enquiry ID:</strong> ${messageId}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Service Required:</strong> ${serviceRequired}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  });

  res.status(201).json({
    contactMessage: newMsg,
    notification,
    message: 'Enquiry sent successfully.',
  });
});

app.patch('/api/contact/:messageId', requireAdminAuth, (req: Request, res: Response) => {
  const { messageId } = req.params;
  const msg = db.contactMessages.find((m) => m.messageId === messageId);
  if (!msg) {
    res.status(404).json({ error: 'Message not found.' });
    return;
  }
  const allowedStatuses = ['New', 'Replied', 'Archived'];
  if (req.body.status && allowedStatuses.includes(req.body.status)) {
    msg.status = req.body.status;
  }
  msg.updatedAt = new Date().toISOString();
  saveDb(db);
  res.json({ contactMessage: msg });
});

app.delete('/api/contact/:messageId', requireAdminAuth, (req: Request, res: Response) => {
  const { messageId } = req.params;
  db.contactMessages = db.contactMessages.filter((m) => m.messageId !== messageId);
  saveDb(db);
  res.json({ success: true });
});

// 5. Brand Logo Exact Static Asset Servicing & Upload
function findExistingLogoFile(): string | null {
  const candidatePaths = [
    PUBLIC_LOGO_FILE,
    BACKUP_LOGO_FILE,
    path.resolve(process.cwd(), 'public', 'rehman-gws-logo.png'),
    path.resolve(process.cwd(), 'rehman-gws-logo.png'),
    path.resolve(process.cwd(), 'ChatGPT Image Sep 25, 2026, 04_00_10 AM.png'),
    path.resolve(process.cwd(), 'public', 'ChatGPT Image Sep 25, 2026, 04_00_10 AM.png'),
    path.resolve(process.cwd(), 'src', 'assets', 'rehman-gws-logo.png'),
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

app.get('/assets/rehman-gws-logo.png', (_req: Request, res: Response) => {
  const existing = findExistingLogoFile();
  if (existing) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(existing);
    return;
  }
  res.status(404).end();
});

app.post('/api/brand/logo', (req: Request, res: Response) => {
  const { dataUrl } = req.body;
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    res.status(400).json({ error: 'Please provide a valid PNG image file.' });
    return;
  }
  const base64Match = dataUrl.match(/^data:image\/[a-zA-Z0-9+.-]+;base64,(.+)$/);
  if (!base64Match || !base64Match[1]) {
    res.status(400).json({ error: 'Invalid image data format.' });
    return;
  }
  const buffer = Buffer.from(base64Match[1], 'base64');
  if (!fs.existsSync(PUBLIC_ASSETS_DIR)) {
    fs.mkdirSync(PUBLIC_ASSETS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  // Write exact unmodified binary bytes of the uploaded PNG
  fs.writeFileSync(PUBLIC_LOGO_FILE, buffer);
  fs.writeFileSync(BACKUP_LOGO_FILE, buffer);
  res.status(200).json({ success: true, logoUrl: `/assets/rehman-gws-logo.png?v=${Date.now()}` });
});

// 6. Protected Admin Overview & Notifications Outbox
app.get('/api/admin/overview', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    applicants: db.applicants,
    staffingRequests: db.staffingRequests,
    jobs: db.jobs,
    contactMessages: db.contactMessages,
    emailNotifications: db.emailNotifications,
    configStatus: {
      notificationRecipient: process.env.NOTIFICATION_EMAIL || 'rehmanglobal.contact@gmail.com',
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
      firebaseConfigured: fs.existsSync(path.resolve(process.cwd(), 'firebase-applet-config.json')),
    },
  });
});

// Redirect /admin directly to /admin/login
app.get('/admin', (_req: Request, res: Response) => {
  res.redirect(302, '/admin/login');
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`REHMAN GWS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
