/**
 * Firestore Security Rules Test Specification (Dirty Dozen Verification)
 * Verifies that all 12 adversarial payloads in security_spec.md return PERMISSION_DENIED.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'create' | 'update' | 'get' | 'list' | 'delete';
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Shadow Field Injection on Applicant',
    collection: 'applicants',
    docId: 'RGS-EMP-00001',
    operation: 'create',
    auth: { uid: 'user_1', email: 'applicant@example.com', email_verified: true },
    payload: {
      applicantId: 'RGS-EMP-00001',
      ownerId: 'user_1',
      fullName: 'Ali Khan',
      isVerifiedAdmin: true // Ghost field
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Identity Spoofing on Applicant ownerId',
    collection: 'applicants',
    docId: 'RGS-EMP-00002',
    operation: 'create',
    auth: { uid: 'user_1', email: 'applicant@example.com', email_verified: true },
    payload: {
      applicantId: 'RGS-EMP-00002',
      ownerId: 'victim_uid_999',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unverified Email Spoof on Admin email',
    collection: 'applicants',
    docId: 'RGS-EMP-00001',
    operation: 'get',
    auth: { uid: 'spoof_admin', email: 'rehmanglobal.contact@gmail.com', email_verified: false },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Denial-of-Wallet Oversized String on StaffingRequest',
    collection: 'staffingRequests',
    docId: 'RGS-STAFF-00001',
    operation: 'create',
    auth: { uid: 'employer_1', email: 'hr@company.com', email_verified: true },
    payload: {
      requestId: 'RGS-STAFF-00001',
      ownerId: 'employer_1',
      jobDescription: 'A'.repeat(10000),
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'ID Poisoning Attack on Job ID',
    collection: 'jobs',
    docId: 'invalid id with spaces!',
    operation: 'get',
    auth: { uid: 'user_1', email: 'user@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'PII Blanket Read on Another User Applicant Document',
    collection: 'applicants',
    docId: 'RGS-EMP-00001',
    operation: 'get',
    auth: { uid: 'other_user_2', email: 'other@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Timestamp Forgery on ContactMessage',
    collection: 'contactMessages',
    docId: 'MSG-00001',
    operation: 'create',
    auth: { uid: 'user_1', email: 'user@example.com', email_verified: true },
    payload: {
      messageId: 'MSG-00001',
      ownerId: 'user_1',
      createdAt: '2020-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Immortal Field Mutation on StaffingRequest ownerId',
    collection: 'staffingRequests',
    docId: 'RGS-STAFF-00001',
    operation: 'update',
    auth: { uid: 'employer_1', email: 'hr@company.com', email_verified: true },
    payload: {
      ownerId: 'new_owner_999',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Value Poisoning on Applicant status enum',
    collection: 'applicants',
    docId: 'RGS-EMP-00001',
    operation: 'update',
    auth: { uid: 'admin_uid', email: 'rehmanglobal.contact@gmail.com', email_verified: true },
    payload: {
      status: 'INVALID_STATUS_VALUE',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Terminal State Bypass on Closed StaffingRequest by non-admin',
    collection: 'staffingRequests',
    docId: 'RGS-STAFF-CLOSED',
    operation: 'update',
    auth: { uid: 'employer_1', email: 'hr@company.com', email_verified: true },
    payload: {
      additionalRequirements: 'Updated after closed',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Privilege Escalation via Self-Registration in adminUsers',
    collection: 'adminUsers',
    docId: 'user_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'user@example.com', email_verified: true },
    payload: {
      uid: 'user_1',
      email: 'user@example.com',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unauthorized Job Creation by Non-Admin User',
    collection: 'jobs',
    docId: 'JOB-999',
    operation: 'create',
    auth: { uid: 'user_1', email: 'user@example.com', email_verified: true },
    payload: {
      jobId: 'JOB-999',
      title: 'Unauthorized Role',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
];
