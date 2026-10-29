import React, { useState, useEffect } from 'react';
import { 
  Search, Users, FileText, FlaskConical, Pill, 
  Network, BarChart3, UserCheck, Stethoscope, ArrowRight, X, Sparkles
} from 'lucide-react';
import { api } from '../api';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  onSelectTab, 
  setPortalMode,
  onOpenRegisterPatient,
  onOpenNewEncounter,
  onOpenNewOrder,
  onOpenNewPrescription
}) {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.getPatients()
        .then(res => {
          if (res.success) setPatients(res.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle trigger
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav = [
    { label: 'Patient Master Index', tab: 'patients', icon: Users, desc: 'View all registered patients, MRNs and demographics' },
    { label: 'Clinical Encounters & SOAP', tab: 'encounters', icon: FileText, desc: 'Physician notes, vital trends, and ICD-10 charting' },
    { label: 'CPOE Diagnostics & PACS Radiography', tab: 'orders', icon: FlaskConical, desc: 'Lab panels, STAT orders, and radiology imaging' },
    { label: 'Medications & E-Prescribing (CDS)', tab: 'medications', icon: Pill, desc: 'Prescription orders and allergy contraindication checks' },
    { label: 'HL7 v2.5.1 & FHIR R4 Hub', tab: 'interoperability', icon: Network, desc: 'Interoperability gateway, ER7 messages, and REST APIs' },
    { label: 'Agile Velocity & Metrics', tab: 'agile', icon: BarChart3, desc: 'Sprint progress, burndown charts, and team breakdown' }
  ];

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName} ${p.mrn} ${p.bloodGroup}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-slate-200 px-4 py-3 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-teal-600" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a clinical command, search patient name, MRN, or ICD-10..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions Strip */}
          <div>
            <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              Quick Actions
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { onClose(); onOpenRegisterPatient(); }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 flex items-center gap-2 text-left transition-all"
              >
                <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Register Patient</p>
                  <p className="text-2xs text-slate-500">Add demographic profile</p>
                </div>
              </button>

              <button
                onClick={() => { onClose(); onOpenNewEncounter(); }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 flex items-center gap-2 text-left transition-all"
              >
                <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">New SOAP Note</p>
                  <p className="text-2xs text-slate-500">Document consultation</p>
                </div>
              </button>

              <button
                onClick={() => { onClose(); onOpenNewOrder(); }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 flex items-center gap-2 text-left transition-all"
              >
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Diagnostic Order</p>
                  <p className="text-2xs text-slate-500">Order lab or imaging</p>
                </div>
              </button>

              <button
                onClick={() => { onClose(); onOpenNewPrescription(); }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 flex items-center gap-2 text-left transition-all"
              >
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">e-Prescription (CDS)</p>
                  <p className="text-2xs text-slate-500">Prescribe with allergy checks</p>
                </div>
              </button>
            </div>
          </div>

          {/* Matched Patients */}
          {query && (
            <div>
              <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                Matched Patients ({filteredPatients.length})
              </div>
              {filteredPatients.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-2xs">
                  No matching patients found.
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredPatients.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPortalMode(false);
                        onSelectTab('patients');
                        onClose();
                      }}
                      className="w-full p-2 rounded-xl hover:bg-slate-100 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{p.firstName} {p.lastName}</p>
                          <p className="text-2xs text-slate-500">{p.mrn} • DOB: {p.dob} • Blood: {p.bloodGroup}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation Items */}
          <div>
            <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Navigate Systems
            </div>
            <div className="space-y-1">
              {quickNav.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setPortalMode(false);
                      onSelectTab(item.tab);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-100 flex items-center justify-between text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-teal-100 text-slate-600 group-hover:text-teal-700 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{item.label}</p>
                        <p className="text-2xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-2xs text-slate-500">
          <span>Press <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded text-2xs">ESC</kbd> to close</span>
          <span className="text-teal-700 font-semibold">AuraHealth Intelligent Navigation</span>
        </div>
      </div>
    </div>
  );
}
