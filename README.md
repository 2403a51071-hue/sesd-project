# Smart Hospital Bed Allocation and Patient Flow Management System

A modern, responsive full-stack hospital administration platform engineered to manage patient registration, bed availability, rule-based automatic bed allocation, patient transfers, admissions, and discharge workflows.

---

## 1. System Architecture & Tech Stack

- **Frontend**: HTML5, CSS3, TypeScript / ES6+, Chart.js, Lucide Icons.
- **Backend**: Node.js, Express.js, TypeScript, REST API architecture.
- **Data Engine**: JSON-based persistent storage (`backend/src/data/mockData.json`) initialized with 250 beds and realistic patient records.
- **Design Language**: Modern healthcare SaaS dashboard adhering to `#163A5F` (Navy Blue), `#13A89E` (Teal), `#F4F7FA` (Light Grey), and standard clinical status indicators:
  - 🟢 **Green** (`#10B981`): Available Beds
  - 🔴 **Red** (`#EF4444`): Occupied Beds
  - 🟡 **Yellow** (`#F59E0B`): Maintenance Beds
  - 🔵 **Blue** (`#3B82F6`): Reserved Beds

---

## 2. Main Application Pages

1. **Dashboard (`index.html`)**:
   - 4 Dynamic Stat Cards: Total Beds (250), Available Beds (65), Occupied Beds (170), Patients Waiting (15).
   - Bed Occupancy Doughnut Chart (Chart.js) with real-time percentages.
   - Department-wise Bed Availability & Occupancy Bar Chart (Chart.js) across 5 departments.
   - Recent Admissions Table and Live Activity Stream.
   - Key Analytics: Daily admissions, daily discharges, occupancy rate, bed turnover rate.

2. **Patient Management (`patients.html`)**:
   - Full CRUD: Add Inpatient, View Medical Record, Edit Details, Delete Record with safety confirm dialog.
   - Search & Filter bar: Search by name, ID, condition, or bed number; filter by department, triage priority, and clinical status.
   - Priority-based badges: Emergency, High, Medium, Low.

3. **Smart Bed Allocation (`beds.html`)**:
   - Visual Bed Grid for all 5 departments (General Ward, ICU, Emergency, Private Ward, Pediatric Ward).
   - **Smart Auto-Allocation Engine**: Prioritizes Emergency & High-priority triage cases first, matches ward requirements, assigns bed, updates patient status to Admitted, and logs audit activities.
   - Manual Allocation Modal: Select patient from waiting queue, choose available bed, set admission date.
   - Patient Bed Transfer Modal: Atomically releases previous bed and occupies destination bed.
   - Bed Maintenance Protocols: Mark beds for UV sanitization/inspection and restore when completed.

4. **Patient Flow Management (`patient-flow.html`)**:
   - 4-Stage Kanban Workflow Board:
     1. *Waiting for Admission*
     2. *Admitted*
     3. *Under Treatment*
     4. *Ready for Discharge*
   - Discharge Protocol: Frees bed automatically, restores bed to available inventory, and updates census.
   - Flow Analytics: Cumulative admissions, discharges, active inpatients, length of stay.
   - Patient Movement Audit Timeline.

---

## 3. Installation & Local Execution

### Prerequisites
- Node.js (v18+ or v24+)
- npm (v9+)

### Installation
```bash
npm install
```

### Starting the Server
```bash
# Run with tsx (Development & Local Production)
npm start
```
The server will start at:
👉 **`http://localhost:3000`**

### Direct Page URLs:
- **Dashboard**: `http://localhost:3000/index.html` (or `http://localhost:3000/`)
- **Patient Management**: `http://localhost:3000/patients.html`
- **Smart Bed Allocation**: `http://localhost:3000/beds.html`
- **Patient Flow Management**: `http://localhost:3000/patient-flow.html`

---

## 4. REST API Endpoints

### Patients
- `GET /api/patients` - List patients with optional department, status, priority, and search filters.
- `GET /api/patients/:id` - Get patient profile by ID.
- `POST /api/patients` - Register a new patient.
- `PUT /api/patients/:id` - Update patient details.
- `DELETE /api/patients/:id` - Delete patient record and release occupied bed.

### Beds
- `GET /api/beds` - Get all beds with optional department & status filtering.
- `GET /api/beds/available` - Get available beds.
- `POST /api/beds/allocate` - Allocate specific bed to patient.
- `POST /api/beds/smart-allocate` - Rule-based automatic bed allocation.
- `POST /api/beds/transfer` - Transfer patient to destination bed.
- `PUT /api/beds/:id` - Toggle maintenance status.

### Patient Flow
- `GET /api/flow` - Retrieve 4-stage Kanban columns.
- `PUT /api/flow/:patientId/status` - Advance patient status in workflow.
- `POST /api/flow/:patientId/discharge` - Discharge patient and release bed.

### Dashboard
- `GET /api/dashboard/stats` - Calculated metrics from active mock dataset.
- `GET /api/dashboard/occupancy` - Distribution and department breakdown for charts.
- `GET /api/dashboard/activities` - Audit trail and recent admissions.
