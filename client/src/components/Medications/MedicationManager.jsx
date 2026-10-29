import React, { useState, useEffect } from 'react';
import { Pill, Plus, Search, Filter, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { api } from '../../api';
import NewPrescriptionModal from './NewPrescriptionModal';

export default function MedicationManager({ externalNewPrescriptionOpen, onClearExternalNewPrescription }) {
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientFilter, setSelectedPatientFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (externalNewPrescriptionOpen) {
      setIsModalOpen(true);
      onClearExternalNewPrescription?.();
    }
  }, [externalNewPrescriptionOpen, onClearExternalNewPrescription]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [medRes, patRes] = await Promise.all([
        api.getMedications({ 
          patientId: selectedPatientFilter, 
          status: selectedStatusFilter 
        }),
        api.getPatients()
      ]);
      if (medRes.success) setMedications(medRes.data);
      if (patRes.success) setPatients(patRes.data);
    } catch (err) {
      console.error('Failed to load medications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPatientFilter, selectedStatusFilter]);

  const handleDiscontinue = async (medId, drugName) => {
    const reason = window.prompt(`Reason for discontinuing ${drugName}:`, "Therapy completed / clinical re-evaluation");
    if (!reason) return;

    try {
      const res = await api.discontinueMedication(medId, reason);
      if (res.success) {
        fetchData();
      }
    } catch (e) {
      alert(e.message || "Failed to discontinue");
    }
  };

  const getPatientDisplay = (id) => {
    const p = patients.find(pat => pat.id === id);
    return p ? `${p.firstName} ${p.lastName} (${p.mrn})` : id;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Epic Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-2xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Epic 4 • e-Prescribing & CDS
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Medication Management & e-Prescribing
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-normal">
              Real-time Clinical Decision Support (CDS) allergy contraindication alerts, electronic prescription transmission, and active pharmacotherapy tracking.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create e-Prescription (e-Rx)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Filter Patient:</span>
            <select
              value={selectedPatientFilter}
              onChange={(e) => setSelectedPatientFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl outline-none bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Patients ({patients.length})</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} — {p.mrn}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl outline-none bg-white text-slate-800 text-xs focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Regimens</option>
              <option value="Active">Active Regimens Only</option>
              <option value="Discontinued">Discontinued Regimens</option>
            </select>
          </div>
        </div>

        <span className="text-slate-500 text-xs font-medium">
          Showing <strong className="text-slate-800">{medications.length}</strong> prescriptions on file
        </span>
      </div>

      {/* Medications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Loading prescription regimens...
          </div>
        ) : medications.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No medication orders found. Click "Create e-Prescription" to issue an order.
          </div>
        ) : (
          medications.map(med => (
            <div key={med.id} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  med.status === 'Active' 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{med.drugName}</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      {med.dosage}
                    </span>
                    <span className="text-2xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                      {med.id}
                    </span>
                    <span className={`text-2xs font-bold px-2.5 py-0.5 rounded-full ${
                      med.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {med.status}
                    </span>
                    {med.overrideReason && (
                      <span className="text-2xs font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-700" /> Allergy Override
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 mt-1.5 font-medium">
                    Patient: <strong className="text-slate-900">{getPatientDisplay(med.patientId)}</strong> • <strong>Instructions:</strong> {med.frequency} ({med.route}) • Duration: {med.duration} • Refills: {med.refills}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-2xs text-slate-400 mt-1.5">
                    <span>Prescribed: {med.prescribedDate} by {med.prescribedBy}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">Pharmacy: {med.pharmacyStatus}</span>
                  </div>

                  {med.overrideReason && (
                    <p className="text-2xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-2.5 font-medium">
                      <strong>Clinical Override Note:</strong> {med.overrideReason}
                    </p>
                  )}

                  {med.discontinuedReason && (
                    <p className="text-2xs text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-200 mt-2.5 font-medium">
                      <strong>Discontinuation Reason:</strong> {med.discontinuedReason}
                    </p>
                  )}
                </div>
              </div>

              {med.status === 'Active' && (
                <button
                  onClick={() => handleDiscontinue(med.id, med.drugName)}
                  className="px-3.5 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition shrink-0 self-end sm:self-auto shadow-2xs"
                >
                  Discontinue Regimen
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Prescription Modal */}
      <NewPrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPrescribed={() => fetchData()}
        patients={patients}
      />
    </div>
  );
}
