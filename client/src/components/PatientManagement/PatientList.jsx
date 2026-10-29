import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, Filter, AlertTriangle, ShieldCheck, 
  ChevronRight, HeartPulse, Activity, Phone, Mail, Sparkles,
  Shield, User, Calendar
} from 'lucide-react';
import { api } from '../../api';
import PatientRegisterModal from './PatientRegisterModal';
import PatientDetailsModal from './PatientDetailsModal';

export default function PatientList({ externalRegisterOpen, onClearExternalRegister }) {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [quickFilter, setQuickFilter] = useState('all'); // all, allergies, chronic, active
  const [loading, setLoading] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (externalRegisterOpen) {
      setIsRegisterOpen(true);
      onClearExternalRegister?.();
    }
  }, [externalRegisterOpen, onClearExternalRegister]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.getPatients({ search: searchQuery, status: statusFilter });
      if (res.success) {
        setPatients(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch patients', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchQuery, statusFilter]);

  const handlePatientCreated = (newPat) => {
    fetchPatients();
    setSelectedPatient(newPat);
  };

  const filteredPatients = patients.filter(p => {
    if (quickFilter === 'allergies') return p.allergies?.length > 0;
    if (quickFilter === 'chronic') return p.chronicConditions?.length > 0;
    if (quickFilter === 'active') return p.status === 'Active';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Epic Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-2xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Epic 1 • Master Index
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Patient Demographics & 360 Records
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-normal">
              Enterprise Master Patient Index (EMPI), real-time insurance validation, documented allergy risk matrix, and surgical history logs.
            </p>
          </div>

          <button
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all transform active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Registered Patients</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <User className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{patients.length}</p>
          <div className="flex items-center gap-1.5 text-2xs text-teal-600 font-semibold mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>100% EMPI synchronized</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Documented Allergies</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">
            {patients.reduce((acc, p) => acc + (p.allergies?.length || 0), 0)}
          </p>
          <div className="flex items-center gap-1.5 text-2xs text-slate-400 font-medium mt-1">
            <span>CDS alerts active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Active Insurance</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {patients.filter(p => p.insurance?.status === 'Active').length}
          </p>
          <div className="flex items-center gap-1.5 text-2xs text-emerald-600 font-semibold mt-1">
            <span>Payer verification verified</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Chronic Care Cohorts</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <HeartPulse className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-2">
            {patients.filter(p => p.chronicConditions?.length > 0).length}
          </p>
          <div className="flex items-center gap-1.5 text-2xs text-indigo-600 font-semibold mt-1">
            <span>Hypertension & Diabetes</span>
          </div>
        </div>
      </div>

      {/* Search & Quick Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search patients by name, MRN (e.g. MRN-2026-8941), email, or chronic diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none shadow-2xs transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setQuickFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              quickFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All ({patients.length})
          </button>
          <button
            onClick={() => setQuickFilter('allergies')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              quickFilter === 'allergies'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Allergy Alerts
          </button>
          <button
            onClick={() => setQuickFilter('chronic')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              quickFilter === 'chronic'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Chronic Care
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none shadow-2xs"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Patients Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-2xs uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Patient & MRN</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Insurance Coverage</th>
                <th className="py-3.5 px-4">Allergies & CDS Risk</th>
                <th className="py-3.5 px-4">Primary Conditions</th>
                <th className="py-3.5 px-4 text-right">360 View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">Loading patient master index...</td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    No matching patient records found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((pat) => (
                  <tr 
                    key={pat.id} 
                    onClick={() => setSelectedPatient(pat)}
                    className="hover:bg-teal-50/40 transition-colors cursor-pointer group"
                  >
                    {/* Patient & MRN */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          {pat.firstName.charAt(0)}{pat.lastName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors block">
                            {pat.firstName} {pat.lastName}
                          </span>
                          <span className="text-2xs font-mono text-slate-400">
                            {pat.mrn} • <span className="text-teal-600 font-semibold">{pat.bloodGroup}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Demographics */}
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 font-medium">{pat.gender}, {pat.dob}</span>
                      <p className="text-2xs text-slate-400 mt-0.5">{pat.phone || 'No phone'}</p>
                    </td>

                    {/* Insurance */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">
                        {pat.insurance?.provider || 'Self-Pay'}
                      </span>
                      <span className="text-2xs text-slate-500">
                        {pat.insurance?.coverageType} • <span className="text-emerald-600 font-semibold">{pat.insurance?.status}</span>
                      </span>
                    </td>

                    {/* Allergies */}
                    <td className="py-3.5 px-4">
                      {pat.allergies && pat.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {pat.allergies.map((alg, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 text-2xs px-2 py-0.5 rounded-full font-semibold"
                            >
                              <AlertTriangle className="w-3 h-3 text-rose-500" />
                              {alg.allergen}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-700 text-2xs font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 w-fit">
                          <ShieldCheck className="w-3.5 h-3.5" /> NKDA (No Known Allergies)
                        </span>
                      )}
                    </td>

                    {/* Chronic Conditions */}
                    <td className="py-3.5 px-4">
                      {pat.chronicConditions && pat.chronicConditions.length > 0 ? (
                        <div className="space-y-0.5">
                          {pat.chronicConditions.slice(0, 2).map((c, i) => (
                            <span key={i} className="block text-2xs text-slate-700 truncate max-w-xs font-medium">
                              • {c.name}
                            </span>
                          ))}
                          {pat.chronicConditions.length > 2 && (
                            <span className="text-2xs text-slate-400">+{pat.chronicConditions.length - 2} more</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-2xs">None recorded</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                        <span>Details</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Modal */}
      <PatientRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onPatientCreated={handlePatientCreated}
      />

      {/* 360 Patient Details Modal */}
      <PatientDetailsModal
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
}
