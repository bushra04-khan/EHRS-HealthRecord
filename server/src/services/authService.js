// Authentication & User Management Service for EHRS01
const users = [
  {
    id: 'USR-001',
    email: 'rachel.adams@hospital.org',
    password: 'doctor123',
    name: 'Dr. Rachel Adams, MD',
    role: 'clinician',
    roleLabel: 'Chief Clinician',
    specialty: 'Internal Medicine',
    department: 'Internal Medicine & Primary Care',
    avatar: 'RA',
    color: 'from-blue-600 to-indigo-600',
    status: 'On-Duty',
    lastActive: 'Just now'
  },
  {
    id: 'USR-002',
    email: 'marcus.chen@hospital.org',
    password: 'doctor123',
    name: 'Dr. Marcus Chen, MD',
    role: 'clinician',
    roleLabel: 'Attending Radiologist',
    specialty: 'Radiology & Imaging',
    department: 'Diagnostic Imaging Center',
    avatar: 'MC',
    color: 'from-cyan-600 to-blue-600',
    status: 'In Reading Room',
    lastActive: '5m ago'
  },
  {
    id: 'USR-003',
    email: 'sarah.jenkins@hospital.org',
    password: 'nurse123',
    name: 'Sarah Jenkins, RN',
    role: 'nurse',
    roleLabel: 'Triage Nurse Lead',
    specialty: 'Clinical Triage',
    department: 'Outpatient Triage & Vitals',
    avatar: 'SJ',
    color: 'from-teal-600 to-emerald-600',
    status: 'On-Floor',
    lastActive: '2m ago'
  },
  {
    id: 'USR-004',
    email: 'eleanor.vance@example.com',
    password: 'patient123',
    name: 'Eleanor Vance',
    role: 'patient',
    roleLabel: 'Patient',
    patientId: 'PAT-1001',
    mrn: 'MRN-2026-8941',
    dob: '1968-04-15',
    bloodGroup: 'A+',
    avatar: 'EV',
    color: 'from-violet-600 to-purple-600',
    status: 'Active Patient',
    lastActive: '10m ago'
  },
  {
    id: 'USR-005',
    email: 'gaurav.kumar@edtech.org',
    password: 'admin123',
    name: 'Gaurav Kumar',
    role: 'admin',
    roleLabel: 'Agile Project Manager',
    specialty: 'Health Informatics & PMO',
    department: 'Health Informatics & Delivery',
    avatar: 'GK',
    color: 'from-amber-600 to-orange-600',
    status: 'Online',
    lastActive: 'Active'
  }
];

class AuthService {
  login(email, password) {
    const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
    if (!user) {
      throw new Error('Account with this email does not exist');
    }
    if (user.password !== password) {
      throw new Error('Invalid password provided');
    }

    const { password: _, ...safeUser } = user;
    const token = `ehrs_token_${safeUser.id}_${Date.now()}`;

    return {
      user: safeUser,
      token,
      expiresIn: '24h'
    };
  }

  getDemoAccounts() {
    return users.map(({ password, ...u }) => ({
      ...u,
      sampleEmail: u.email,
      samplePassword: password
    }));
  }

  getUserById(id) {
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = new AuthService();
