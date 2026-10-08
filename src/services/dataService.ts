import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  getAdminAuthHeaders,
} from '../lib/firebase';

export interface ApplicantItem {
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
  status:
    | 'New'
    | 'Reviewed'
    | 'Shortlisted'
    | 'Contacted'
    | 'Interview'
    | 'Selected'
    | 'Rejected'
    | 'Hired'
    | 'Archived';
  createdAt: string;
  updatedAt: string;
}

export interface StaffingRequestItem {
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

export interface JobItem {
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

export interface ContactMessageItem {
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

export interface EmailNotificationItem {
  id: string;
  to: string;
  subject: string;
  type: 'JOB_APPLICATION' | 'STAFFING_REQUEST' | 'CONTACT_ENQUIRY';
  referenceId: string;
  summary: string;
  deliveryMethod: string;
  sentAt: string;
}

function clampString(val: string, max: number): string {
  return (val || '').trim().slice(0, max);
}

// Fetch all public jobs (safe for public visitors; contains zero applicant/CV PII)
export async function fetchJobs(): Promise<JobItem[]> {
  const res = await fetch('/api/jobs');
  if (!res.ok) throw new Error('Failed to load jobs');
  const data = await res.json();
  return data.jobs || [];
}

// Fetch protected admin dashboard data (requires authenticated Firebase session)
export async function fetchAdminOverview(): Promise<{
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
}> {
  const headers = await getAdminAuthHeaders();
  const res = await fetch('/api/admin/overview', { headers });
  if (!res.ok) throw new Error('Unauthorized or failed to load admin overview');
  return res.json();
}

// Submit Job Seeker Application (Backend DB + Email Notification + Firestore when authenticated)
export async function submitJobApplication(payload: {
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
}): Promise<{ applicant: ApplicantItem }> {
  const currentUser = auth.currentUser;
  const ownerId = currentUser?.uid || 'public_applicant';

  const res = await fetch('/api/applicants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, ownerId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Could not submit application.');
  }

  const applicant: ApplicantItem = data.applicant;

