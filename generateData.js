const fs = require('fs');
const path = require('path');

// Departments and bed allocations
const departments = [
  { name: 'General Ward', prefix: 'GW', total: 100, occupied: 68, available: 26, maintenance: 4, reserved: 2, floor: '3rd Floor' },
  { name: 'ICU', prefix: 'ICU', total: 35, occupied: 26, available: 6, maintenance: 2, reserved: 1, floor: '2nd Floor (Critical Care)' },
  { name: 'Emergency', prefix: 'ER', total: 40, occupied: 28, available: 10, maintenance: 1, reserved: 1, floor: '1st Floor (Trauma Center)' },
  { name: 'Private Ward', prefix: 'PW', total: 45, occupied: 30, available: 12, maintenance: 2, reserved: 1, floor: '4th Floor (Executive)' },
  { name: 'Pediatric Ward', prefix: 'PED', total: 30, occupied: 18, available: 11, maintenance: 1, reserved: 0, floor: '2nd Floor (Maternal & Child)' }
];

// Check totals
// Total: 100 + 35 + 40 + 45 + 30 = 250
// Occupied: 68 + 26 + 28 + 30 + 18 = 170
// Available: 26 + 6 + 10 + 12 + 11 = 65
// Maintenance: 4 + 2 + 1 + 2 + 1 = 10
// Reserved: 2 + 1 + 1 + 1 + 0 = 5

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
  'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Donald', 'Sandra',
  'Mark', 'Ashley', 'Paul', 'Kimberly', 'Steven', 'Emily', 'Andrew', 'Donna', 'Kenneth', 'Michelle',
  'Joshua', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Melissa', 'George', 'Deborah', 'Edward', 'Stephanie',
  'Ronald', 'Rebecca', 'Timothy', 'Sharon', 'Jason', 'Laura', 'Jeffrey', 'Cynthia', 'Ryan', 'Kathleen',
  'Jacob', 'Amy', 'Gary', 'Shirley', 'Nicholas', 'Angela', 'Eric', 'Helen', 'Jonathan', 'Anna',
  'Stephen', 'Brenda', 'Larry', 'Pamela', 'Justin', 'Nicole', 'Scott', 'Emma', 'Brandon', 'Samantha',
  'Benjamin', 'Katherine', 'Samuel', 'Christine', 'Gregory', 'Debra', 'Alexander', 'Rachel', 'Patrick', 'Catherine',
  'Frank', 'Carolyn', 'Raymond', 'Janet', 'Jack', 'Ruth', 'Dennis', 'Maria', 'Jerry', 'Heather'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const conditionsByDept = {
  'General Ward': ['Post-Operative Recovery', 'Type 2 Diabetes Complications', 'Severe Hypertension', 'Bacterial Pneumonia', 'Acute Gastroenteritis', 'Deep Vein Thrombosis', 'Cellulitis', 'Cholecystitis'],
  'ICU': ['Acute Respiratory Distress (ARDS)', 'Septic Shock', 'Post-CABG Cardiac Monitoring', 'Severe Traumatic Brain Injury', 'Multi-organ Dysfunction', 'Acute Myocardial Infarction', 'Cerebrovascular Accident'],
  'Emergency': ['Multiple Blunt Trauma', 'Acute Chest Pain', 'Severe Anaphylaxis', 'Severe Asthma Exacerbation', 'Compound Fracture', 'Acute Appendicitis', 'Suspected Stroke', 'High-grade Sepsis'],
  'Private Ward': ['Elective Knee Replacement Recovery', 'Chemotherapy Observation', 'Post-Angioplasty Monitoring', 'Spinal Fusion Recovery', 'Hernia Repair Post-Op', 'Laparoscopic Colectomy Recovery'],
  'Pediatric Ward': ['Acute Bronchiolitis', 'Pediatric Asthma Exacerbation', 'Severe Dehydration / Rotavirus', 'Febrile Seizure Observation', 'Pediatric Pneumonia', 'Tonsillectomy Recovery']
};

const priorities = ['Low', 'Medium', 'High', 'Emergency'];

let patientCounter = 1001;
const beds = [];
const patients = [];

