import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PatientList from './components/PatientManagement/PatientList';
import ClinicalEncountersView from './components/Clinical/ClinicalEncountersView';
import CpoeOrderView from './components/Orders/CpoeOrderView';
import MedicationManager from './components/Medications/MedicationManager';
import InteroperabilityHub from './components/Interoperability/InteroperabilityHub';
import AgileDashboardView from './components/Agile/AgileDashboardView';
import PatientPortalView from './components/PatientPortal/PatientPortalView';
import LoginView from './components/Auth/LoginView';
import CommandPalette from './components/CommandPalette';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Shield, Activity, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

function MainApp() {
  const { isLoggedIn, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('patients');
  const [portalMode, setPortalMode] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Quick Action triggers
  const [registerPatientTrigger, setRegisterPatientTrigger] = useState(false);
  const [newEncounterTrigger, setNewEncounterTrigger] = useState(false);
  const [newOrderTrigger, setNewOrderTrigger] = useState(false);
  const [newPrescriptionTrigger, setNewPrescriptionTrigger] = useState(false);

  // Synchronize view mode with user role
  useEffect(() => {
    if (currentUser?.role === 'patient') {
      setPortalMode(true);
    } else if (currentUser) {
      setPortalMode(false);
    }
  }, [currentUser]);

  if (!isLoggedIn) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        portalMode={portalMode}
        setPortalMode={setPortalMode}
        onOpenRegisterPatient={() => {
          setActiveTab('patients');
          setRegisterPatientTrigger(true);
        }}
        onOpenNewEncounter={() => {
          setActiveTab('encounters');
          setNewEncounterTrigger(true);
        }}
        onOpenNewOrder={() => {
          setActiveTab('orders');
          setNewOrderTrigger(true);
        }}
        onOpenNewPrescription={() => {
          setActiveTab('medications');
          setNewPrescriptionTrigger(true);
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        setPortalMode={setPortalMode}
        onOpenRegisterPatient={() => {
          setActiveTab('patients');
          setRegisterPatientTrigger(true);
        }}
        onOpenNewEncounter={() => {
          setActiveTab('encounters');
          setNewEncounterTrigger(true);
        }}
        onOpenNewOrder={() => {
          setActiveTab('orders');
          setNewOrderTrigger(true);
        }}
        onOpenNewPrescription={() => {
          setActiveTab('medications');
          setNewPrescriptionTrigger(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {portalMode ? (
          <PatientPortalView />
        ) : (
          <>
            {activeTab === 'patients' && (
              <PatientList 
                externalRegisterOpen={registerPatientTrigger}
                onClearExternalRegister={() => setRegisterPatientTrigger(false)}
              />
            )}
            {activeTab === 'encounters' && (
              <ClinicalEncountersView 
                externalNewEncounterOpen={newEncounterTrigger}
                onClearExternalNewEncounter={() => setNewEncounterTrigger(false)}
              />
            )}
            {activeTab === 'orders' && (
              <CpoeOrderView 
                externalNewOrderOpen={newOrderTrigger}
                onClearExternalNewOrder={() => setNewOrderTrigger(false)}
              />
            )}
            {activeTab === 'medications' && (
              <MedicationManager 
                externalNewPrescriptionOpen={newPrescriptionTrigger}
                onClearExternalNewPrescription={() => setNewPrescriptionTrigger(false)}
              />
            )}
            {activeTab === 'interoperability' && <InteroperabilityHub />}
            {activeTab === 'agile' && <AgileDashboardView />}
          </>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/80 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">AuraHealth EHR — Connected Clinical Intelligence</span>
              <p className="text-2xs text-slate-400 mt-0.5">
                Compliant with HL7 v2.5.1 ER7 & HL7 FHIR Release 4 (R4) • HIPAA 256-Bit SSL Enforced
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-2xs text-slate-500">
            <span>Developer: <strong className="text-slate-800">Bushra Khan</strong> (Roll No. 2300320150021)</span>
            <span>•</span>
            <span>Mentor: <strong className="text-teal-700">Dr. Anamika Goel</strong></span>
            <span>•</span>
            <span>College: <strong className="text-slate-800">ABES Engineering College</strong></span>
            <span>•</span>
            <span className="text-slate-500">Date: 24 Oct 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
