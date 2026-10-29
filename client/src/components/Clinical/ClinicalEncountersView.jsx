import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, User, Calendar, Stethoscope, Activity, 
  Search, CheckCircle2, HeartPulse, Clock, Sparkles, Filter
} from 'lucide-react';
import { api } from '../../api';
import NewEncounterModal from './NewEncounterModal';

export default function ClinicalEncountersView({ externalNewEncounterOpen, onClearExternalNewEncounter }) {
  const [encounters, setEncounters] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientFilter, setSelectedPatientFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (externalNewEncounterOpen) {
      setIsModalOpen(true);
      onClearExternalNewEncounter?.();
    }
  }, [externalNewEncounterOpen, onClearExternalNewEncounter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [encRes, patRes] = await Promise.all([
        api.getEncounters(selectedPatientFilter),
        api.getPatients()
      ]);
      if (encRes.success) setEncounters(encRes.data);
      if (patRes.success) setPatients(patRes.data);
    } catch (err) {
      console.error('Failed to load encounters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPatientFilter]);

  const getPatientName = (patientId) => {
    const p = patients.find(pat => pat.id === patientId);
    return p ? `${p.firstName} ${p.lastName} (${p.mrn})` : patientId;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Epic Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-2xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Epic 2 • Clinical Documentation
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Clinical Encounters & SOAP Notes
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-normal">
              Structured 4-quadrant SOAP assessments (Subjective, Objective, Assessment, Plan), biometric vital tracking, and dynamic BMI computation.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Document New Encounter</span>
          </button>
        </div>
      </div>

      {/* Filter by Patient */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700 whitespace-nowrap">Filter Patient:</span>
          <select
            value={selectedPatientFilter}
            onChange={(e) => setSelectedPatientFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-800 text-xs w-full sm:w-64"
          >
            <option value="">All Patients ({patients.length})</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} — {p.mrn}
              </option>
            ))}
          </select>
        </div>
        <span className="text-slate-500 text-xs font-medium">
          Showing <strong className="text-slate-800">{encounters.length}</strong> clinical encounter records
        </span>
      </div>

      {/* Encounters Timeline */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Loading clinical encounter records...
          </div>
        ) : encounters.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No clinical documentation found for this selection. Click "Document New Encounter" to record a consultation.
          </div>
        ) : (
          encounters.map(enc => (
            <div key={enc.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow overflow-hidden">
              {/* Encounter Header Strip */}
              <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-200/80 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{enc.type}</span>
                      <span className="text-2xs font-mono bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                        {enc.id}
                      </span>
                      <span className="text-2xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> {enc.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Patient: <strong className="text-slate-900">{getPatientName(enc.patientId)}</strong> • <span className="text-teal-700 font-semibold">{enc.department}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-700 font-semibold flex items-center gap-1.5 justify-end">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(enc.date).toLocaleDateString()} at {new Date(enc.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-2xs text-slate-500 block mt-0.5">By {enc.provider}</span>
                </div>
              </div>

              {/* Encounter Body */}
              <div className="p-6 space-y-5">
                {/* Reason for Visit */}
                <div className="text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-2xs block mb-1.5">
                    Chief Complaint / Clinical Indication:
                  </span>
                  <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    "{enc.reasonForVisit}"
                  </p>
                </div>

                {/* Vitals Summary */}
                {enc.vitals && (
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-2xs block mb-2 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-500" /> Objective Biometric Vitals
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <span className="text-2xs text-slate-500 uppercase font-medium">Blood Pressure</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">
                          {enc.vitals.systolicBP}/{enc.vitals.diastolicBP} <span className="text-2xs font-normal text-slate-400">mmHg</span>
                        </p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <span className="text-2xs text-slate-500 uppercase font-medium">Heart Rate</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">
                          {enc.vitals.heartRate} <span className="text-2xs font-normal text-slate-400">bpm</span>
                        </p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <span className="text-2xs text-slate-500 uppercase font-medium">SpO2 (Pulse Ox)</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{enc.vitals.oxygenSaturation}%</p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <span className="text-2xs text-slate-500 uppercase font-medium">Temperature</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{enc.vitals.temperatureF}°F</p>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                        <span className="text-2xs text-slate-500 uppercase font-medium">Resp Rate</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">
                          {enc.vitals.respiratoryRate} <span className="text-2xs font-normal text-slate-400">/min</span>
                        </p>
                      </div>
                      <div className="bg-teal-50/80 p-2.5 rounded-xl border border-teal-200/80">
                        <span className="text-2xs text-teal-700 uppercase font-bold">Body Mass Index</span>
                        <p className="font-black text-teal-900 text-sm mt-0.5">{enc.vitals.bmi || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SOAP Note 4-Quadrant Cards */}
                {enc.soapNote && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                    {/* Subjective */}
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200/80 shadow-2xs">
                      <div className="flex items-center gap-2 font-bold text-blue-900 mb-2">
                        <span className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center text-2xs font-black">S</span>
                        <span>Subjective (HPI & Patient Report)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{enc.soapNote.subjective}</p>
                    </div>

                    {/* Objective */}
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs">
                      <div className="flex items-center gap-2 font-bold text-emerald-900 mb-2">
                        <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-2xs font-black">O</span>
                        <span>Objective (Physical Exam & Findings)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{enc.soapNote.objective}</p>
                    </div>

                    {/* Assessment */}
                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 shadow-2xs">
                      <div className="flex items-center gap-2 font-bold text-amber-900 mb-2">
                        <span className="w-5 h-5 rounded-lg bg-amber-600 text-white flex items-center justify-center text-2xs font-black">A</span>
                        <span>Assessment (Diagnoses & ICD-10)</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">{enc.soapNote.assessment}</p>
                    </div>

                    {/* Plan */}
                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200/80 shadow-2xs">
                      <div className="flex items-center gap-2 font-bold text-purple-900 mb-2">
                        <span className="w-5 h-5 rounded-lg bg-purple-600 text-white flex items-center justify-center text-2xs font-black">P</span>
                        <span>Plan (Orders, Rx & Follow-up)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{enc.soapNote.plan}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Encounter Modal */}
      <NewEncounterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEncounterCreated={() => fetchData()}
        patients={patients}
      />
    </div>
  );
}