// 1. Generate beds and occupied patients
departments.forEach(dept => {
  let occCount = 0;
  let availCount = 0;
  let maintCount = 0;
  let resCount = 0;

  for (let i = 1; i <= dept.total; i++) {
    const bedNum = `${dept.prefix}-${i < 10 ? '0' + i : i}`;
    let status = 'Available';

    if (occCount < dept.occupied) {
      status = 'Occupied';
      occCount++;
    } else if (availCount < dept.available) {
      status = 'Available';
      availCount++;
    } else if (maintCount < dept.maintenance) {
      status = 'Maintenance';
      maintCount++;
    } else {
      status = 'Reserved';
      resCount++;
    }

    let bedPatientId = null;
    let bedPatientName = null;

    if (status === 'Occupied') {
      const pId = `PAT-${patientCounter++}`;
      const fName = firstNames[(patientCounter * 7) % firstNames.length];
      const lName = lastNames[(patientCounter * 11) % lastNames.length];
      const fullName = `${fName} ${lName}`;
      bedPatientId = pId;
      bedPatientName = fullName;

      const condList = conditionsByDept[dept.name];
      const condition = condList[patientCounter % condList.length];
      const priority = dept.name === 'ICU' || dept.name === 'Emergency' 
        ? (patientCounter % 2 === 0 ? 'Emergency' : 'High')
        : (patientCounter % 3 === 0 ? 'Medium' : (patientCounter % 4 === 0 ? 'High' : 'Low'));

      const flowStatuses = ['Admitted', 'Under Treatment', 'Under Treatment', 'Ready for Discharge'];
      const currentFlow = flowStatuses[patientCounter % flowStatuses.length];

      const daysAgo = (patientCounter % 8) + 1;
      const admDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      patients.push({
        id: pId,
        name: fullName,
        age: 18 + (patientCounter % 65),
        gender: patientCounter % 2 === 0 ? 'Male' : 'Female',
        phone: `+1 (555) ${100 + (patientCounter % 899)}-${1000 + (patientCounter % 8999)}`,
        address: `${100 + (patientCounter % 899)} Healthcare Ave, Cityville`,
        medicalCondition: condition,
        department: dept.name,
        admissionDate: admDate,
        priority: priority,
        status: currentFlow,
        bedNumber: bedNum,
        assignedDoctor: `Dr. ${lastNames[(patientCounter * 3) % lastNames.length]}`,
        notes: `Patient admitted to ${dept.name} in bed ${bedNum}. Vital signs stable.`
      });
    }

    beds.push({
      id: `BED-${dept.prefix}-${i}`,
      bedNumber: bedNum,
      department: dept.name,
      status: status,
      patientId: bedPatientId,
      patientName: bedPatientName,
      lastCleaned: new Date(Date.now() - (i % 5) * 3600000).toISOString(),
      occupiedSince: status === 'Occupied' ? new Date(Date.now() - (i % 72) * 3600000).toISOString() : null,
      floor: dept.floor,
      room: `Room ${Math.floor(i / 4) + 101}`
    });
  }
});

// 2. Generate exactly 15 Waiting Patients (to match the prompt requirement "Patients Waiting: 15")
for (let i = 1; i <= 15; i++) {
  const pId = `PAT-${patientCounter++}`;
  const fName = firstNames[(patientCounter * 5) % firstNames.length];
  const lName = lastNames[(patientCounter * 9) % lastNames.length];
  const fullName = `${fName} ${lName}`;
  const dept = departments[i % departments.length].name;
  const condList = conditionsByDept[dept];
  const condition = condList[i % condList.length];

  // Distribution of priorities for waiting patients
  let priority = 'Medium';
  if (i <= 3) priority = 'Emergency';
  else if (i <= 7) priority = 'High';
  else if (i <= 12) priority = 'Medium';
  else priority = 'Low';

  const today = new Date().toISOString().split('T')[0];

  patients.push({
    id: pId,
    name: fullName,
    age: 20 + (i * 4),
    gender: i % 2 === 0 ? 'Female' : 'Male',
    phone: `+1 (555) 789-${4000 + i}`,
    address: `${200 + i * 15} Elm Street, Metro City`,
    medicalCondition: condition,
    department: dept,
    admissionDate: today,
    priority: priority,
    status: 'Waiting',
    bedNumber: null,
    assignedDoctor: `Dr. Adams`,
    notes: `Registered in triage queue. Pending bed allocation in ${dept}.`
  });
}

