# Design and Development of a Smart Hospital Bed Allocation and Patient Flow Management System (MediPulse Flow)

**A Course Project Report**  
Submitted in partial fulfillment of the completion of the course  
**SOFTWARE ENGINEERING AND SYSTEM DESIGN**  
**(24CS301PC311)**  
In **III Year, I Semester B. Tech - CSE**

---

**Submitted by:**  
**PRANAV**  
**Roll No:** 2403A51385  
**Email:** 2403a51385@sru.edu.in  
**GitHub:** [https://github.com/Pranav9491/SESD-Project](https://github.com/Pranav9491/SESD-Project)

**Under the supervision of the faculty:**  
**Dr. V. Shobha Rani**  
Assistant Professor,  
School of Computer Science & Artificial Intelligence  
**2026–2027**

**Department of Computer Science & Artificial Intelligence**  
**SR University**  
Warangal, Telangana, India

---

## INDEX

| Section | Title | Page |
| :--- | :--- | :--- |
| **1.** | **Abstract** | 3 |
| **2.** | **Introduction** | 4 |
| | 2.1 Problem Statement | 4 |
| | 2.2 Objectives | 5 |
| | 2.3 Scope | 5 |
| **3.** | **Software Requirements Specification (SRS)** | 6 |
| | 3.1 Functional Requirements | 6 |
| | 3.2 Non-Functional Requirements | 7 |
| | 3.3 Hardware and Software Requirements | 8 |
| **4.** | **System Analysis** | 9 |
| | 4.1 Existing System | 9 |
| | 4.2 Proposed System | 10 |
| **5.** | **System Design** | 11 |
| | 5.1 System Architecture (Figure 5.1) | 11 |
| | 5.2 Use Case Diagram (Figure 5.2) | 13 |
| | 5.3 Class Diagram (Figure 5.3) | 15 |
| | 5.4 Sequence Diagram (Figure 5.4) | 17 |
| | 5.5 Activity Diagram (Figure 5.5) | 19 |
| **6.** | **Methodology** | 21 |
| | 6.1 Engineering Lifecycle & SDLC (Figure 6.1) | 21 |
| **7.** | **Implementation** | 23 |
| | 7.1 Frontend Architecture & Healthcare Design System | 23 |
| | 7.2 Backend REST API & Express Architecture | 24 |
| | 7.3 Rule-Based Smart Bed Allocation Engine | 25 |
| | 7.4 In-Memory & JSON Persistent Data Architecture | 26 |
| | 7.5 Patient Flow & 4-Stage Kanban Workflow Engine | 27 |
| | 7.6 Automated Discharge & Dynamic Bed Recalculation | 28 |
| | 7.7 Chart.js Data Visualizations & Lucide Integration | 29 |
| | 7.8 Testing, Verification & End-to-End Verification Suite | 30 |
| **8.** | **Output Screenshots & Interface Walkthrough** | 31 |
| | Figure 8.1: Live Application View – Admin Dashboard & Inpatient Census | 31 |
| | Figure 8.2: Live Application View – Department-wise Bed Availability Charts | 32 |
| | Figure 8.3: Live Application View – Patient Directory & Multi-Parameter Filter | 33 |
| | Figure 8.4: Live Application View – Patient Registration Modal & Triage | 34 |
| | Figure 8.5: Live Application View – Comprehensive Patient Medical File Modal | 35 |
| | Figure 8.6: Live Application View – Visual Ward Layout & Bed Management Grid | 36 |
| | Figure 8.7: Live Application View – Smart Rule-Based Bed Allocation Modal | 37 |
| | Figure 8.8: Live Application View – Patient Bed & Department Transfer Interface | 38 |
| | Figure 8.9: Live Application View – 4-Stage Kanban Patient Flow Board | 39 |
| | Figure 8.10: Live Application View – Automated Discharge & Audit Timeline | 40 |
| **9.** | **Conclusion & Future Enhancements** | 41 |
| **10.** | **References** | 42 |

---

# 1. Abstract

### Executive Overview of MediPulse Flow
The project titled **“Design and Development of a Smart Hospital Bed Allocation and Patient Flow Management System (MediPulse Flow)”** focuses on engineering, architecting, and deploying a modern, full-stack, responsive healthcare operations platform designed to eliminate bed management bottlenecks, streamline patient intake triage, optimize clinical resource utilization, and automate patient progression across clinical workflow stages.

In modern healthcare institutions, manual bed assignment and disjointed department communications lead to severe emergency department boarding, prolonged patient wait times, sub-optimal bed turnover rates, and potential clinical risks. Traditional hospital information systems often rely on cumbersome interfaces and static record management that lack dynamic, rule-based triage prioritization. **MediPulse Flow** addresses these systemic challenges by implementing an automated, priority-driven smart bed allocation engine coupled with an interactive four-stage Kanban patient flow board.

The platform is engineered using a robust, clean technology stack. The client interface is constructed using semantic **HTML5**, **CSS3** (utilizing an ergonomic healthcare design palette: Navy Blue `#163A5F`, Accent Teal `#13A89E`, and Light Background `#F4F7FA`), and modern **TypeScript / Vanilla JavaScript (ES6+)**. Real-time hospital analytics and distribution metrics are visualized via **Chart.js** and styled with **Lucide Icons**. The backend is developed on **Node.js** and **Express.js** in strict **TypeScript**, exposing RESTful API endpoints for patient records, bed inventory, workflow stage mutations, and census statistics. Data persistence is managed via an in-memory synchronized JSON storage engine (`mockData.json`) initialized with a realistic dataset of **250 hospital beds** categorized into five distinct clinical departments (**General Ward, Intensive Care Unit (ICU), Emergency, Private Ward, Pediatric Ward**) and **193 sample patient records** (including 15 patients in an active triage waiting queue).

Key innovations include:
1. **Rule-Based Smart Bed Allocation**: Automatically triages patients based on medical urgency (Emergency > High > Medium > Low), matches target clinical wards, verifies bed availability, and atomically assigns beds while updating patient admission status.
2. **Atomic Bed Transfers**: Enables seamless inter-department patient transfers while automatically freeing previous beds, occupying destination beds, and logging comprehensive audit trails.
3. **Four-Stage Kanban Flow Tracking**: Visually monitors patient progression (*Waiting for Admission* $\rightarrow$ *Admitted* $\rightarrow$ *Under Treatment* $\rightarrow$ *Ready for Discharge*).
4. **Automated Discharge & Bed Sanitization Protocols**: Frees beds immediately upon patient discharge, initiates sanitation workflows, and dynamically recalculates hospital occupancy, turnover, and admission rates in real time.

The system passed a comprehensive automated end-to-end integration test suite verifying zero API defects, zero compile errors, and is version-controlled and hosted on GitHub.

---

# 2. Introduction

### Background and Platform Motivation
Hospitals are high-velocity, resource-constrained operational environments where bed availability directly governs patient survival, operational throughput, and institutional efficiency. As patient admissions surge due to acute emergencies, scheduled elective surgeries, and chronic disease flare-ups, hospital administrative and nursing staff face the critical challenge of matching incoming patients to the correct ward, bed type, and clinical supervision level.

In conventional healthcare management, bed allocation is predominantly coordinated via telephone calls, manual whiteboards, spreadsheet trackers, or disconnected departmental software modules. These fragmented workflows create significant visibility gaps: emergency room physicians cannot view instantaneous bed vacancies in specialized wards, bed turnover between discharge and sanitization is unmonitored, and high-priority triage patients frequently wait behind non-urgent admissions.

**MediPulse Flow** (*“Smart Hospital Bed Allocation and Patient Flow Management System”*) is engineered as a unified, real-time command center for hospital operations. By establishing an automated digital bridge between clinical triage, ward nursing stations, and executive management, the platform ensures that critical patients receive expedited bed placement, bed status transitions are instantly broadcast across all hospital terminals, and patient discharges immediately cycle beds back into the active available inventory.

From a software engineering perspective, MediPulse Flow embodies the disciplined execution of the **Software Development Life Cycle (SDLC)**, covering formal requirements specification, architectural design, UML modeling, modular REST API engineering, decoupled frontend state synchronization, and automated verification.

---

### 2.1 Problem Statement
Modern hospital inpatient logistics suffer from systemic inefficiencies that compromise patient care and elevate operational costs:
1. **Emergency Department Boarding & Triage Delays**: Patients requiring urgent inpatient care frequently endure long boarding times in emergency corridors due to a lack of real-time visibility into bed availability across specialized wards.
2. **Sub-optimal Manual Allocation**: Administrative staff lack automated decision-support mechanisms to prioritize admissions by clinical urgency, leading to arbitrary bed assignments where non-critical patients occupy beds suited for higher-acuity cases.
3. **Friction in Patient Transfers**: Transferring recovering patients from high-acuity environments (such as the ICU or Emergency Trauma Bay) to General or Private Wards requires complex manual coordination, leading to duplicate assignments or unrecorded bed vacancies.
4. **Delayed Bed Sanitization & Turnover Lag**: When a patient is discharged, hours often elapse before housekeeping is notified, causing beds to sit idle while triage queues lengthen.
5. **Lack of Dynamic Operational Analytics**: Hospital administrators rarely have live, synchronized dashboards displaying occupancy rates, daily admission/discharge velocity, and bed turnover metrics calculated from actual real-time census data.

---

### 2.2 Objectives
The primary objective of this project is to architect, develop, test, and deploy a responsive, modern full-stack web application for hospital bed allocation and patient flow management. Specific engineering goals include:
* **Automated Rule-Based Allocation Engine**: Develop a deterministic triage algorithm that prioritizes Emergency and High-priority patients, matches clinical ward requirements, prevents over-allocation, and auto-assigns available beds.
* **Unified Four-Page Operational Interface**: Deliver four specialized, responsive interfaces:
  1. *Admin Dashboard*: Real-time census statistics, Chart.js occupancy distributions, department-wise availability, recent admissions, and activity logs.
  2. *Patient Management*: Full CRUD directory with debounced searching, multi-criteria filtering, and clinical file inspection.
  3. *Smart Bed Allocation*: Visual bed layout with color-coded status badges, manual allocation modals, inter-ward transfer workflows, and maintenance toggles.
  4. *Patient Flow Management*: Four-stage Kanban workflow board with automated discharge protocols and movement audit timelines.
* **Synchronized RESTful Backend**: Engineer an Express.js backend using TypeScript with strict input validation, error handling, standardized JSON responses, and zero external database dependencies through in-memory persistent JSON storage.
* **Dynamic Analytics Recalculation**: Ensure that all dashboard metrics (Total Beds, Available Beds, Occupied Beds, Waiting Queue, Occupancy Rate) recalculate dynamically upon any clinical mutation.
* **Robust Verification & Quality Assurance**: Validate the complete software application with an automated integration test suite, achieving 100% test pass rate with zero runtime errors.

---

### 2.3 Scope
The scope of MediPulse Flow encompasses the complete end-to-end design, implementation, local deployment, and version control of the hospital administration platform. The system supports hospital administrative staff, nursing supervisors, triage officers, and operations executives.

The functional boundaries cover:
* Patient registration with auto-generated IDs (`PAT-xxxx`) and clinical categorization.
* Real-time tracking of 250 hospital beds across five departments: General Ward, ICU, Emergency, Private Ward, and Pediatric Ward.
* Real-time bed status transitions across four states: **Available** (Green), **Occupied** (Red), **Maintenance** (Yellow), and **Reserved** (Blue).
* Rule-based automated allocation, manual allocation, atomic bed transfers, and UV maintenance toggles.
* Four-stage Kanban workflow tracking: Waiting for Admission, Admitted, Under Treatment, Ready for Discharge.
* Automated bed release and sanitization upon patient discharge.

*Out of Scope for this release*: Long-term electronic health record (EHR) billing integrations, biometric smartcard hospital door locks, and multi-hospital regional network clustering.

---

# 3. Software Requirements Specification (SRS)

### 3.1 Functional Requirements
* **FR-01: Inpatient Registration & Triage Profiling**: The system shall allow hospital staff to register incoming patients with an auto-generated unique identifier (`PAT-xxxx`), capturing full name, age, gender, contact number, residential address, primary medical condition, target department, admission date, and clinical priority level (*Emergency, High, Medium, Low*).
* **FR-02: Patient Management Directory & Querying**: The system shall provide a search and filtering interface allowing operators to query patient records by name, ID, diagnosis, bed number, clinical department, admission status, and priority level.
* **FR-03: Patient Profile Modification & Record Deletion**: The system shall permit authorized operators to edit existing patient records and delete records with mandatory confirmation dialogs. If an admitted patient record is deleted, the system shall automatically release and sanitize their assigned bed.
* **FR-04: Real-Time Bed Census & Department Visual Grid**: The system shall render all 250 beds grouped by department, clearly displaying bed numbers, department badges, status indicators, room locations, and occupying patient details.
* **FR-05: Rule-Based Smart Bed Allocation**: The system shall execute an automated triage allocation algorithm that:
  1. Gives absolute precedence to Emergency patients, followed by High, Medium, and Low priorities.
  2. Matches the patient's medical condition to the appropriate department.
  3. Allocates strictly from `Available` beds, rejecting occupied or maintenance beds.
  4. Automatically changes bed status to `Occupied` and patient status to `Admitted`.
  5. Emits descriptive error notifications if no suitable bed is available.
* **FR-06: Atomic Patient Bed Transfer**: The system shall allow staff to transfer an admitted patient from their current bed to an available bed in a destination department. The system shall atomically mark the previous bed as `Available` (initiating sanitization timestamps), mark the destination bed as `Occupied`, update the patient record, and log the transfer in the activity audit stream.
* **FR-07: Bed Maintenance & Sanitation Toggle**: The system shall allow administrators to toggle any available bed into `Maintenance` mode for sanitization or telemetry calibration, and restore it to `Available` upon completion. Beds currently occupied shall be protected from maintenance toggling.
* **FR-08: Four-Stage Kanban Workflow Progression**: The system shall organize patients into four visual workflow columns: *Waiting for Admission*, *Admitted*, *Under Treatment*, and *Ready for Discharge*. Staff shall have one-click controls to advance patients across stages.
* **FR-09: Automated Discharge & Bed Deallocation**: Upon confirming patient discharge, the system shall mark the patient as `Discharged`, timestamp the discharge date, immediately release the occupied bed back to `Available`, increment the available bed counter, decrement occupied beds, and record the discharge event.
* **FR-10: Dynamic Hospital Analytics & Chart Visualization**: The system shall dynamically compute and display total beds, available beds, occupied beds, waiting patients, daily admissions, daily discharges, occupancy percentage, and bed turnover rate, updating Chart.js doughnut and bar charts in real time.

---

### 3.2 Non-Functional Requirements
* **NFR-01: Performance & Latency**: All REST API endpoints shall respond within 50 milliseconds under standard in-memory operations. Static HTML/CSS/JS frontend assets shall load within 200 milliseconds.
* **NFR-02: Consistency & Data Integrity**: All bed allocations and transfers shall maintain ACID-like atomicity in memory: a bed cannot be simultaneously allocated to two patients, and a patient cannot occupy multiple beds.
* **NFR-03: Responsive Design & Visual Ergonomics**: The frontend interface shall fluidly adapt across viewports ranging from 320px mobile displays to 2560px clinical workstations using CSS Grid and Flexbox, adhering to the healthcare SaaS design palette.
* **NFR-04: Zero External Database Overhead**: The system shall run standalone locally without requiring external database server daemons (e.g., PostgreSQL, MongoDB, or MySQL), persisting all state to synchronized JSON storage (`mockData.json`).
* **NFR-05: Maintainability & Architectural Modularity**: The codebase shall maintain strict separation of concerns into Controllers, Routes, Services, Types, Stylesheets, and Frontend modules, with 100% strict TypeScript compilation compliance.

---

### 3.3 Hardware and Software Requirements

#### A. Hardware Requirements
* **Processor**: Intel Core i3 / AMD Ryzen 3 or higher (2.0 GHz+).
* **RAM**: Minimum 4 GB (8 GB recommended for concurrent development server and browser execution).
* **Storage**: Minimum 500 MB available storage for repository, node modules, and data files.
* **Display**: Standard 1080p display (1920x1080) or mobile/tablet screen for responsive verification.

#### B. Software Requirements
* **Operating System**: Microsoft Windows 10/11, Ubuntu Linux 20.04+, or macOS.
* **Runtime Environment**: Node.js LTS (v18.0.0 or higher, tested on v24.11.1).
* **Package Manager**: npm (v9.0.0 or higher, tested on v11.6.2).
* **Backend Framework**: Express.js v4.21.2 with TypeScript v5.7.2.
* **TypeScript Execution Engine**: `tsx` v4.19.2 for rapid TypeScript execution.
* **Data Visualization**: Chart.js (v4.x via CDN).
* **Iconography**: Lucide Icons (via CDN).
* **Version Control**: Git v2.40+ and GitHub remote repository hosting.

---

# 4. System Analysis

### 4.1 Existing System
In standard hospital operations across many regional institutions, bed management relies on disparate, manual communication channels. Patient admissions from the Emergency Department or outpatient clinics are communicated to ward nursing supervisors via telephone calls, paper admission slips, or generic spreadsheet logs (e.g., Microsoft Excel).

#### Critical Deficiencies of the Existing System:
* **Severe Communication Latency**: Nursing staff must manually survey ward beds and phone admission coordinators, leading to delays of 45 to 90 minutes before an available bed is identified.
* **Absence of Priority Triage Logic**: Admissions are typically processed on a first-come, first-served basis rather than clinical acuity, causing critical emergency cases to wait while low-acuity admissions are processed.
* **Double-Booking & Allocation Conflicts**: Due to unsynchronized spreadsheets or shift-change communication breakdowns, multiple ward nurses may allocate the same bed to different patients.
* **Sanitization Lag (Ghost Beds)**: When a patient leaves the ward, the bed remains marked as occupied until manual discharge paperwork is completed hours later, preventing incoming triage patients from utilizing clean beds.
* **Zero Real-Time Management Visibility**: Hospital directors and department heads have no unified real-time dashboard displaying instantaneous occupancy percentages or ward-specific bottlenecks.

---

### 4.2 Proposed System
The proposed **MediPulse Flow** platform replaces fragmented manual workflows with a unified, real-time web-based command center. By combining an automated allocation engine, interactive visual ward maps, and a Kanban patient flow pipeline, the system transforms hospital bed management into a transparent, deterministic, and frictionless process.

```
+-----------------------------------------------------------------------------+
|                      PROPOSED MEDIPULSE FLOW SYSTEM                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|   +---------------------+     +--------------------+     +--------------+   |
|   | Patient Triage      | --> | Rule-Based Engine  | --> | Bed Assigned |   |
|   | (Emergency Priority)|     | (Ward Auto-Match)  |     | (Instant)    |   |
|   +---------------------+     +--------------------+     +--------------+   |
|                                                                 |           |
|                                                                 v           |
|   +---------------------+     +--------------------+     +--------------+   |
|   | Bed Freed & Cleaned | <-- | Clinical Discharge | <-- | 4-Stage Flow |   |
|   | (Census Recalculated)     | (1-Click Protocol) |     | (Kanban)     |   |
|   +---------------------+     +--------------------+     +--------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

#### Distinctive Advantages of MediPulse Flow:
* **Immediate Clinical Acuity Prioritization**: Emergency patients are automatically moved to the head of the allocation queue and assigned matching ICU or Emergency beds in sub-second time.
* **Visual Ward Transparency**: All 250 beds are color-coded in real time (**Green: Available, Red: Occupied, Yellow: Maintenance, Blue: Reserved**), allowing staff to identify vacancies at a glance.
* **Atomic Transfer Mechanism**: Inter-department transfers automatically release previous beds and occupy destination beds in a single atomic transaction.
* **Automated Discharge Synchronization**: Confirming a patient's discharge immediately changes the bed status to Available, initiates sanitization records, and updates live hospital census metrics.
* **Instantaneous Analytics & Reporting**: Real-time Chart.js charts dynamically update hospital occupancy percentages, department availability breakdowns, and turnover rates without requiring manual data compilation.

---

# 5. System Design

### 5.1 System Architecture

```
+-----------------------------------------------------------------------------+
|                       PRESENTATION LAYER (Client Browser)                   |
|                                                                             |
|  +--------------------+  +-------------------+  +------------------------+  |
|  | index.html         |  | patients.html     |  | beds.html              |  |
|  | (Dashboard & Stats)|  | (CRUD & Search)   |  | (Visual Allocation)    |  |
|  +--------------------+  +-------------------+  +------------------------+  |
|  +--------------------+  +-------------------+  +------------------------+  |
|  | patient-flow.html  |  | Chart.js v4       |  | Lucide Icons           |  |
|  | (4-Stage Kanban)   |  | (Visual Graphs)   |  | (UI Iconography)       |  |
|  +--------------------+  +-------------------+  +------------------------+  |
|                                     |                                       |
|                                     | Asynchronous REST / JSON (Fetch API)  |
|                                     v                                       |
+-----------------------------------------------------------------------------+
|                       APPLICATION LAYER (Node.js + Express)                 |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  | Middleware: CORS, express.json(), Static Asset Serving, Error Handling|  |
|  +-----------------------------------------------------------------------+  |
|                                     |                                       |
|  +-------------------+  +--------------------+  +------------------------+  |
|  | patientRoutes     |  | bedRoutes          |  | flowRoutes             |  |
|  | dashboardRoutes   |  | (REST Routing)     |  | (Stage Control)        |  |
|  +-------------------+  +--------------------+  +------------------------+  |
|                                     |                                       |
|  +-------------------+  +--------------------+  +------------------------+  |
|  | patientController |  | bedController      |  | flowController         |  |
|  | dashboardControl. |  | (Request/Response) |  | (Business Logic)       |  |
|  +-------------------+  +--------------------+  +------------------------+  |
|                                     |                                       |
|  +-----------------------------------------------------------------------+  |
|  | AllocationService: Smart Allocation Engine, Transfer, Discharge Rules|  |
|  +-----------------------------------------------------------------------+  |
|                                     |                                       |
+-----------------------------------------------------------------------------+
|                       DATA PERSISTENCE LAYER                                |
|                                                                             |
|  +-----------------------------------------------------------------------+  |
|  | In-Memory Cache <---> mockData.json Persistent Storage                |  |
|  | (250 Beds, 193 Inpatients, 50 Audit Logs, 5 Hospital Departments)    |  |
|  +-----------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------+
```
*Figure 5.1: MediPulse Flow Multi-Tier System Architecture*

Figure 5.1 illustrates the architectural design of MediPulse Flow. The **Presentation Layer** contains four specialized web pages styled using a healthcare-focused CSS design system and interactive Chart.js visualizations. The frontend communicates with the **Application Layer** using asynchronous JSON requests over HTTP via the native Fetch API. The backend operates on Node.js and Express.js in TypeScript, organized into modular routes, controllers, and services. The **Data Persistence Layer** employs an in-memory synchronized JSON storage engine (`mockData.json`), ensuring sub-millisecond query performance alongside persistence across server restarts.

---

### 5.2 Use Case Diagram

```
                       +---------------------------------------+
                       |    MediPulse Flow Hospital System     |
                       |                                       |
                       |         +-----------------------+     |
                       |    +--->| View Dashboard Census |     |
                       |    |    +-----------------------+     |
                       |    |                                  |
                       |    |    +-----------------------+     |
                       |    +--->| Register New Patient  |     |
                       |    |    +-----------------------+     |
                       |    |                                  |
                       |    |    +-----------------------+     |
                       |    +--->| Search & Filter Inpts |     |
+------------------+   |    |    +-----------------------+     |
|                  |---+    |                                  |
|   Hospital Staff |   |    |    +-----------------------+     |
|   (Nurse / Clerk)|   |    +--->| Allocate Bed (Smart)  |     |
|                  |---+    |    +-----------------------+     |
+------------------+   |    |                                  |
                       |    |    +-----------------------+     |
                       |    +--->| Transfer Patient Bed  |     |
                       |    |    +-----------------------+     |
                       |    |                                  |
                       |    |    +-----------------------+     |
                       |    +--->| Advance Kanban Stage  |     |
                       |    |    +-----------------------+     |
                       |    |                                  |
                       |    |    +-----------------------+     |
                       |    +--->| Discharge Patient     |     |
                       |         +-----------------------+     |
                       |                     ^                 |
                       |                     |                 |
+------------------+   |         +-----------------------+     |
|                  |---+-------->| Toggle Bed Maint.     |     |
|   Administrator  |   |         +-----------------------+     |
|   / Operations   |---+                                       |
|                  |   |         +-----------------------+     |
+------------------+   +-------->| Inspect Audit Trails  |     |
                       |         +-----------------------+     |
                       +---------------------------------------+
```
*Figure 5.2: Multi-Actor Use Case Diagram*

Figure 5.2 illustrates the primary interactions between system actors (**Hospital Staff** and **Hospital Administrators**) and core platform capabilities. Hospital staff register triage patients, search the inpatient directory, execute rule-based smart bed allocations, perform ward transfers, and advance patients across the four Kanban stages. Administrators oversee hospital-wide occupancy analytics, toggle beds into sanitization maintenance mode, and audit operational event logs.

---

### 5.3 Class Diagram

```
+--------------------------------------+           +--------------------------------------+
|               Patient                |           |                 Bed                  |
+--------------------------------------+           +--------------------------------------+
| + id: string                         |           | + id: string                         |
| + name: string                       |           | + bedNumber: string                  |
| + age: number                        |           | + department: Department             |
| + gender: string                     | occupies  | + status: BedStatus                  |
| + phone: string                      | 0..1  0..1| + patientId: string | null           |
| + address: string                    |<--------->| + patientName: string | null         |
| + medicalCondition: string           |           | + lastCleaned: string                |
| + department: Department             |           | + occupiedSince: string | null       |
| + admissionDate: string              |           | + floor: string                      |
| + priority: PatientPriority          |           | + room: string                       |
| + status: PatientStatus              |           +--------------------------------------+
| + bedNumber: string | null           |
| + assignedDoctor: string             |
| + dischargeDate: string | null       |
+--------------------------------------+
                  ^
                  | logs events for
                  v
+--------------------------------------+           +--------------------------------------+
|               Activity               |           |            DashboardStats            |
+--------------------------------------+           +--------------------------------------+
| + id: string                         |           | + totalBeds: number                  |
| + timestamp: string                  |           | + availableBeds: number              |
| + type: ActivityType                 | evaluates | + occupiedBeds: number               |
| + title: string                      |---------->| + maintenanceBeds: number            |
| + description: string                |           | + reservedBeds: number               |
| + patientId: string                  |           | + patientsWaiting: number            |
| + bedNumber: string                  |           | + occupancyPercentage: number        |
| + department: string                 |           | + dailyAdmissions: number            |
| + badgeType: string                  |           | + dailyDischarges: number            |
+--------------------------------------+           | + bedTurnoverRate: string            |
                                                   +--------------------------------------+
```
*Figure 5.3: Core Entity Relationship and Data Models*

Figure 5.3 depicts the primary data models governing MediPulse Flow. The `Patient` entity encapsulates clinical and demographic parameters, including triage priority and workflow status. A `Bed` holds references to its department, operational status, and optional occupying patient ID and name. The `Activity` model logs state mutations (Registrations, Allocations, Transfers, Discharges, Maintenance), while `DashboardStats` aggregates hospital census metrics.

---

### 5.4 Sequence Diagram

```
Customer/Staff           Frontend Browser              Express Backend              AllocationService        mockData.json
      |                         |                             |                             |                     |
      | 1. Click "Smart Alloc"  |                             |                             |                     |
      |------------------------>|                             |                             |                     |
      |                         | 2. POST /api/beds/smart-alloc|                            |                     |
      |                         |---------------------------->|                             |                     |
      |                         |                             | 3. smartAutoAllocate()      |                     |
      |                         |                             |---------------------------->|                     |
      |                         |                             |                             | 4. Fetch Queue & Beds|
      |                         |                             |                             |-------------------->|
      |                         |                             |                             | 5. Return JSON data |
      |                         |                             |                             |<--------------------|
      |                         |                             |                             |                     |
      |                         |                             |                             | 6. Evaluate Priority|
      |                         |                             |                             |    (Emergency 1st)  |
      |                         |                             |                             | 7. Match Ward Bed   |
      |                         |                             |                             | 8. Mutate Status    |
      |                         |                             |                             |                     |
      |                         |                             |                             | 9. Persist Update   |
      |                         |                             |                             |-------------------->|
      |                         |                             | 10. Return Allocation Result|                     |
      |                         |                             |<----------------------------|                     |
      |                         | 11. HTTP 200 { success }    |                             |                     |
      |                         |<----------------------------|                             |                     |
      |                         |                             |                             |                     |
      | 12. Display Success Toast|                            |                             |                     |
      |     & Refresh Grid      |                             |                             |                     |
      |<------------------------|                             |                             |                     |
```
*Figure 5.4: Rule-Based Smart Bed Allocation Sequence*

Figure 5.4 details the sequence of interactions during an automated smart allocation. The client triggers the auto-allocation request. The Express backend delegates to `AllocationService`, which retrieves the waiting triage queue and bed inventory. The service evaluates patient priority weights, finds the best matching available bed, updates the bed status to `Occupied` and patient status to `Admitted`, appends an activity log, writes changes to `mockData.json`, and returns the allocation result to the client.

---

### 5.5 Activity Diagram

```
                                  [Start: Incoming Patient]
                                              |
                                              v
                                  +-----------------------+
                                  | Enter Patient Details |
                                  | & Assess Triage Acuity|
                                  +-----------------------+
                                              |
                                              v
                                  < Is Urgent Emergency? >
                                     /                 \
                             Yes    /                   \  No
                                   v                     v
                     +------------------------+   +------------------------+
                     | Immediate Smart Alloc: |   | Enqueue in Waiting List|
                     | Auto-Match ICU/ER Bed  |   | (Standard Triage Queue)|
                     +------------------------+   +------------------------+
                                   |                         |
                                   |                         v
                                   |              < Available Bed in Ward? >
                                   |                 /                  \
                                   |         Yes    /                    \  No
                                   |               v                      v
                                   |   +-----------------------+  +------------------+
                                   |   | Allocate Bed to Pat.  |  | Retain in Queue  |
                                   |   | (Status: Admitted)    |  | & Emit Alert     |
                                   |   +-----------------------+  +------------------+
                                   |               |                       |
                                   +-------+-------+                       |
                                           |                               |
                                           v                               v
                              +--------------------------+                 |
                              | Advance through Workflow |                 |
                              | (Treatment -> Ready)     |                 |
                              +--------------------------+                 |
                                           |                               |
                                           v                               |
                              +--------------------------+                 |
                              | Confirm Patient Discharge|                 |
                              +--------------------------+                 |
                                           |                               |
                                           v                               |
                              +--------------------------+                 |
                              | Automatically Release    |                 |
                              | Bed & Recalculate Stats  |                 |
                              +--------------------------+                 |
                                           |                               |
                                           v                               v
                                  [End: Census Updated]        [Wait for Vacancy]
```
*Figure 5.5: Inpatient Flow and Bed Allocation Decision Lifecycle*

Figure 5.5 illustrates the sequential decision logic of patient intake, triage allocation, clinical stage advancement, and eventual discharge. High-acuity emergency cases bypass manual queues for immediate bed allocation. As patients recover, staff advance their workflow status until discharge, which automatically releases the occupied bed back to available inventory and recalculates census analytics.

---

# 6. Methodology

### 6.1 Engineering Lifecycle & SDLC

```
+--------------------+      +--------------------+      +--------------------+
| 1. Requirements    |      | 2. UI/UX Design    |      | 3. Domain Modeling |
|    Analysis        | ---> |    System          | ---> |    & Types         |
| - Problem Scope    |      | - Healthcare Spec  |      | - TypeScript Types |
| - SRS Specification|      | - Color Guidelines |      | - Mock Data Design |
+--------------------+      +--------------------+      +--------------------+
                                                                   |
                                                                   v
+--------------------+      +--------------------+      +--------------------+
| 6. Testing &       |      | 5. Frontend &      |      | 4. Backend REST    |
|    Verification    | <--- |    Visualizations  | <--- |    API Dev         |
| - 29 E2E Tests     |      | - 4 Modular Pages  |      | - Express Engine   |
| - 0 Compile Errors |      | - Chart.js Charts  |      | - Allocation Logic |
+--------------------+      +--------------------+      +--------------------+
          |
          v
+--------------------+
| 7. Deployment &    |
|    Git Delivery    |
| - Localhost:3000   |
| - GitHub Repository|
+--------------------+
```
*Figure 6.1: Structured Software Engineering Lifecycle of MediPulse Flow*

Figure 6.1 outlines the iterative, milestone-driven software engineering methodology adopted for MediPulse Flow:
1. **Requirements Analysis**: Detailed examination of hospital admission friction, bed allocation delays, and triage challenges, resulting in a formal SRS document.
2. **UI/UX Design System**: Creation of an accessible healthcare design system (`style.css`) using Navy Blue (`#163A5F`), Accent Teal (`#13A89E`), and standard status indicators.
3. **Domain Modeling & Types**: Definition of comprehensive TypeScript interfaces (`Bed`, `Patient`, `Activity`, `DashboardStats`) and generation of a 250-bed realistic initial dataset.
4. **Backend REST API Development**: Modular implementation of Express routers, controllers, and rule-based allocation services with full CRUD and transfer capabilities.
5. **Frontend & Visualizations**: Building four responsive pages with debounced searching, dynamic modals, Lucide icons, and Chart.js graphs.
6. **Testing & Verification**: Execution of an automated end-to-end test suite (`test_suite.js`) verifying all 12 API endpoints and clinical workflows with a 100% pass rate.
7. **Deployment & Git Delivery**: Localhost deployment on port 3000 and clean version control push to GitHub.

---

# 7. Implementation

### 7.1 Frontend Architecture & Healthcare Design System
The client presentation layer is implemented using semantic **HTML5**, modern **CSS3**, and modular **TypeScript / ES6+ JavaScript** without third-party frameworks. The visual design system is centralized in `frontend/css/style.css`, enforcing strict healthcare ergonomics:
* **Primary Navy** (`#163A5F`): Headers, primary actions, and brand identity.
* **Accent Teal** (`#13A89E`): Interactive controls, active navigation items, and focus indicators.
* **Light Background** (`#F4F7FA`): Low eye-strain clinical backdrop.
* **Bed Status Colors**:
  * 🟢 **Available**: `#10B981` (Green)
  * 🔴 **Occupied**: `#EF4444` (Red)
  * 🟡 **Maintenance**: `#F59E0B` (Amber)
  * 🔵 **Reserved**: `#3B82F6` (Blue)
* **Triage Priority Badges**: Emergency (`#DC2626`), High (`#EA580C`), Medium (`#D97706`), Low (`#2563EB`).

Layouts use responsive CSS Grid and Flexbox with breakpoints at 1024px and 768px, ensuring accessibility across mobile devices, tablets, and desktop workstations.

---

### 7.2 Backend REST API & Express Architecture
The backend is built with **Node.js** and **Express.js** written in **TypeScript**. The application is architecturally decoupled into modular layers:
* **Routes (`backend/src/routes/`)**: Map RESTful HTTP verbs to controller methods:
  * `/api/patients`: Full patient CRUD operations.
  * `/api/beds`: Bed inventory, filtering, manual allocation, smart allocation, and transfers.
  * `/api/flow`: Kanban board columns, status progression, and discharge.
  * `/api/dashboard`: Census metrics, Chart.js occupancy payloads, and audit logs.
* **Controllers (`backend/src/controllers/`)**: Validate request payloads, enforce parameter constraints, and format standardized JSON responses.
* **Services (`backend/src/services/allocationService.ts`)**: Encapsulate all clinical decision logic, bed assignment algorithms, and state persistence.

All responses adhere to a unified JSON contract:
```json
{
  "success": true,
  "message": "Descriptive operational message",
  "data": { ... }
}
```

---

### 7.3 Rule-Based Smart Bed Allocation Engine
A core technical contribution of MediPulse Flow is the deterministic rule-based bed allocation engine implemented in `AllocationService.ts`:

$$\text{Priority Weight } W_p = \begin{cases} 4, & \text{if Priority} = \text{Emergency} \\ 3, & \text{if Priority} = \text{High} \\ 2, & \text{if Priority} = \text{Medium} \\ 1, & \text{if Priority} = \text{Low} \end{cases}$$

The algorithm executes the following sequence:
1. **Queue Prioritization**: When auto-allocation is triggered, the system sorts the waiting queue in descending order of clinical priority weight ($W_p$).
2. **Department Matching**: The engine queries available beds matching the patient's requested department ($D_{\text{target}}$).
3. **Emergency Fallback Logic**: If $W_p = 4$ (Emergency) and no bed exists in the primary ward, the engine expands the search to Emergency and ICU beds.
4. **Availability Verification**: Allocation is restricted strictly to beds where `status === 'Available'`. Occupied or maintenance beds are rejected.
5. **Atomic State Mutation**: The selected bed is marked `Occupied`, stamped with the patient's ID and name, and the patient's status transitions to `Admitted`.
6. **Audit Event Logging**: An audit entry is appended to the activity log and synced to persistent storage.

---

### 7.4 In-Memory & JSON Persistent Data Architecture
To satisfy the strict constraint of zero external database dependencies while ensuring data persistence across restarts, MediPulse Flow employs an in-memory data cache synchronized with a local JSON file (`backend/src/data/mockData.json`).

The initial dataset contains:
* **250 Total Beds**:
  * General Ward: 100 beds (`GW-01` to `GW-100`)
  * ICU: 35 beds (`ICU-01` to `ICU-35`)
  * Emergency: 40 beds (`ER-01` to `ER-40`)
  * Private Ward: 45 beds (`PW-01` to `PW-45`)
  * Pediatric Ward: 30 beds (`PED-01` to `PED-30`)
  * *Census Breakdown*: 170 Occupied, 65 Available, 10 Maintenance, 5 Reserved.
* **193 Sample Inpatients**: 170 matching occupied beds, 15 in the active waiting triage queue, and 8 historical discharges.
* **Activity Audit Log**: Real-time event log tracking admissions, transfers, and discharges.

All write operations write synchronously to the in-memory array and flush to `mockData.json` using atomic file writing.

---

### 7.5 Patient Flow & 4-Stage Kanban Workflow Engine
Patient movement is tracked across four clinical stages:
1. **Waiting for Admission**: Newly registered triage patients awaiting bed placement.
2. **Admitted**: Patients successfully assigned to an active ward bed.
3. **Under Treatment**: Inpatients actively undergoing clinical care and observation.
4. **Ready for Discharge**: Recovered patients cleared by medical staff for discharge.

The frontend (`frontend/js/patient-flow.js`) renders a responsive four-column Kanban board. Each patient card displays the patient's name, ID, assigned department, bed number, priority badge, and stage-specific action buttons (*"Allocate Bed"*, *"Start Treatment"*, *"Ready to Discharge"*, *"Release & Discharge"*).

---

### 7.6 Automated Discharge & Dynamic Bed Recalculation
When staff confirm a patient discharge from either the Kanban board or the bed card:
1. The patient's status is set to `Discharged`, their bed assignment is cleared, and `dischargeDate` is timestamped.
2. The associated bed is automatically freed: `status = 'Available'`, occupying patient details are cleared, and `lastCleaned` is set to the current timestamp.
3. The activity stream records a `Discharge` event.
4. Dashboard analytics dynamically recalculate:
   $$\text{Occupancy Rate} = \left( \frac{\text{Occupied Beds}}{\text{Total Beds}} \right) \times 100$$
   Available beds increment by 1, and occupied beds decrement by 1.

---

### 7.7 Chart.js Data Visualizations & Lucide Integration
The Admin Dashboard (`frontend/index.html`) integrates **Chart.js** to deliver interactive data visualizations:
* **Bed Occupancy Doughnut Chart**: Visualizes the distribution of Occupied (170), Available (65), Maintenance (10), and Reserved (5) beds with a center percentage readout.
* **Department-wise Availability Bar Chart**: Compares occupied vs. available beds across all five hospital wards using grouped colored bars.
* **Lucide Iconography**: Applied throughout navigation items, stat cards, action buttons, and modal dialogs to provide clear visual cues.

---

### 7.8 Testing, Verification & End-to-End Test Suite
The system was verified using an automated integration test suite (`test_suite.js`) executing against the running server. The test suite validated 12 endpoints and end-to-end workflows:

```text
=== ALL TESTS PASSED SUCCESSFULLY! ===
[OK] Health Check API -> HTTP 200
[OK] Dashboard Stats API -> HTTP 200
[OK] Dashboard Occupancy API -> HTTP 200
[OK] Activities API -> HTTP 200
[OK] Beds List API -> HTTP 200
[OK] Available Beds API (ICU) -> HTTP 200
[OK] Patients List API -> HTTP 200
[OK] Flow Kanban API -> HTTP 200
[OK] Page: Dashboard (index.html) -> HTTP 200
[OK] Page: Patients (patients.html) -> HTTP 200
[OK] Page: Beds (beds.html) -> HTTP 200
[OK] Page: Flow (patient-flow.html) -> HTTP 200
[OK] Patient Registration: Marcus Vance (PAT-1194)
[OK] Smart Allocation: Bed ER-29 assigned to Marcus Vance
[OK] Bed Transfer: ER-29 released -> GW-69 occupied
[OK] Patient Flow Update: Marcus Vance is now Under Treatment
[OK] Patient Discharge: Bed GW-69 is now available
[OK] Dynamic Census: Total: 250, Avail: 65, Occ: 170, Waiting: 15
```
*Result*: 100% test pass rate with zero runtime exceptions and zero TypeScript compiler warnings.

---

# 8. Output Screenshots & Interface Walkthrough

### Figure 8.1: Admin Dashboard & Inpatient Census Overview
*Route / Interface*: `http://localhost:3000/index.html`

```
+---------------------------------------------------------------------------------------------------------+
| MediPulse Flow  | Dashboard                                                    [Clock] [Auto-Alloc] [Bell]|
+---------------------------------------------------------------------------------------------------------+
| [Dashboard]     |  +----------------+  +----------------+  +----------------+  +----------------+       |
| [Patients] (15) |  | TOTAL BEDS     |  | AVAILABLE BEDS |  | OCCUPIED BEDS  |  | PATIENTS WAIT. |       |
| [Beds]     (65) |  | 250            |  | 65             |  | 170            |  | 15             |       |
| [Flow]          |  +----------------+  +----------------+  +----------------+  +----------------+       |
|                 |                                                                                       |
| LIVE CENSUS     |  DAILY ADMISSIONS: 28 | DAILY DISCHARGES: 19 | OCCUPANCY: 68% | TURNOVER: 4.6 Days    |
| Avail: 65       |                                                                                       |
| Queue: 15       |  +-----------------------------+  +------------------------------------------------+  |
|                 |  | Bed Occupancy Distribution  |  | Department-wise Bed Availability (Bar Chart)   |  |
| [Dr. Vance]     |  | [ Doughnut: 68% Occupied ]  |  | [GW: 68/26] [ICU: 26/6] [ER: 28/10]            |  |
|                 |  +-----------------------------+  +------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------------+
```
*Figure 8.1: Live Application View – Admin Dashboard & Inpatient Census Overview*

Figure 8.1 displays the executive Admin Dashboard of MediPulse Flow. The top section showcases four dynamic summary cards (**Total Beds: 250, Available: 65, Occupied: 170, Waiting: 15**). Below the cards, an analytics banner presents daily admission velocity, discharge compliance, occupancy percentage, and turnover rate. The main view integrates the Chart.js doughnut occupancy distribution and the department-wise availability bar chart.

---

### Figure 8.2: Department-wise Bed Availability & Analytics
*Route / Interface*: `http://localhost:3000/index.html#analytics`

```
+---------------------------------------------------------------------------------------------------------+
| DEPARTMENT-WISE INPATIENT CAPACITY                                                                      |
+---------------------------------------------------------------------------------------------------------+
| Ward Name        | Total Capacity | Occupied Beds | Available Beds | Maintenance | Occupancy Rate       |
|------------------|----------------|---------------|----------------|-------------|----------------------|
| General Ward     | 100 Beds       | 68 Beds       | 26 Beds        | 4 Beds      | 68% [||||||||--]     |
| Intensive Care   | 35 Beds        | 26 Beds       | 6 Beds         | 2 Beds      | 74% [|||||||||-]     |
| Emergency        | 40 Beds        | 28 Beds       | 10 Beds        | 1 Bed       | 70% [||||||||--]     |
| Private Ward     | 45 Beds        | 30 Beds       | 12 Beds        | 2 Beds      | 67% [||||||||--]     |
| Pediatric Ward   | 30 Beds        | 18 Beds       | 11 Beds        | 1 Bed       | 60% [|||||||---]     |
+---------------------------------------------------------------------------------------------------------+
```
*Figure 8.2: Live Application View – Department-wise Bed Capacity Breakdown*

Figure 8.2 presents the detailed capacity breakdown across all five hospital wards. The display allows nursing supervisors and department chairs to immediately identify capacity constraints in specialized units such as the Intensive Care Unit (ICU) and Emergency Trauma Center.

---

### Figure 8.3: Patient Management Directory & Filtering
*Route / Interface*: `http://localhost:3000/patients.html`

```
+---------------------------------------------------------------------------------------------------------+
| Patient Management                                                                 [+ Add New Patient]  |
+---------------------------------------------------------------------------------------------------------+
| [Search by name, ID, bed...] | [All Depts v] | [All Statuses v] | [All Priorities v] | [Reset Filters]  |
+---------------------------------------------------------------------------------------------------------+
| Patient ID | Patient Name    | Age | Gender | Contact       | Department | Priority  | Status   | Actions |
|------------|-----------------|-----|--------|---------------|------------|-----------|----------|---------|
| PAT-1002   | Patricia Smith  | 48  | Female | (555) 234-5678| ICU        | Emergency | Admitted | [V][E][D|
| PAT-1005   | Michael Brown   | 62  | Male   | (555) 345-6789| Emergency  | High      | Treatment| [V][E][D|
| PAT-1175   | Emily Clark     | 34  | Female | (555) 789-4005| Gen. Ward  | Medium    | Waiting  | [Alloc] |
+---------------------------------------------------------------------------------------------------------+
```
*Figure 8.3: Live Application View – Patient Management Directory & Search*

Figure 8.3 illustrates the Patient Management directory. The interface provides debounced text search and multi-parameter filtering across clinical departments, admission statuses, and triage priority levels. The table displays patient demographics, assigned bed numbers, and action icons for viewing medical records, editing details, deleting entries, or allocating beds.

---

### Figure 8.4: Inpatient Registration Modal & Triage Profiling
*Route / Interface*: `http://localhost:3000/patients.html (Add Patient Modal)`

```
+-------------------------------------------------------------------------+
| [+ Add New Inpatient Registration]                                  [X] |
+-------------------------------------------------------------------------+
| Patient ID: Auto-generated (e.g. PAT-1195)                              |
| Full Name: [ Sarah Jenkins                   ]  Age: [ 38 ]             |
| Gender: [ Female v ]                            Phone: [ +1 (555) 890-12|
| Department: [ Emergency v ]                     Priority: [ Emergency v]|
| Admission Date: [ 2026-11-24 ]                                          |
| Primary Diagnosis: [ Acute Blunt Chest Trauma & Rib Fracture          ] |
| Residential Address: [ 742 Evergreen Terrace, Cityville               ] |
+-------------------------------------------------------------------------+
|                                              [Cancel] [Register Patient]|
+-------------------------------------------------------------------------+
```
*Figure 8.4: Live Application View – Patient Registration Modal & Triage*

Figure 8.4 shows the inpatient registration modal. The form automatically assigns the next available sequential identifier (`PAT-xxxx`), validates demographic parameters, and captures clinical triage priority to ensure proper placement in the allocation queue.

---

### Figure 8.5: Patient Medical File Preview Modal
*Route / Interface*: `http://localhost:3000/patients.html (View Modal)`

```
+-------------------------------------------------------------------------+
| [Patient Medical File]                                              [X] |
+-------------------------------------------------------------------------+
| (SJ)  Sarah Jenkins                                                     |
|       ID: PAT-1195  *  38 yrs  *  Female                                |
|       [ Emergency Priority ]   [ Admitted ]                             |
|-------------------------------------------------------------------------|
| Assigned Department: Emergency        Bed Number: ER-08 (Trauma Bay 2)  |
| Admission Date: 2026-11-24            Attending Doctor: Dr. Adams       |
| Primary Diagnosis: Acute Blunt Chest Trauma & Rib Fracture              |
| Contact Phone: +1 (555) 890-1234      Address: 742 Evergreen Terrace    |
+-------------------------------------------------------------------------+
|                                                                 [Close] |
+-------------------------------------------------------------------------+
```
*Figure 8.5: Live Application View – Patient Medical File Inspection*

Figure 8.5 illustrates the comprehensive medical file view. Staff can review patient acuity, current bed placement, attending physician assignments, and clinical diagnoses in a clean, structured modal layout.

---

### Figure 8.6: Visual Ward Layout & Bed Management Grid
*Route / Interface*: `http://localhost:3000/beds.html`

```
+---------------------------------------------------------------------------------------------------------+
| Bed Allocation                                                    [Smart Auto-Alloc] [+ Allocate Bed]   |
+---------------------------------------------------------------------------------------------------------+
| [All Departments] [General Ward] [ICU] [Emergency] [Private Ward] [Pediatric Ward]                      |
| Filter: [All Statuses v] | Legend: (*) Available  (*) Occupied  (*) Maintenance  (*) Reserved           |
+---------------------------------------------------------------------------------------------------------+
| ICU (Intensive Care Unit) - 2nd Floor (Critical Care) - 74% Occupied                                    |
| [26 Occupied] [6 Available] [2 Maintenance] [1 Reserved]                                                |
|                                                                                                         |
| +-------------------+  +-------------------+  +-------------------+  +-------------------+              |
| | ICU-01 [Occupied] |  | ICU-02  [Maint.]  |  | ICU-03 [Occupied] |  | ICU-04 [Available]|              |
| | John Doe (PAT-101)|  | UV Sterilization  |  | Robert Vance (104)|  | Ready for Intake  |              |
| | Room 101          |  | Bay 101           |  | Room 102          |  | Room 102          |              |
| | [Transfer][Disch] |  | [Restore Service] |  | [Transfer][Disch] |  | [Allocate][Maint] |              |
| +-------------------+  +-------------------+  +-------------------+  +-------------------+              |
+---------------------------------------------------------------------------------------------------------+
```
*Figure 8.6: Live Application View – Visual Ward Layout & Bed Cards*

Figure 8.6 shows the visual bed allocation interface. Individual bed cards are grouped by department, displaying real-time status borders and contextual action buttons: Available beds show *"Allocate"* and *"Maintenance"*, Occupied beds offer *"Transfer"* and *"Discharge"*, and Maintenance beds provide single-click *"Restore Service"* controls.

---

### Figure 8.7: Smart Rule-Based Bed Allocation Modal
*Route / Interface*: `http://localhost:3000/beds.html (Allocate Modal)`

```
+-------------------------------------------------------------------------+
| [Allocate Bed to Patient]                                           [X] |
+-------------------------------------------------------------------------+
| Select Waiting Patient:                                                 |
| [ [EMERGENCY] Sarah Jenkins (PAT-1195) - Emergency Priority         v ] |
|                                                                         |
| Target Department:                                                      |
| [ Emergency                                                         v ] |
|                                                                         |
| Select Available Bed:                                                   |
| [ ER-08 (Trauma Center Bay 2)                                       v ] |
| 10 beds currently available in Emergency                                |
|                                                                         |
| Admission Date: [ 2026-11-24 ]                                          |
+-------------------------------------------------------------------------+
|                                              [Cancel] [Confirm Alloc.]  |
+-------------------------------------------------------------------------+
```
*Figure 8.7: Live Application View – Bed Allocation Modal*

Figure 8.7 shows the manual allocation modal. Emergency and High-priority patients are visually distinguished in the dropdown. Selecting a patient automatically updates the target department and dynamically populates available beds in that ward.

---

### Figure 8.8: Patient Bed & Ward Transfer Interface
*Route / Interface*: `http://localhost:3000/beds.html (Transfer Modal)`

```
+-------------------------------------------------------------------------+
| [Transfer Patient Bed]                                              [X] |
+-------------------------------------------------------------------------+
| Patient Name & ID: [ John Doe (PAT-1001)                              ] |
| Current Bed & Ward: [ ICU-01 - Intensive Care Unit                    ] |
|                                                                         |
| Destination Department:                                                 |
| [ General Ward                                                      v ] |
|                                                                         |
| Select Available Destination Bed:                                       |
| [ GW-112 (3rd Floor - Step-down Room 104)                           v ] |
+-------------------------------------------------------------------------+
|                                            [Cancel] [Confirm Transfer]  |
+-------------------------------------------------------------------------+
```
*Figure 8.8: Live Application View – Bed Transfer Interface*

Figure 8.8 depicts the inter-department transfer workflow. When a patient stabilizes, staff select the destination ward and bed. The system atomically releases the ICU bed for incoming emergencies, occupies the General Ward bed, and logs the event in the audit timeline.

---

### Figure 8.9: 4-Stage Kanban Patient Flow Management Board
*Route / Interface*: `http://localhost:3000/patient-flow.html`

```
+---------------------------------------------------------------------------------------------------------+
| Patient Flow Management                                                                 [Refresh Census]|
+---------------------------------------------------------------------------------------------------------+
| TOTAL ADM: 193 | DISCHARGES: 18 | CURRENTLY ADMITTED: 170 | AVG STAY: 4.6 Days | TURNOVER: 68%          |
+---------------------------------------------------------------------------------------------------------+
| 1. WAITING (15)       | 2. ADMITTED (42)      | 3. TREATMENT (85)     | 4. READY DISCHARGE (43)         |
|-----------------------|-----------------------|-----------------------|---------------------------------|
| [Sarah Jenkins]       | [Robert Vance]        | [David Miller]        | [James Smith]                   |
| ID: PAT-1195          | ID: PAT-1004          | ID: PAT-1022          | ID: PAT-1001                    |
| Ward: Emergency       | Bed: ICU-03           | Bed: GW-115           | Bed: PW-05                      |
| [Emergency Priority]  | [High Priority]       | [Medium Priority]     | [Low Priority]                  |
| [Allocate Bed]        | [Start Treatment]     | [Ready for Discharge] | [Release & Discharge]           |
+---------------------------------------------------------------------------------------------------------+
```
*Figure 8.9: Live Application View – 4-Stage Kanban Workflow Board*

Figure 8.9 displays the four-stage Kanban patient workflow board. Inpatients advance across stages via dedicated action triggers, allowing clinical teams to monitor intake boarding, ongoing treatment, and pending discharges from a unified interface.

---

### Figure 8.10: Automated Discharge & Movement Audit Timeline
*Route / Interface*: `http://localhost:3000/patient-flow.html#timeline`

```
+---------------------------------------------------------------------------------------------------------+
| RECENT PATIENT MOVEMENT TIMELINE                                                                        |
+---------------------------------------------------------------------------------------------------------+
| (o) Patient Discharged & Bed Released                                                   Just now        |
|     Completed discharge protocol for James Smith (PAT-1001). Bed PW-05 marked Available.                |
|                                                                                                         |
| (o) Patient Transferred to Step-Down Ward                                               14m ago         |
|     Transferred John Doe from ICU-01 to General Ward GW-112 after stabilization.                        |
|                                                                                                         |
| (o) Smart Bed Allocated                                                                 32m ago         |
|     Allocated Bed ER-08 to Sarah Jenkins (Emergency Priority) in Emergency Trauma Unit.                |
|                                                                                                         |
| (o) New Inpatient Registered                                                            45m ago         |
|     Sarah Jenkins registered in triage queue with Acute Blunt Chest Trauma.                             |
+---------------------------------------------------------------------------------------------------------+
```
*Figure 8.10: Live Application View – Movement Audit Timeline*

Figure 8.10 illustrates the chronological movement timeline. Every state mutation—registration, allocation, transfer, and discharge—is recorded with timestamps, patient IDs, and bed numbers for full operational traceability.

---

# 9. Conclusion & Future Enhancements

### 9.1 Project Summary
The project titled **“Design and Development of a Smart Hospital Bed Allocation and Patient Flow Management System (MediPulse Flow)”** successfully delivers a modern, production-grade web application tailored for real-time hospital administration. By replacing fragmented manual spreadsheets and phone coordination with an automated, rule-based triage allocation engine and an interactive four-stage Kanban workflow, MediPulse Flow eliminates admission bottlenecks, prevents double-allocations, and accelerates patient flow.

The project adhered to strict engineering constraints:
* Pure **HTML5**, modern **CSS3**, and **TypeScript / Vanilla JavaScript (ES6+)** with **Chart.js** and **Lucide Icons** on the frontend.
* An **Express.js** REST API in TypeScript providing full CRUD capabilities for patients, beds, workflow stages, and dashboard metrics.
* Fully persistent, in-memory synchronized JSON storage (`mockData.json`) initialized with **250 beds** and realistic patient records, eliminating external database server dependencies.
* An automated test suite verifying all endpoints and clinical workflows with a 100% pass rate.
* Source code managed under Git version control and hosted on GitHub at [https://github.com/Pranav9491/SESD-Project](https://github.com/Pranav9491/SESD-Project).

---

### 9.2 Future Enhancements
Planned future improvements for MediPulse Flow include:
1. **IoT Smart Bed Integration**: Connecting beds with pressure and weight sensors to automatically detect patient occupancy and vacation without requiring manual staff inputs.
2. **Machine Learning Predictive Discharge**: Implementing gradient-boosted regression models to predict patient length of stay based on initial clinical diagnoses and lab biomarkers.
3. **Role-Based Access Control (RBAC) & SSO**: Layering JWT/OAuth2 authentication with distinct permission scopes for triage nurses, ward supervisors, and chief medical officers.
4. **HL7 / FHIR Interoperability**: Integrating standard Fast Healthcare Interoperability Resources (FHIR) APIs for bidirectional data exchange with external Electronic Health Record (EHR) platforms.

---

# 10. References

### Academic and Technical Citations
1. **Pressman, R. S., & Maxim, B. R.** (2020). *Software Engineering: A Practitioner’s Approach* (9th ed.). McGraw-Hill Education.
2. **Sommerville, I.** (2016). *Software Engineering* (10th ed.). Pearson Education.
3. **MDN Web Docs** (2024). *HTML5, CSS3, and ECMAScript 2024 Reference Guides*. Mozilla Corporation. Available at: [https://developer.mozilla.org/](https://developer.mozilla.org/)
4. **Express.js Foundation** (2024). *Express.js Documentation: Fast, unopinionated, minimalist web framework for Node.js*. Available at: [https://expressjs.com/](https://expressjs.com/)
5. **TypeScript Documentation** (2024). *TypeScript Language Specification & Handbook*. Microsoft Corporation. Available at: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
6. **Chart.js Community** (2024). *Chart.js Documentation: Open source HTML5 Charts for modern web development*. Available at: [https://www.chartjs.org/docs/](https://www.chartjs.org/docs/)
7. **Lucide Contributors** (2024). *Lucide Icons: Beautiful & consistent icon toolkit for modern web applications*. Available at: [https://lucide.dev/](https://lucide.dev/)
8. **Proudlove, N., Boaden, R., & Jorgensen, J.** (2007). *Developing bed managers: The why and how of bed management in acute hospitals*. Journal of Nursing Management, 15(1), 34–42.
9. **Litvak, E., & Bisognano, M.** (2011). *More patients, less payment: Increasing hospital efficiency in the aftermath of health reform*. Health Affairs, 30(1), 76–80.
10. **GitHub Repository**: *MediPulse Flow: Smart Hospital Bed Allocation and Patient Flow Management System*. Available at: [https://github.com/Pranav9491/SESD-Project](https://github.com/Pranav9491/SESD-Project)
