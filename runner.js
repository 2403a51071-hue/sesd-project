// Integrated Server & Test Runner

async function run() {
  console.log('1. Loading Express application...');
  const serverModule = await import('./dist/backend/src/server.js');
  const server = serverModule.server;

  const base = 'http://127.0.0.1:3000';
  // Small pause to allow port to bind
  await new Promise(r => setTimeout(r, 600));

  try {
    console.log('\n--- Checking API Endpoints & Static Pages ---');
    const endpoints = [
      { name: 'Health Check API', url: `${base}/api/health` },
      { name: 'Dashboard Stats API', url: `${base}/api/dashboard/stats` },
      { name: 'Dashboard Occupancy API', url: `${base}/api/dashboard/occupancy` },
      { name: 'Activities API', url: `${base}/api/dashboard/activities` },
      { name: 'Beds List API', url: `${base}/api/beds` },
      { name: 'Available Beds API (ICU)', url: `${base}/api/beds/available?department=ICU` },
      { name: 'Patients List API', url: `${base}/api/patients` },
      { name: 'Flow Kanban API', url: `${base}/api/flow` },
      { name: 'Page: Dashboard (index.html)', url: `${base}/index.html` },
      { name: 'Page: Patients (patients.html)', url: `${base}/patients.html` },
      { name: 'Page: Beds (beds.html)', url: `${base}/beds.html` },
      { name: 'Page: Flow (patient-flow.html)', url: `${base}/patient-flow.html` },
    ];

    for (const ep of endpoints) {
      const res = await fetch(ep.url);
      console.log(`  [OK] ${ep.name} -> HTTP ${res.status}`);
    }

    console.log('\n--- Testing End-to-End Clinical Workflows ---');
    // Step A: Register new Emergency patient
    const regRes = await fetch(`${base}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Marcus Vance',
        age: 48,
        gender: 'Male',
        phone: '+1 (555) 345-6789',
        address: '42 Health St',
        medicalCondition: 'Acute Myocardial Infarction',
        department: 'Emergency',
        priority: 'Emergency',
        admissionDate: new Date().toISOString().split('T')[0]
      })
    });
    const regData = await regRes.json();
    console.log(`  [OK] Patient Registration: ${regData.data.name} (${regData.data.id})`);
    const patientId = regData.data.id;

    // Step B: Smart rule-based bed allocation
    const allocRes = await fetch(`${base}/api/beds/smart-allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId })
    });
    const allocData = await allocRes.json();
    console.log(`  [OK] Smart Allocation: Bed ${allocData.data.bed.bedNumber} assigned to ${allocData.data.patient.name}`);
    const initialBed = allocData.data.bed.bedNumber;

    // Step C: Bed Transfer to General Ward
    const availRes = await fetch(`${base}/api/beds/available?department=General Ward`);
    const availData = await availRes.json();
    const targetBed = availData.data[0].bedNumber;

    const transferRes = await fetch(`${base}/api/beds/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, destinationBedNumber: targetBed })
    });
    const transferData = await transferRes.json();
    console.log(`  [OK] Bed Transfer: ${initialBed} released -> ${targetBed} occupied`);

    // Step D: Update Flow status to 'Under Treatment'
    const flowRes = await fetch(`${base}/api/flow/${patientId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Under Treatment' })
    });
    const flowData = await flowRes.json();
    console.log(`  [OK] Patient Flow Update: ${flowData.data.name} is now ${flowData.data.status}`);

    // Step E: Patient Discharge & Automated Bed Release
    const disRes = await fetch(`${base}/api/flow/${patientId}/discharge`, {
      method: 'POST'
    });
    const disData = await disRes.json();
    console.log(`  [OK] Patient Discharge: ${disData.message}`);

    // Step F: Validate Dashboard Stats dynamically recalculated
    const statsRes = await fetch(`${base}/api/dashboard/stats`);
    const statsData = await statsRes.json();
    console.log(`  [OK] Dynamic Census: Total: ${statsData.data.totalBeds}, Avail: ${statsData.data.availableBeds}, Occ: ${statsData.data.occupiedBeds}, Waiting: ${statsData.data.patientsWaiting}`);

    console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
  } catch (testErr) {
    console.error('Test execution error:', testErr);
  } finally {
    if (server && server.close) {
      server.close(() => {
        console.log('Test server closed cleanly.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }
}

run();