// 3. Generate some recently discharged patients for realistic history
for (let i = 1; i <= 8; i++) {
  const pId = `PAT-${patientCounter++}`;
  const fName = firstNames[(patientCounter * 3) % firstNames.length];
  const lName = lastNames[(patientCounter * 13) % lastNames.length];
  const fullName = `${fName} ${lName}`;
  const dept = departments[i % departments.length].name;
  const condList = conditionsByDept[dept];

  patients.push({
    id: pId,
    name: fullName,
    age: 25 + (i * 5),
    gender: i % 2 === 0 ? 'Male' : 'Female',
    phone: `+1 (555) 654-${5000 + i}`,
    address: `${500 + i * 20} Oak Ave, Suburbia`,
    medicalCondition: condList[0],
    department: dept,
    admissionDate: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    dischargeDate: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    priority: 'Low',
    status: 'Discharged',
    bedNumber: null,
    assignedDoctor: 'Dr. Sarah Mitchell',
    notes: 'Successfully recovered and discharged.'
  });
}

// 4. Generate Initial Activities
const activities = [
  {
    id: 'ACT-101',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    type: 'Registration',
    title: 'New Patient Registered',
    description: 'Patient Emily Clark registered with Emergency triage priority in Trauma Unit.',
    patientId: 'PAT-1171',
    department: 'Emergency',
    badgeType: 'danger'
  },
  {
    id: 'ACT-102',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    type: 'Allocation',
    title: 'Smart Bed Allocated',
    description: 'Allocated Bed ICU-04 to Marcus Vance (High Priority) in Intensive Care.',
    bedNumber: 'ICU-04',
    patientId: 'PAT-1070',
    department: 'ICU',
    badgeType: 'success'
  },
  {
    id: 'ACT-103',
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    type: 'Transfer',
    title: 'Patient Transferred',
    description: 'Transferred Sarah Jenkins from ER-08 to General Ward GW-112 after stabilization.',
    bedNumber: 'GW-112',
    department: 'General Ward',
    badgeType: 'info'
  },
  {
    id: 'ACT-104',
    timestamp: new Date(Date.now() - 150 * 60000).toISOString(),
    type: 'Discharge',
    title: 'Patient Discharged',
    description: 'Completed discharge protocol for David Miller. Bed PW-05 marked available.',
    bedNumber: 'PW-05',
    department: 'Private Ward',
    badgeType: 'warning'
  },
  {
    id: 'ACT-105',
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    type: 'Maintenance',
    title: 'Bed Sterilization Complete',
    description: 'Routine UV sanitation and telemetry calibration finished for Bed ICU-02.',
    bedNumber: 'ICU-02',
    department: 'ICU',
    badgeType: 'info'
  }
];

const mockData = {
  beds,
  patients,
  activities
};

const dir = path.join(__dirname, 'backend', 'src', 'data');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'mockData.json'), JSON.stringify(mockData, null, 2));
console.log(`Generated mock data successfully:`);
console.log(`- Beds: ${beds.length} (Occupied: ${beds.filter(b => b.status === 'Occupied').length}, Available: ${beds.filter(b => b.status === 'Available').length}, Maintenance: ${beds.filter(b => b.status === 'Maintenance').length}, Reserved: ${beds.filter(b => b.status === 'Reserved').length})`);
console.log(`- Patients: ${patients.length} (Waiting: ${patients.filter(p => p.status === 'Waiting').length}, Admitted: ${patients.filter(p => p.status === 'Admitted').length}, Under Treatment: ${patients.filter(p => p.status === 'Under Treatment').length}, Ready for Discharge: ${patients.filter(p => p.status === 'Ready for Discharge').length}, Discharged: ${patients.filter(p => p.status === 'Discharged').length})`);
console.log(`- Activities: ${activities.length}`);
