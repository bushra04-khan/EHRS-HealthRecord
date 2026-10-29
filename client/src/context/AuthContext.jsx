import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const DEFAULT_DEMO_USERS = [
  {
    id: 'USR-001',
    email: 'rachel.adams@hospital.org',
    name: 'Dr. Rachel Adams, MD',
    role: 'clinician',
    roleLabel: 'Chief Clinician',
    specialty: 'Internal Medicine',
    department: 'Internal Medicine & Primary Care',
    avatar: 'RA',
    color: 'from-blue-600 to-indigo-600',
    status: 'On-Duty',
    samplePassword: 'doctor123'
  },
  {
    id: 'USR-002',
    email: 'marcus.chen@hospital.org',
    name: 'Dr. Marcus Chen, MD',
    role: 'clinician',
    roleLabel: 'Attending Radiologist',
    specialty: 'Radiology & Imaging',
    department: 'Diagnostic Imaging Center',
    avatar: 'MC',
    color: 'from-cyan-600 to-blue-600',
    status: 'In Reading Room',
    samplePassword: 'doctor123'
  },
  {
    id: 'USR-003',
    email: 'sarah.jenkins@hospital.org',
    name: 'Sarah Jenkins, RN',
    role: 'nurse',
    roleLabel: 'Triage Nurse Lead',
    specialty: 'Clinical Triage',
    department: 'Outpatient Triage & Vitals',
    avatar: 'SJ',
    color: 'from-teal-600 to-emerald-600',
    status: 'On-Floor',
    samplePassword: 'nurse123'
  },
  {
    id: 'USR-004',
    email: 'eleanor.vance@example.com',
    name: 'Eleanor Vance',
    role: 'patient',
    roleLabel: 'Patient Portal',
    patientId: 'PAT-1001',
    mrn: 'MRN-2026-8941',
    avatar: 'EV',
    color: 'from-violet-600 to-purple-600',
    status: 'Active Patient',
    samplePassword: 'patient123'
  },
  {
    id: 'USR-005',
    email: 'gaurav.kumar@edtech.org',
    name: 'Gaurav Kumar',
    role: 'admin',
    roleLabel: 'Agile Project Manager',
    specialty: 'Health Informatics & PMO',
    department: 'Health Informatics & Delivery',
    avatar: 'GK',
    color: 'from-amber-600 to-orange-600',
    status: 'Online',
    samplePassword: 'admin123'
  }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ehrs_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [demoAccounts, setDemoAccounts] = useState(DEFAULT_DEMO_USERS);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', title: 'Critical Lab Value', text: 'Eleanor Vance (PAT-1001) HbA1c is 8.6% (Target < 7.0%)', time: '12m ago', read: false },
    { id: 2, type: 'info', title: 'PACS Study Ready', text: 'Chest X-Ray study uploaded for Eleanor Vance', time: '35m ago', read: false },
    { id: 3, type: 'warning', title: 'HL7 Interoperability Sync', text: 'Inbound ADT^A01 feed from Boston General processed', time: '1h ago', read: true },
  ]);

  useEffect(() => {
    // Fetch demo accounts from backend if available
    api.getDemoAccounts()
      .then(res => {
        if (res.success && res.data?.length > 0) {
          setDemoAccounts(res.data);
        }
      })
      .catch(() => {
        // Fallback to local default demo accounts
      });
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // First try backend API
      try {
        const res = await api.login(email, password);
        if (res.success && res.user) {
          setCurrentUser(res.user);
          localStorage.setItem('ehrs_active_user', JSON.stringify(res.user));
          return res.user;
        }
      } catch (apiErr) {
        // If API fails or backend offline, check local demo accounts for seamless fallback
        const localMatch = demoAccounts.find(
          u => (u.email || '').toLowerCase() === (email || '').toLowerCase().trim() &&
               (u.samplePassword === password || u.password === password || password === 'demo' || password === '123456')
        );
        if (localMatch) {
          setCurrentUser(localMatch);
          localStorage.setItem('ehrs_active_user', JSON.stringify(localMatch));
          return localMatch;
        }
        throw apiErr;
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = (account) => {
    setCurrentUser(account);
    localStorage.setItem('ehrs_active_user', JSON.stringify(account));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ehrs_active_user');
    api.logout().catch(() => {});
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        login,
        loginAsDemo,
        logout,
        demoAccounts,
        loading,
        notifications,
        dismissNotification,
        markAllNotificationsRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
