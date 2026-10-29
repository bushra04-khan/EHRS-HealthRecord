import React, { useState } from 'react';
import { 
  Activity, Shield, Lock, Mail, Eye, EyeOff, User, 
  Stethoscope, Sparkles, CheckCircle2, ArrowRight, 
  FileHeart, HeartHandshake, Database, Network, KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginView() {
  const { login, loginAsDemo, demoAccounts, loading } = useAuth();
  const [email, setEmail] = useState('rachel.adams@hospital.org');
  const [password, setPassword] = useState('doctor123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('clinician'); // clinician or patient

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = (account) => {
    setEmail(account.sampleEmail || account.email);
    setPassword(account.samplePassword || 'doctor123');
    loginAsDemo(account);
  };

  const filteredDemoAccounts = demoAccounts.filter(acc => 
    activeTab === 'patient' ? acc.role === 'patient' : acc.role !== 'patient'
  );

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* Left Column: Brand Hero Visual */}
      <div className="relative lg:w-7/12 flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Ambient background glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-teal-400 via-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-teal-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Activity className="w-6 h-6 text-teal-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                  AuraHealth EHR
                </span>
                <span className="px-2 py-0.5 text-2xs font-bold uppercase tracking-wider bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-full">
                  v2.0 NextGen
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Enterprise Electronic Health Record System</p>
            </div>
          </div>
        </div>

        {/* Hero Central Content */}
        <div className="relative z-10 my-12 lg:my-0 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-medium text-emerald-300">Live Production Node.js Engine</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">HL7 v2.5.1 & FHIR R4 Ready</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Connected Clinical Intelligence for <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">Better Healthcare</span>.
          </h1>
          
          <p className="mt-4 text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
            Streamline patient charting, eliminate legacy silos, automate diagnostic orders, and secure e-prescriptions with built-in Clinical Decision Support (CDS).
          </p>

          {/* Value Props Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <FileHeart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Master Patient Index & 360</h4>
                <p className="text-2xs text-slate-400 mt-0.5">Demographics, allergy flags, chronic condition tracking.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Dynamic SOAP Notes & Vitals</h4>
                <p className="text-2xs text-slate-400 mt-0.5">Automated BMI calculators and biometric trend charting.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">CPOE & Web PACS Radiography</h4>
                <p className="text-2xs text-slate-400 mt-0.5">STAT triage, lab panels, and interactive imaging viewer.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Network className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">HL7 v2 & FHIR R4 Interop</h4>
                <p className="text-2xs text-slate-400 mt-0.5">Live message generation, ER7 parser, REST JSON APIs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Compliance Footer */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-400" />
              <span>HIPAA Compliant</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-teal-400" />
              <span>256-Bit TLS Encryption</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>HL7 & FHIR Verified</span>
            </span>
          </div>
          <span className="text-2xs text-slate-500">EHRS01 Architecture • EdTech Managed</span>
        </div>
      </div>

      {/* Right Column: Interactive Login Form & One-Click Demo Access */}
      <div className="lg:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-slate-900/95 relative">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <div className="inline-flex p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 w-full mb-5">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('clinician');
                  setEmail('rachel.adams@hospital.org');
                  setPassword('doctor123');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'clinician'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Clinician Workspace
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('patient');
                  setEmail('eleanor.vance@example.com');
                  setPassword('patient123');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'patient'
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Patient Portal
              </button>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              {activeTab === 'clinician' ? 'Sign in to Clinical Terminal' : 'Patient Portal Sign In'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'clinician' 
                ? 'Authorized medical staff, physicians, triage nurses, and healthcare administrators.'
                : 'Access your health records, scheduled visits, doctor messages, and active prescriptions.'}
            </p>
          </div>

          {/* Quick Demo Login Pills */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-2xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                1-Click Quick Demo Login:
              </span>
              <span className="text-2xs text-slate-400">Click any user</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredDemoAccounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => handleQuickLogin(account)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-850 hover:bg-slate-750 border border-slate-700/50 hover:border-teal-500/50 transition-all text-left group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${account.color || 'from-blue-600 to-indigo-600'} text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    {account.avatar || account.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-teal-300 transition-colors">
                      {account.name}
                    </p>
                    <p className="text-2xs text-slate-400 truncate">
                      {account.roleLabel || account.specialty || account.mrn}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email / Clinical Identifier
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-2xs text-teal-400 hover:underline cursor-pointer">
                  Demo password: {activeTab === 'patient' ? 'patient123' : 'doctor123'}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500/40"
                />
                <span>Remember this terminal</span>
              </label>
              <button 
                type="button"
                onClick={() => alert("For security compliance in this demo, use the 1-click accounts above or default passwords (doctor123 / patient123 / nurse123 / admin123).")}
                className="text-slate-400 hover:text-teal-400 transition-colors"
              >
                Help & Reset
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:via-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to {activeTab === 'clinician' ? 'Clinician Terminal' : 'Patient Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/40 text-center">
            <p className="text-2xs text-slate-400">
              Authorized clinical use only. All actions are audited in compliance with HL7 AuditEvent and HIPAA regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
