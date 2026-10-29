import React, { useState, useEffect } from 'react';
import { 
  Network, Server, RefreshCw, CheckCircle2, Terminal, 
  Code2, ExternalLink, ArrowRight, Activity, Database, Check 
} from 'lucide-react';
import { api } from '../../api';

export default function InteroperabilityHub() {
  const [systems, setSystems] = useState([]);
  const [syncLogs, setSyncLogs] = useState([]);
  const [loadingSystems, setLoadingSystems] = useState(false);
  const [activeTab, setActiveTab] = useState('systems'); // systems, hl7, fhir

  // HL7 state
  const [hl7Type, setHl7Type] = useState('ADT_A01');
  const [rawHl7, setRawHl7] = useState('');
  const [parsedHl7, setParsedHl7] = useState(null);
  const [customHl7Input, setCustomHl7Input] = useState('');
  const [customParseResult, setCustomParseResult] = useState(null);

  // FHIR state
  const [fhirEndpoint, setFhirEndpoint] = useState('/Patient');
  const [fhirJson, setFhirJson] = useState(null);
  const [loadingFhir, setLoadingFhir] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');

  const fetchIntegrations = async () => {
    setLoadingSystems(true);
    try {
      const [sysRes, logRes] = await Promise.all([
        api.getIntegrations(),
        api.getSyncLogs()
      ]);
      if (sysRes.success) setSystems(sysRes.data);
      if (logRes.success) setSyncLogs(logRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSystems(false);
    }
  };

  const loadHl7Sample = async (type) => {
    setHl7Type(type);
    try {
      const res = await api.getHl7Sample(type);
      if (res.success) {
        setRawHl7(res.rawMessage);
        setParsedHl7(res.parsed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadFhirData = async (endpoint) => {
    setFhirEndpoint(endpoint);
    setLoadingFhir(true);
    try {
      const json = await api.getFhirResource(endpoint);
      setFhirJson(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFhir(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
    loadHl7Sample('ADT_A01');
    loadFhirData('/Patient');
  }, []);

  const handleTriggerSync = async (systemId) => {
    try {
      const res = await api.triggerSync(systemId);
      if (res.success) {
        setSyncNotice(`Sync handshake with ${systemId} completed successfully!`);
        setTimeout(() => setSyncNotice(''), 3000);
        fetchIntegrations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleParseCustomHL7 = async () => {
    if (!customHl7Input.trim()) return;
    try {
      const res = await api.parseHl7(customHl7Input);
      if (res.success) {
        setCustomParseResult(res.parsed);
      }
    } catch (e) {
      alert("Failed to parse HL7: " + e.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Epic Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-2xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Epic 5 • Interoperability
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                HL7 v2.5.1 & FHIR R4 Integration Gateway
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-normal">
              Bidirectional bridges for ER7 pipe-delimited HL7 messages (ADT, ORU, RDE), native HL7 parser, and standard FHIR R4 JSON REST endpoints.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80">
            <button
              onClick={() => setActiveTab('systems')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'systems' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              System Connectors
            </button>
            <button
              onClick={() => setActiveTab('hl7')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hl7' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              HL7 v2 Gateway
            </button>
            <button
              onClick={() => setActiveTab('fhir')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fhir' ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              FHIR R4 REST API
            </button>
          </div>
        </div>

        {syncNotice && (
          <div className="mt-4 p-3 bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{syncNotice}</span>
          </div>
        )}
      </div>

      {/* TAB 1: SYSTEM CONNECTORS */}
      {activeTab === 'systems' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systems.map((sys) => (
              <div key={sys.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{sys.name}</span>
                      <span className="text-2xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {sys.id}
                      </span>
                    </div>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">{sys.protocol}</p>
                  </div>

                  <span className="flex items-center gap-1 text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {sys.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs font-mono text-slate-600 break-all">
                  Endpoint: {sys.endpoint}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-2xs text-slate-400 block">Roundtrip Latency</span>
                    <span className="font-bold text-slate-800">{sys.latencyMs} ms</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-2xs text-slate-400 block">Total Records</span>
                    <span className="font-bold text-slate-800">{sys.syncRecords}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-2xs text-slate-400 block">Last Sync Time</span>
                    <span className="font-bold text-slate-800 text-2xs">
                      {new Date(sys.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerSync(sys.id)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Test Handshake & Trigger Sync
                </button>
              </div>
            ))}
          </div>

          {/* Real-time Sync Event Log */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-2xs">
                Real-Time Integration Event Log
              </span>
              <span className="text-slate-400">{syncLogs.length} events logged</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
              {syncLogs.map((log) => (
                <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                      {log.system}
                    </span>
                    <span className="text-slate-800 font-medium">{log.event}</span>
                  </div>
                  <span className="text-2xs text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HL7 V2 GATEWAY */}
      {activeTab === 'hl7' && (
        <div className="space-y-6">
          {/* HL7 Sample Message Generator */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">HL7 v2.5.1 Message Generator & Dissector</h3>
                <p className="text-xs text-slate-500">Industry standard pipe-delimited healthcare transactions</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'ADT_A01', label: 'ADT^A01 (Admit / Visit)' },
                  { id: 'ADT_A08', label: 'ADT^A08 (Patient Update)' },
                  { id: 'ORU_R01', label: 'ORU^R01 (Lab Result)' },
                  { id: 'RDE_O11', label: 'RDE^O11 (Pharmacy Order)' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => loadHl7Sample(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      hl7Type === m.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Raw Message Display */}
            <div className="bg-slate-950 text-slate-100 rounded-xl overflow-hidden font-mono text-xs border border-slate-800">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-slate-400 text-2xs flex justify-between">
                <span>RAW PIPE-DELIMITED HL7 v2.5.1 ENCODED STRING</span>
                <span className="text-emerald-400">STATUS: VALID ER7</span>
              </div>
              <pre className="p-4 overflow-x-auto text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {rawHl7}
              </pre>
            </div>

            {/* Segment Breakdown */}
            {parsedHl7 && parsedHl7.segments && (
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider text-2xs block mb-2">
                  Segment Dissector & Extracted Clinical Entities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {parsedHl7.segments.map((seg, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="font-bold text-blue-700 font-mono text-sm">{seg.segment}</span>
                      <p className="text-2xs text-slate-500 mt-1">{seg.fields.length} Fields parsed</p>
                      <p className="text-2xs text-slate-700 font-mono truncate mt-0.5">{seg.fields.join('|')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive HL7 Custom Parser */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">HL7 Live Parsing Tool</h3>
            <p className="text-xs text-slate-500">Paste any external HL7 message string to test the parser engine</p>
            <textarea
              rows="4"
              value={customHl7Input}
              onChange={(e) => setCustomHl7Input(e.target.value)}
              placeholder="Paste raw HL7 string here (e.g. MSH|^~\&|EXT_SYS...)..."
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleParseCustomHL7}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition"
            >
              Parse HL7 Segments
            </button>

            {customParseResult && (
              <pre className="p-4 bg-slate-900 text-blue-300 rounded-xl text-xs font-mono overflow-x-auto max-h-60">
                {JSON.stringify(customParseResult, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FHIR R4 REST API EXPLORER */}
      {activeTab === 'fhir' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">HL7 FHIR Release 4 (R4) REST Explorer</h3>
                <p className="text-xs text-slate-500">Standard REST API endpoints serving application/fhir+json</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { path: '/Patient', label: 'GET /Patient' },
                  { path: '/Observation', label: 'GET /Observation' },
                  { path: '/MedicationRequest', label: 'GET /MedicationRequest' },
                  { path: '/DiagnosticReport', label: 'GET /DiagnosticReport' },
                  { path: '/$everything', label: 'GET /$everything' },
                  { path: '/metadata', label: 'GET /metadata (Capability)' }
                ].map(ep => (
                  <button
                    key={ep.path}
                    onClick={() => loadFhirData(ep.path)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                      fhirEndpoint === ep.path ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {ep.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active URL bar */}
            <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono">
              <span className="font-bold text-emerald-700">GET</span>
              <span className="text-slate-700">http://localhost:5000/api/fhir{fhirEndpoint}</span>
              <span className="ml-auto text-2xs text-slate-400">FHIR R4 JSON</span>
            </div>

            {/* JSON Output Viewer */}
            <div className="bg-slate-950 text-slate-100 rounded-xl overflow-hidden font-mono text-xs border border-slate-800">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 text-slate-400 text-2xs flex justify-between">
                <span>FHIR RESOURCE RESPONSE</span>
                <span className="text-blue-400">
                  {fhirJson?.resourceType || 'Resource'} ({fhirJson?.total ? `${fhirJson.total} entries` : 'Single'})
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-blue-300 max-h-96 overflow-y-auto leading-relaxed">
                {loadingFhir ? 'Querying FHIR server...' : JSON.stringify(fhirJson, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
