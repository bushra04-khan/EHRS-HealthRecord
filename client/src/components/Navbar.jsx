import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, Users, FileText, FlaskConical, Pill, 
  Network, BarChart3, UserCheck, Stethoscope, 
  Bell, Search, ChevronDown, LogOut, Shield, 
  Plus, CheckCircle2, AlertTriangle, Info, Sparkles, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  portalMode, 
  setPortalMode,
  onOpenRegisterPatient,
  onOpenNewEncounter,
  onOpenNewOrder,
  onOpenNewPrescription,
  onOpenCommandPalette
}) {
  const { currentUser, logout, loginAsDemo, demoAccounts, notifications, markAllNotificationsRead } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const userMenuRef = useRef(null);
  const quickActionRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (quickActionRef.current && !quickActionRef.current.contains(event.target)) {
        setQuickActionOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'patients', label: 'Patients', icon: Users, badge: 'Active' },
    { id: 'encounters', label: 'Clinical Encounters', icon: FileText, badge: 'SOAP' },
    { id: 'orders', label: 'CPOE & Diagnostics', icon: FlaskConical, badge: 'PACS' },
    { id: 'medications', label: 'Medications & e-Rx', icon: Pill, badge: 'CDS' },
    { id: 'interoperability', label: 'HL7 & FHIR Hub', icon: Network, badge: 'R4' },
    { id: 'agile', label: 'Agile Metrics', icon: BarChart3, badge: 'Sprint' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-600 p-0.5 shadow-md shadow-teal-500/15">
              <div className="h-full w-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-teal-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  AuraHealth <span className="text-teal-600 font-black">EHR</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-2xs font-bold px-2 py-0.5 rounded-full border border-teal-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping"></span>
                  HL7 v2 & FHIR R4
                </span>
              </div>
              <p className="text-2xs text-slate-400 font-medium hidden sm:block">
                Connected Clinical Intelligence Operating System
              </p>
            </div>
          </div>

          {/* Center: Global Search Bar / Command Palette trigger */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-400 bg-slate-100/80 hover:bg-slate-150 border border-slate-200/90 rounded-xl transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                <span>Search patients, MRN, lab tests, prescriptions...</span>
              </div>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-2xs font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons & User Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Action Button Dropdown (Only in Clinician View) */}
            {!portalMode && (
              <div className="relative" ref={quickActionRef}>
                <button
                  onClick={() => setQuickActionOpen(!quickActionOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Action</span>
                  <ChevronDown className="w-3 h-3 opacity-80" />
                </button>

                {quickActionOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                      Quick Clinical Actions
                    </div>
                    <button
                      onClick={() => { setQuickActionOpen(false); onOpenRegisterPatient?.(); }}
                      className="w-full px-3 py-2 text-left hover:bg-teal-50 text-slate-700 hover:text-teal-900 flex items-center gap-2.5 transition-colors"
                    >
                      <Users className="w-4 h-4 text-teal-600" />
                      <span>Register New Patient</span>
                    </button>
                    <button
                      onClick={() => { setQuickActionOpen(false); onOpenNewEncounter?.(); }}
                      className="w-full px-3 py-2 text-left hover:bg-cyan-50 text-slate-700 hover:text-cyan-900 flex items-center gap-2.5 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-cyan-600" />
                      <span>New SOAP Encounter</span>
                    </button>
                    <button
                      onClick={() => { setQuickActionOpen(false); onOpenNewOrder?.(); }}
                      className="w-full px-3 py-2 text-left hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 flex items-center gap-2.5 transition-colors"
                    >
                      <FlaskConical className="w-4 h-4 text-indigo-600" />
                      <span>Place CPOE Diagnostic Order</span>
                    </button>
                    <button
                      onClick={() => { setQuickActionOpen(false); onOpenNewPrescription?.(); }}
                      className="w-full px-3 py-2 text-left hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 flex items-center gap-2.5 transition-colors"
                    >
                      <Pill className="w-4 h-4 text-emerald-600" />
                      <span>Create e-Prescription (CDS)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Menu */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-800">System Alerts & Notifications</span>
                    {unreadNotifications > 0 && (
                      <button 
                        onClick={markAllNotificationsRead}
                        className="text-2xs text-teal-600 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-2.5 rounded-xl border text-xs transition-colors ${
                          n.type === 'critical' 
                            ? 'bg-rose-50/70 border-rose-200 text-rose-900' 
                            : n.type === 'warning'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span className="flex items-center gap-1.5">
                            {n.type === 'critical' ? <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> : <Info className="w-3.5 h-3.5 text-teal-600" />}
                            {n.title}
                          </span>
                          <span className="text-2xs text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-2xs text-slate-600 mt-1">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portal View Switcher Button */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold border border-slate-200/80">
              <button
                onClick={() => setPortalMode(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  !portalMode 
                    ? 'bg-white text-teal-800 shadow-2xs font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Clinician</span>
              </button>
              <button
                onClick={() => setPortalMode(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  portalMode 
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-2xs font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Patient Portal</span>
              </button>
            </div>

            {/* User Profile Pill & Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left"
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentUser?.color || 'from-teal-600 to-blue-600'} text-white font-bold text-xs flex items-center justify-center shadow-2xs`}>
                  {currentUser?.avatar || 'RA'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser?.name || 'Dr. Rachel Adams, MD'}
                  </p>
                  <p className="text-2xs text-teal-700 font-medium">
                    {currentUser?.roleLabel || 'Chief Clinician'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{currentUser?.name}</p>
                    <p className="text-2xs text-slate-500 mt-0.5">{currentUser?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {currentUser?.status || 'Online'}
                      </span>
                      <span className="text-2xs text-slate-400">
                        {currentUser?.department || currentUser?.mrn}
                      </span>
                    </div>
                  </div>

                  {/* Switch Demo Role */}
                  <div className="px-2 py-1 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                    Switch Active User (Demo)
                  </div>
                  <div className="space-y-1 mb-2">
                    {demoAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => {
                          loginAsDemo(acc);
                          setUserMenuOpen(false);
                          if (acc.role === 'patient') {
                            setPortalMode(true);
                          } else {
                            setPortalMode(false);
                          }
                        }}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                          currentUser?.id === acc.id 
                            ? 'bg-teal-50 text-teal-900 font-bold' 
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${acc.color || 'from-teal-600 to-blue-600'} text-white text-2xs font-bold flex items-center justify-center`}>
                          {acc.avatar}
                        </div>
                        <div className="flex-1 truncate">
                          <span className="text-xs truncate block">{acc.name}</span>
                        </div>
                        <span className="text-2xs text-slate-400 capitalize">{acc.role}</span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out & Lock Terminal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Bar (Only for Clinician View) */}
      {!portalMode && (
        <div className="border-t border-slate-200/70 bg-slate-50/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-1.5 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    <span className={`text-2xs px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
