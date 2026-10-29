# AuraHealth EHR (EHRS01 v2.0)
> **Next-Gen Electronic Health Record System & Patient Portal**  
> **Domain:** Healthcare and Pharma | **Interoperability:** HL7 v2.5.1 ER7 & HL7 FHIR Release 4 (R4)  
> **Managed by:** EdTech | **Project Manager:** Gaurav Kumar | **Architecture:** React 19 + Node.js / Express

---

## 🌟 What's New in this Copy & Redesigned Frontend

This project is an advanced, redesigned copy of the EHRS01 platform with a brand-new modern visual design language, authentication system, and enhanced user workflows:

1. **🔐 Full Role-Based Authentication & Login Portal (`/api/auth`)**:
   - Modern split-screen login page with healthcare security badges (HIPAA, 256-bit SSL, SOC2 Type II).
   - **1-Click Quick Demo Login buttons**: Log in instantly with a single click as:
     - 🩺 **Dr. Rachel Adams, MD** (`rachel.adams@hospital.org` / `doctor123`) — Chief Clinician
     - 🩻 **Dr. Marcus Chen, MD** (`marcus.chen@hospital.org` / `doctor123`) — Attending Radiologist
     - 💉 **Sarah Jenkins, RN** (`sarah.jenkins@hospital.org` / `nurse123`) — Triage Nurse Lead
     - 👤 **Eleanor Vance** (`eleanor.vance@example.com` / `patient123`) — Patient Portal (MRN-2026-8941)
     - 📊 **Gaurav Kumar** (`gaurav.kumar@edtech.org` / `admin123`) — Agile PM / Admin
   - Role-based redirection: Patient login automatically directs to their personal health portal; clinician logins open clinical workspaces.
   - Session persistence in `localStorage` + secure Logout & Quick Role switcher menu in the top bar.

2. **🎨 Brand-New Modern UI Theme ("AuraHealth EHR")**:
   - High-contrast Deep Slate & Emerald / Cyan / Royal Indigo palette with glassmorphism cards.
   - Redesigned top navigation with live system status badge, notifications bell with unread indicators, and a "+ New Action" quick menu (Register Patient, New SOAP Note, New CPOE Order, New Prescription).
   - **Global Command Palette (`Ctrl + K`)**: Instant search for patients, MRN numbers, medications, and one-click actions from anywhere.
   - Enhanced **Patient 360 view**, color-coded **SOAP documentation** cards, real-time **CDS Allergy Contraindication alerts**, and interactive **PACS Radiograph Viewer**.

---

## 🚀 How to Run the Application

### Option A: 1-Click Launch (Recommended)
Double-click `start.bat` in the root folder.  
It will start the server and automatically launch `http://localhost:5000` in your browser.

### Option B: Development Mode (Vite Hot-Reload)
Double-click `dev.bat` or run:
```bash
# Terminal 1: Backend API
cd server
npm start

# Terminal 2: Vite Dev Frontend
cd client
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🏥 Included Features & The 6 Epics

### 1. Epic 1: Patient Management & Master Patient Index (MPI)
- Master Patient Index with quick search, filters (Allergies, Chronic care cohorts), and new patient registration.
- Complete Patient 360 profile drawer with demographics, insurance policy verification, and surgical history.

### 2. Epic 2: Clinical Documentation & SOAP Notes
- Capture inpatient, outpatient, and telehealth consultations.
- Biometric vitals recording with dynamic BMI calculator.
- Structured 4-Quadrant SOAP notes: **S**ubjective, **O**bjective, **A**ssessment (with ICD-10), and **P**lan.

### 3. Epic 3: Computerized Provider Order Entry (CPOE) & PACS
- Order Lab panels (CBC, CMP-14, HbA1c, Lipid Panel, Urinalysis) and Imaging studies (Chest X-Ray, CT Brain, MRI).
- Priority triage (*Routine*, *Urgent*, *STAT* with pulsing alert).
- Integrated PACS Web Radiograph Viewer with contrast, brightness, and inversion controls.

### 4. Epic 4: Medication Management & E-Prescribing (e-Rx)
- e-Prescription engine with pharmacy network integration.
- Clinical Decision Support (CDS) engine detecting real-time cross-reactivity and allergies (e.g. Penicillin vs Amoxicillin).
- Emergency clinician override logging with documented justification.

### 5. Epic 5: HL7 & FHIR Interoperability Hub
- HL7 v2.5.1 gateway generating ER7 pipe messages (`ADT^A01`, `ADT^A08`, `ORU^R01`, `RDE^O11`).
- Built-in interactive HL7 ER7 message parser.
- HL7 FHIR Release 4 (R4) REST endpoints for Patients, Observations, and Bundles.

### 6. Epic 6: Agile Metrics & Patient Portal
- Real-time sprint progress, velocity burndown history, team structure, and agile tenets.
- Secure Patient Portal: Eleanor Vance's health summary, appointment booking, and direct messaging with physicians.
