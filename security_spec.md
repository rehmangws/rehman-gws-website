# REHMAN GWS – Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants

1. **Default-Deny Catch-All**: All paths not explicitly matched in `/databases/{database}/documents` are unconditionally denied (`allow read, write: if false;`).
2. **Verified Identity Enforcement**: Every write operation requires an authenticated user with `request.auth.token.email_verified == true`.
3. **Path Variable Hardening**: Every single-document operation (`get`, `create`, `update`, `delete`) validates the path document ID via `isValidId(id)` (`1..128` chars matching `^[a-zA-Z0-9_\-]+$`).
4. **Strict Schema & Key Whitelisting**: Every entity (`User`, `AdminUser`, `Applicant`, `StaffingRequest`, `Job`, `ContactMessage`) validates exact required keys (`hasAll`) and allowed keys (`hasOnly`) with explicit string length bounds (`size()`) on every string field.
5. **PII Isolation**: `users`, `applicants`, `staffingRequests`, and `contactMessages` contain PII (email, phone, CV data) and restrict `get` and `list` strictly to the document owner (`existing().ownerId == request.auth.uid`) or verified administrator (`rehmanglobal.contact@gmail.com`).
6. **Cost-Optimized List Queries**: No `allow list` block invokes `get()` or `exists()`. List rules evaluate `existing()` and verified token attributes directly.
7. **Temporal & Immortal Integrity**: `createdAt` must equal `request.time` on creation and remain immutable on update; `updatedAt` must equal `request.time` on both creation and update. `ownerId` and entity IDs are immutable.
8. **Terminal State Locking**: Once an `Applicant` reaches `Archived`, a `StaffingRequest` reaches `Closed`, or a `ContactMessage` reaches `Archived`, non-admin updates are locked.

---

## 2. The "Dirty Dozen" Payloads

1. **Shadow Field Injection (`Applicant`)**: Submitting an applicant payload with an undeclared `"isAdmin": true` key -> Rejected by `data.keys().hasOnly(...)`.
2. **Identity Spoofing (`Applicant`)**: Creating an applicant where `ownerId` is set to another user's UID -> Rejected by `incoming().ownerId == request.auth.uid`.
3. **Unverified Email Spoof (`AdminUser`)**: Attempting admin read/write with `email == 'rehmanglobal.contact@gmail.com'` but `email_verified == false` -> Rejected by `isVerifiedUser()`.
4. **Denial-of-Wallet Oversized String (`StaffingRequest`)**: Submitting a 50,000-character `jobDescription` -> Rejected by `data.jobDescription.size() <= 2000`.
5. **ID Poisoning Attack (`Job`)**: Creating a job with document ID containing spaces or SQL/path characters (`../admin`) -> Rejected by `isValidId(jobId)`.
6. **PII Blanket Read (`Applicant`)**: Authenticated non-owner attempting `get` or `list` on another candidate's application -> Rejected by `existing().ownerId == request.auth.uid || isDirectAdmin()`.
7. **Timestamp Forgery (`ContactMessage`)**: Creating a contact message with a backdated `createdAt` timestamp -> Rejected by `incoming().createdAt == request.time`.
8. **Immortal Field Mutation (`StaffingRequest`)**: Updating `ownerId` or `createdAt` on an existing staffing request -> Rejected by immutability gate and `affectedKeys().hasOnly(...)`.
9. **Value Poisoning on Update (`Applicant`)**: Updating `status` to `"HackedStatus"` -> Rejected by `isValidApplicant(incoming())` enum check wrapping the `allow update` rule.
10. **Terminal State Bypass (`StaffingRequest`)**: Non-admin attempting to update a staffing request whose `existing().status == 'Closed'` -> Rejected by terminal state lock.
11. **Privilege Escalation (`AdminUser`)**: Standard user attempting to create a document in `/adminUsers/{uid}` -> Rejected by `isDirectAdmin()` gate.
12. **Unauthorized Public Job Creation (`Job`)**: Non-admin authenticated user attempting to publish or delete a job posting -> Rejected by `isAdmin()` check.
