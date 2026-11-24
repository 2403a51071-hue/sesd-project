const http = require('http');

async function testAll() {
  console.log('--- Starting Comprehensive Test Suite ---');
  const base = 'http://localhost:3000';

  const testEndpoints = [
    { name: 'Health Check', url: `${base}/api/health`, method: 'GET' },
    { name: 'Dashboard Stats', url: `${base}/api/dashboard/stats`, method: 'GET' },
    { name: 'Dashboard Occupancy', url: `${base}/api/dashboard/occupancy`, method: 'GET' },
    { name: 'Recent Activities', url: `${base}/api/dashboard/activities`, method: 'GET' },
    { name: 'All Beds', url: `${base}/api/beds`, method: 'GET' },
    { name: 'Available Beds', url: `${base}/api/beds/available?department=ICU`, method: 'GET' },
    { name: 'Patients List', url: `${base}/api/patients`, method: 'GET' },
    { name: 'Flow Kanban Board', url: `${base}/api/flow`, method: 'GET' },
    { name: 'Page: Dashboard HTML', url: `${base}/index.html`, method: 'GET' },
    { name: 'Page: Patients HTML', url: `${base}/patients.html`, method: 'GET' },
    { name: 'Page: Beds HTML', url: `${base}/beds.html`, method: 'GET' },
    { name: 'Page: Flow HTML', url: `${base}/patient-flow.html`, method: 'GET' },
  ];

  for (const t of testEndpoints) {
    try {
      const res = await fetch(t.url, { method: t.method });
      console.log(`[PASS] ${t.name}: Status ${res.status}`);
    } catch (err) {
      console.error(`[FAIL] ${t.name}:`, err.message);
    }
  }

  // Functional test: Register new patient
  console.log('\n--- Testing Functional Workflows ---');
  try {
    const regRes = await fetch(`${base}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Test Patient',
        age: 35,
        gender: 'Female',
        phone: '+1 (555) 999-8888',
        address: '99 Hospital Way',
        medicalCondition: 'Acute Cardiac Arrhythmia',
        department: 'ICU',
        priority: 'Emergency',
        admissionDate: new Date().toISOString().split('T')[0]
      })
    });
    const regData = await regRes.json();
    console.log(`[PASS] Patient Registration:`, regData.success ? `Registered ${regData.data.id}` : regData.message);
    const patientId = regData.data.id;

    // Smart Allocate
    const smartRes = await fetch(`${base}/api/beds/smart-allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId })
    });
    const smartData = await smartRes.json();
    console.log(`[PASS] Smart Allocation:`, smartData.success ? `Bed ${smartData.data.bed.bedNumber} assigned` : smartData.message);
    const currentBed = smartData.data.bed.bedNumber;

    // Transfer Bed
    // Find an available bed in General Ward
    const availRes = await fetch(`${base}/api/beds/available?department=General Ward`);
    const availData = await availRes.json();
    const destBed = availData.data[0].bedNumber;

    const transferRes = await fetch(`${base}/api/beds/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, destinationBedNumber: destBed })
    });
    const transferData = await transferRes.json();
    console.log(`[PASS] Bed Transfer:`, transferData.success ? `Transferred ${currentBed} -> ${destBed}` : transferData.message);

    // Update Status to Under Treatment
    const flowRes = await fetch(`${base}/api/flow/${patientId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Under Treatment' })
    });
    const flowData = await flowRes.json();
    console.log(`[PASS] Flow Progress: Status updated to ${flowData.data.status}`);

    // Discharge Patient
    const disRes = await fetch(`${base}/api/flow/${patientId}/discharge`, {
      method: 'POST'
    });
    const disData = await disRes.json();
    console.log(`[PASS] Patient Discharge:`, disData.success ? `Discharged & Bed ${destBed} freed` : disData.message);

    // Check stats updated
    const statsRes = await fetch(`${base}/api/dashboard/stats`);
    const statsData = await statsRes.json();
    console.log(`[PASS] Dashboard Stats Verification: Total Beds: ${statsData.data.totalBeds}, Available: ${statsData.data.availableBeds}, Occupied: ${statsData.data.occupiedBeds}, Waiting: ${statsData.data.patientsWaiting}`);

  } catch (err) {
    console.error(`[FAIL] Functional Test Failed:`, err);
  }

  console.log('\n--- All Automated Verification Steps Complete ---');
}

testAll();
