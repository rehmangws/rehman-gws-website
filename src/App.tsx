/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import {
  fetchJobs,
  fetchAdminOverview,
  ApplicantItem,
  StaffingRequestItem,
  JobItem,
  ContactMessageItem,
  EmailNotificationItem,
} from './services/dataService';
import { Navbar, ActiveView } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ServicesView } from './components/ServicesView';
import { CareerPortalView } from './components/CareerPortalView';
import { EmployerPortalView } from './components/EmployerPortalView';
import { AboutSection, ContactSection } from './components/AboutAndContact';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminDashboardView } from './components/AdminDashboardView';



function resolveViewFromLocation(): ActiveView {
  const base = '/rehman-gws-website';
  let path = window.location.pathname;

  if (path === base || path === base + '/') {
    path = '/';
  } else if (path.startsWith(base + '/')) {
    path = path.slice(base.length);
  }

  const search = window.location.search;

  // Restore the route from GitHub Pages 404 redirect
  if (search.startsWith('?/')) {
    const route = search
      .slice(2)
      .split('&')[0]
      .replace(/~and~/g, '&');

    path = route.startsWith('/') ? route : '/' + route;
  }

  path = path.replace(/\/+$/, '') || '/';

  if (path === '/admin' || path === '/admin/login') {
    return 'admin-login';
  }

  if (path === '/admin/dashboard') {
    return 'admin-dashboard';
  }

  if (path === '/about') return 'about';
  if (path === '/services') return 'services';
  if (path === '/jobs') return 'jobs';
  if (path === '/employers') return 'employers';
  if (path === '/contact') return 'contact';

  const params = new URLSearchParams(search);
  const view = params.get('view');

  if (view === 'admin') return 'admin-login';
  if (view === 'admin-dashboard') return 'admin-dashboard';

  if (
    view &&
    [
      'home',
      'about',
      'services',
      'jobs',
      'employers',
      'contact',
      'admin-login',
    ].includes(view)
  ) {
    return view as ActiveView;
  }

  return 'home';
}