  // If authenticated with a verified account, also persist directly to Firestore
  if (currentUser && currentUser.emailVerified) {
    const path = `applicants/${applicant.applicantId}`;
    try {
      await setDoc(doc(db, 'applicants', applicant.applicantId), {
        applicantId: clampString(applicant.applicantId, 64),
        ownerId: clampString(currentUser.uid, 128),
        fullName: clampString(applicant.fullName, 120),
        email: clampString(applicant.email, 160),
        phone: clampString(applicant.phone, 40),
        country: clampString(applicant.country, 80),
        city: clampString(applicant.city, 80),
        position: clampString(applicant.position, 120),
        category: clampString(applicant.category, 80),
        experience: clampString(applicant.experience, 80),
        skills: clampString(applicant.skills, 500),
        expectedSalary: clampString(applicant.expectedSalary, 80),
        availability: clampString(applicant.availability, 80),
        cvUrl: clampString(applicant.cvUrl, 350000),
        cvFileName: clampString(applicant.cvFileName, 180),
        message: clampString(applicant.message, 2000),
        notes: '',
        status: 'New',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  return { applicant };
}

// Submit Employer Staffing Request (Backend DB + Email Notification + Firestore when authenticated)
export async function submitStaffingRequest(payload: {
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
}): Promise<{ staffingRequest: StaffingRequestItem }> {
  const currentUser = auth.currentUser;
  const ownerId = currentUser?.uid || 'public_employer';

  const res = await fetch('/api/staffing-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, ownerId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Could not submit staffing request.');
  }

  const staffingRequest: StaffingRequestItem = data.staffingRequest;

  if (currentUser && currentUser.emailVerified) {
    const path = `staffingRequests/${staffingRequest.requestId}`;
    try {
      await setDoc(doc(db, 'staffingRequests', staffingRequest.requestId), {
        requestId: clampString(staffingRequest.requestId, 64),
        ownerId: clampString(currentUser.uid, 128),
        businessName: clampString(staffingRequest.businessName, 150),
        contactPerson: clampString(staffingRequest.contactPerson, 120),
        email: clampString(staffingRequest.email, 160),
        phone: clampString(staffingRequest.phone, 40),
        businessType: clampString(staffingRequest.businessType, 100),
        country: clampString(staffingRequest.country, 80),
        city: clampString(staffingRequest.city, 80),
        position: clampString(staffingRequest.position, 120),
        category: clampString(staffingRequest.category, 80),
        numberRequired: Math.max(1, Math.min(10000, Math.floor(Number(staffingRequest.numberRequired) || 1))),
        experienceRequired: clampString(staffingRequest.experienceRequired, 80),
        employmentType: clampString(staffingRequest.employmentType, 60),
        salaryBudget: clampString(staffingRequest.salaryBudget, 100),
        requiredSkills: clampString(staffingRequest.requiredSkills, 500),
        jobDescription: clampString(staffingRequest.jobDescription, 2000),
        additionalRequirements: clampString(staffingRequest.additionalRequirements, 1500),
        status: 'New',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  return { staffingRequest };
}

// Submit Contact Form Enquiry
export async function submitContactEnquiry(payload: {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceRequired: string;
  message: string;
}): Promise<{ contactMessage: ContactMessageItem }> {
  const currentUser = auth.currentUser;
  const ownerId = currentUser?.uid || 'public_visitor';

  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, ownerId }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Could not send enquiry.');
  }

  const contactMessage: ContactMessageItem = data.contactMessage;

  if (currentUser && currentUser.emailVerified) {
    const path = `contactMessages/${contactMessage.messageId}`;
    try {
      await setDoc(doc(db, 'contactMessages', contactMessage.messageId), {
        messageId: clampString(contactMessage.messageId, 64),
        ownerId: clampString(currentUser.uid, 128),
        name: clampString(contactMessage.name, 120),
        email: clampString(contactMessage.email, 160),
        phone: clampString(contactMessage.phone, 40),
        company: clampString(contactMessage.company, 120),
        serviceRequired: clampString(contactMessage.serviceRequired, 120),
        message: clampString(contactMessage.message, 2000),
        status: 'New',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  return { contactMessage };
}

// Admin: Update Applicant Status or Notes
export async function updateApplicantRecord(
  applicantId: string,
  updates: { status?: ApplicantItem['status']; notes?: string }
): Promise<ApplicantItem> {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/applicants/${applicantId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update applicant');
  const data = await res.json();

  if (auth.currentUser?.email === 'rehmanglobal.contact@gmail.com' && auth.currentUser.emailVerified) {
    try {
      await updateDoc(doc(db, 'applicants', applicantId), {
        ...(updates.status ? { status: updates.status } : {}),
        ...(updates.notes !== undefined ? { notes: clampString(updates.notes, 2000) } : {}),
        updatedAt: serverTimestamp(),
      });
    } catch {
      // Document may only exist in backend seed DB if submitted by unauthenticated visitor
    }
  }
  return data.applicant;
}

export async function deleteApplicantRecord(applicantId: string): Promise<void> {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/applicants/${applicantId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete applicant');

  if (auth.currentUser?.email === 'rehmanglobal.contact@gmail.com' && auth.currentUser.emailVerified) {
    try {
      await deleteDoc(doc(db, 'applicants', applicantId));
    } catch {
      // Ignore if not mirrored in Firestore
    }
  }
}

export async function updateStaffingRequestStatus(
  requestId: string,
  status: StaffingRequestItem['status']
): Promise<StaffingRequestItem> {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/staffing-requests/${requestId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update staffing request');
  const data = await res.json();

  if (auth.currentUser?.email === 'rehmanglobal.contact@gmail.com' && auth.currentUser.emailVerified) {
    try {
      await updateDoc(doc(db, 'staffingRequests', requestId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch {
      // Ignore if not mirrored in Firestore
    }
  }
  return data.staffingRequest;
}

export async function deleteStaffingRequestRecord(requestId: string): Promise<void> {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/staffing-requests/${requestId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete staffing request');
}

export async function createNewJobListing(payload: {
  title: string;
  company: string;
  category: string;
  location: string;
  employmentType: string;
  experience: string;
  salary: string;
  description: string;
}): Promise<JobItem> {
  const headers = await getAdminAuthHeaders();
  const res = await fetch('/api/jobs', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create job');

  const job: JobItem = data.job;
  if (auth.currentUser?.email === 'rehmanglobal.contact@gmail.com' && auth.currentUser.emailVerified) {
    const path = `jobs/${job.jobId}`;
    try {
      await setDoc(doc(db, 'jobs', job.jobId), {
        jobId: clampString(job.jobId, 64),
        title: clampString(job.title, 120),
        company: clampString(job.company, 120),
        category: clampString(job.category, 80),
        location: clampString(job.location, 120),
        employmentType: clampString(job.employmentType, 60),
        experience: clampString(job.experience, 80),
        salary: clampString(job.salary, 80),
        description: clampString(job.description, 2000),
        status: 'Open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
  return job;
}

export async function updateJobStatus(jobId: string, status: 'Open' | 'Closed'): Promise<JobItem> {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/jobs/${jobId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update job status');
  const data = await res.json();
  return data.job;
}

export async function deleteJobListing(jobId: string): Promise<void> {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete job');
}

export async function updateContactMessageStatus(
  messageId: string,
  status: ContactMessageItem['status']
): Promise<ContactMessageItem> {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/contact/${messageId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update message status');
  const data = await res.json();
  return data.contactMessage;
}

export async function deleteContactMessageRecord(messageId: string): Promise<void> {
  const headers = await getAdminAuthHeaders();
  const res = await fetch(`/api/contact/${messageId}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete message');
}