function viewToPathname(view: ActiveView): string {
  const base = '/rehman-gws-website';

  switch (view) {
    case 'about':
      return `${base}/about`;
    case 'services':
      return `${base}/services`;
    case 'jobs':
      return `${base}/jobs`;
    case 'employers':
      return `${base}/employers`;
    case 'contact':
      return `${base}/contact`;
    case 'admin-login':
      return `${base}/admin/login`;
    case 'admin-dashboard':
      return `${base}/admin/dashboard`;
    case 'home':
    default:
      return `${base}/`;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>(() =>
    resolveViewFromLocation()
  );

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const ADMIN_EMAIL = 'rehmanglobal.contact@gmail.com';

  // Shared live state from backend / Firestore
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [staffingRequests, setStaffingRequests] = useState<StaffingRequestItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessageItem[]>([]);
  const [emailNotifications, setEmailNotifications] = useState<EmailNotificationItem[]>([]);
  const [configStatus, setConfigStatus] = useState({
    notificationRecipient: 'rehmanglobal.contact@gmail.com',
    resendConfigured: false,
    firebaseConfigured: true,
  });

  // Pre-filled selections when navigating between Services -> Apply / Request Staff / Contact
  const [selectedJobRole, setSelectedJobRole] = useState<string>('');
  const [selectedJobCategory, setSelectedJobCategory] = useState<string>('Hospitality');
  const [selectedStaffRole, setSelectedStaffRole] = useState<string>('');
  const [selectedStaffCategory, setSelectedStaffCategory] = useState<string>('Hospitality');
  const [selectedContactService, setSelectedContactService] = useState<string>(
    'Graphic Design Services'
  );

  // Public job listings (always safe for public visitors)
  const loadPublicJobs = useCallback(async () => {
    try {
      const publicJobs = await fetchJobs();
      setJobs(publicJobs);
    } catch (err) {
      console.error('Error loading public jobs:', err);
    }
  }, []);

  // Protected admin overview data (requires authenticated admin session)
  const loadAdminData = useCallback(async () => {
    try {
      const overview = await fetchAdminOverview();
      setApplicants(overview.applicants);
      setStaffingRequests(overview.staffingRequests);
      setJobs(overview.jobs);
      setContactMessages(overview.contactMessages);
      setEmailNotifications(overview.emailNotifications);
      setConfigStatus(overview.configStatus);
    } catch {
      // Fallback to public jobs if not signed in as admin
      await loadPublicJobs();
    }
  }, [loadPublicJobs]);

  useEffect(() => {
    loadPublicJobs();
  }, [loadPublicJobs]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthInitialized(true);
      if (user) {
        loadAdminData();
      } else {
        setApplicants([]);
        setStaffingRequests([]);
        setContactMessages([]);
        setEmailNotifications([]);
      }
    });
    return () => unsubscribe();
  }, [loadAdminData]);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveView(resolveViewFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Enforce private route protection on /admin/dashboard and /admin/login
useEffect(() => {
  if (!authInitialized) return;

  const ADMIN_EMAIL = 'rehmanglobal.contact@gmail.com';

  const isAuthorizedAdmin =
    currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (activeView === 'admin-dashboard' && !isAuthorizedAdmin) {
    window.history.replaceState({}, '', viewToPathname('admin-login'));
    setActiveView('admin-login');
  } else if (activeView === 'admin-login' && isAuthorizedAdmin) {
    window.history.replaceState({}, '', viewToPathname('admin-dashboard'));
    setActiveView('admin-dashboard');
  }
}, [activeView, currentUser, authInitialized]);

  const handleNavigate = (view: ActiveView, sectionId?: string) => {
    const targetPath = viewToPathname(view);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setActiveView(view);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectServiceForContact = (serviceName: string) => {
    setSelectedContactService(serviceName);
    handleNavigate('contact');
  };

  const handleSelectRoleForJobApplication = (role: string, category: string) => {
    setSelectedJobRole(role);
    setSelectedJobCategory(category);
    handleNavigate('jobs', 'apply-form');
  };

  const handleSelectRoleForStaffRequest = (role: string, category: string) => {
    setSelectedStaffRole(role);
    setSelectedStaffCategory(category);
    handleNavigate('employers');
  };

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#050811] text-slate-100">
      <Navbar activeView={activeView} onNavigate={handleNavigate} />

      <main className="flex-1">
        {activeView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectServiceForContact={handleSelectServiceForContact}
            onSelectRoleForJobApplication={handleSelectRoleForJobApplication}
            onSelectRoleForStaffRequest={handleSelectRoleForStaffRequest}
            selectedContactService={selectedContactService}
            onMessageSubmitted={() => {
              if (currentUser) loadAdminData();
            }}
          />
        )}

        {activeView === 'about' && <AboutSection onNavigate={handleNavigate} />}

        {activeView === 'services' && (
          <ServicesView
            onNavigate={handleNavigate}
            onSelectServiceForContact={handleSelectServiceForContact}
            onSelectRoleForJobApplication={handleSelectRoleForJobApplication}
            onSelectRoleForStaffRequest={handleSelectRoleForStaffRequest}
          />
        )}

        {activeView === 'jobs' && (
          <CareerPortalView
            jobs={jobs}
            initialPosition={selectedJobRole}
            initialCategory={selectedJobCategory}
            onApplicationSubmitted={() => {
              if (currentUser) loadAdminData();
            }}
          />
        )}

        {activeView === 'employers' && (
          <EmployerPortalView
            initialPosition={selectedStaffRole}
            initialCategory={selectedStaffCategory}
            onRequestSubmitted={() => {
              if (currentUser) loadAdminData();
            }}
          />
        )}

        {activeView === 'contact' && (
          <ContactSection
            initialService={selectedContactService}
            onMessageSubmitted={() => {
              if (currentUser) loadAdminData();
            }}
          />
        )}

        {activeView === 'admin-login' && (
  <AdminLoginView
    onLoginSuccess={() => {
      window.history.replaceState(
        {},
        '',
        viewToPathname('admin-dashboard')
      );
      setActiveView('admin-dashboard');
      loadAdminData();
    }}
    onNavigate={handleNavigate}
  />
)}

        {activeView === 'admin-dashboard' &&
  currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
          <AdminDashboardView
            currentUser={currentUser}
            applicants={applicants}
            staffingRequests={staffingRequests}
            jobs={jobs}
            contactMessages={contactMessages}
            emailNotifications={emailNotifications}
            configStatus={configStatus}
            onRefreshData={loadAdminData}
            onLogout={() => handleNavigate('admin-login')}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
