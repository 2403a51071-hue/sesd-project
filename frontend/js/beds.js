/**
 * Smart Bed Allocation Page Logic
 * Visual Bed Layout, Smart Rule-Based Allocation, Bed Transfers, Maintenance Toggles
 */

let allBedsCache = [];
let waitingPatientsCache = [];
let currentDeptFilter = 'All';
let currentStatusFilter = 'All';

async function loadBedManagementData() {
  try {
    const [statsResp, bedsResp, patientsResp] = await Promise.all([
      API.getDashboardStats(),
      API.getBeds(currentDeptFilter, currentStatusFilter),
      API.getPatients({ status: 'Waiting' })
    ]);

    if (statsResp.success && statsResp.data) {
      updateSummaryCards(statsResp.data);
    }

    if (bedsResp.success && bedsResp.data) {
      allBedsCache = bedsResp.data;
      renderBedGrid(allBedsCache);
    }

    if (patientsResp.success && patientsResp.data) {
      waitingPatientsCache = patientsResp.data;
      populateWaitingPatientSelect(waitingPatientsCache);
    }

    refreshSidebarStats();
  } catch (err) {
    console.error('Error loading bed allocation data:', err);
    showToast('Failed to load bed census data.', 'danger');
  }
}

function updateSummaryCards(stats) {
  document.getElementById('bed-summary-total').textContent = stats.totalBeds;
  document.getElementById('bed-summary-avail').textContent = stats.availableBeds;
  document.getElementById('bed-summary-occ').textContent = stats.occupiedBeds;
  document.getElementById('bed-summary-maint').textContent = stats.maintenanceBeds;
}

// Render Visual Bed Management Interface
function renderBedGrid(beds) {
  const container = document.getElementById('departments-bed-container');
  if (!container) return;

  if (beds.length === 0) {
    container.innerHTML = `
      <div class="card" style="padding: 40px; text-align: center; color: #64748B;">
        <i data-lucide="inbox" style="width: 48px; height: 48px; margin: 0 auto 12px; color: #CBD5E1;"></i>
        <h4>No beds found matching the selected filters.</h4>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  // Group beds by department
  const departments = ['General Ward', 'ICU', 'Emergency', 'Private Ward', 'Pediatric Ward'];
  const deptsToDisplay = currentDeptFilter === 'All' ? departments : [currentDeptFilter];

  let html = '';

  deptsToDisplay.forEach(deptName => {
    const deptBeds = beds.filter(b => b.department === deptName);
    if (deptBeds.length === 0) return;

    const totalInDept = deptBeds.length;
    const availInDept = deptBeds.filter(b => b.status === 'Available').length;
    const occInDept = deptBeds.filter(b => b.status === 'Occupied').length;
    const maintInDept = deptBeds.filter(b => b.status === 'Maintenance').length;
    const resInDept = deptBeds.filter(b => b.status === 'Reserved').length;
    const occPercent = Math.round((occInDept / totalInDept) * 100);

    html += `
      <div class="dept-section">
        <div class="dept-header">
          <div class="dept-title-group">
            <h3><i data-lucide="layers"></i> ${deptName}</h3>
            <span style="font-size: 0.78rem; color: #64748B;">${deptBeds[0]?.floor || 'Inpatient Floor'} &bull; ${occPercent}% Occupied</span>
          </div>

          <div class="dept-stats-pills">
            <span class="badge badge-available">${availInDept} Available</span>
            <span class="badge badge-occupied">${occInDept} Occupied</span>
            ${maintInDept > 0 ? `<span class="badge badge-maintenance">${maintInDept} Maint.</span>` : ''}
            ${resInDept > 0 ? `<span class="badge badge-reserved">${resInDept} Reserved</span>` : ''}
          </div>
        </div>

        <div class="dept-beds-grid">
          ${deptBeds.map(bed => renderBedCard(bed)).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function renderBedCard(bed) {
  let statusCardClass = 'status-available';
  let badgeClass = 'badge-available';
  if (bed.status === 'Occupied') {
    statusCardClass = 'status-occupied';
    badgeClass = 'badge-occupied';
  } else if (bed.status === 'Maintenance') {
    statusCardClass = 'status-maintenance';
    badgeClass = 'badge-maintenance';
  } else if (bed.status === 'Reserved') {
    statusCardClass = 'status-reserved';
    badgeClass = 'badge-reserved';
  }

  return `
    <div class="bed-card ${statusCardClass}">
      <div class="bed-card-header">
        <span class="bed-number">${bed.bedNumber}</span>
        <span class="badge ${badgeClass}">${bed.status}</span>
      </div>

      <div class="bed-card-body">
        ${bed.status === 'Occupied' ? `
          <div class="bed-patient-info">
            <div class="bed-patient-name" title="${bed.patientName || 'Inpatient'}">${bed.patientName || 'Assigned Inpatient'}</div>
            <div class="bed-patient-id">ID: <strong>${bed.patientId}</strong></div>
          </div>
          <div class="bed-meta-text">Admitted in ${bed.department}</div>
        ` : `
          <div style="font-size: 0.82rem; color: #64748B; padding: 6px 0;">
            ${bed.status === 'Available' ? 'Ready for patient intake.' : (bed.status === 'Maintenance' ? 'Under UV cleaning & sterilization.' : 'Reserved for scheduled admission.')}
          </div>
          <div class="bed-meta-text">${bed.room || 'Inpatient Bay'}</div>
        `}
      </div>

      <div class="bed-card-footer">
        ${bed.status === 'Available' ? `
          <button class="bed-action-btn primary" title="Allocate this Bed" onclick="openAllocateModalWithBed('${bed.bedNumber}', '${bed.department}')">
            <i data-lucide="check" style="width:12px; height:12px;"></i> Allocate
          </button>
          <button class="bed-action-btn warning" title="Mark Under Maintenance" onclick="toggleMaintenance('${bed.bedNumber}', true)">
            <i data-lucide="wrench" style="width:12px; height:12px;"></i> Maint.
          </button>
        ` : (bed.status === 'Occupied' ? `
          <button class="bed-action-btn" title="Transfer Patient to Another Bed" onclick="openTransferModal('${bed.patientId}', '${bed.patientName.replace(/'/g, "\\'")}', '${bed.bedNumber}', '${bed.department}')">
            <i data-lucide="arrow-right-left" style="width:12px; height:12px;"></i> Transfer
          </button>
          <button class="bed-action-btn danger" title="Discharge Patient and Free Bed" onclick="confirmDischargeFromBed('${bed.patientId}', '${bed.patientName.replace(/'/g, "\\'")}', '${bed.bedNumber}')">
            <i data-lucide="log-out" style="width:12px; height:12px;"></i> Discharge
          </button>
        ` : (bed.status === 'Maintenance' ? `
          <button class="bed-action-btn primary" title="Restore to Available" onclick="toggleMaintenance('${bed.bedNumber}', false)">
            <i data-lucide="check-circle" style="width:12px; height:12px;"></i> Restore
          </button>
        ` : `
          <span style="font-size: 0.72rem; color: #64748B;">Reserved</span>
        `))}
      </div>
    </div>
  `;
}

// Populate Waiting Patient Dropdown
function populateWaitingPatientSelect(patients) {
  const select = document.getElementById('alloc-patient-select');
  if (!select) return;

  if (patients.length === 0) {
    select.innerHTML = `<option value="">No patients currently waiting</option>`;
    return;
  }

  select.innerHTML = `<option value="">-- Choose Patient from Queue (${patients.length} Waiting) --</option>` +
    patients.map(p => {
      const isEmergency = p.priority === 'Emergency' ? '🚨 [EMERGENCY]' : (p.priority === 'High' ? '⚡ [HIGH]' : '');
      return `<option value="${p.id}" data-dept="${p.department}" data-priority="${p.priority}">
        ${isEmergency} ${p.name} (${p.id}) - ${p.priority} Priority - Desired: ${p.department}
      </option>`;
    }).join('');
}

// Manual Allocate Modal Helpers
async function openAllocateModalWithBed(bedNumber, department) {
  const modal = document.getElementById('modal-allocate-bed');
  document.getElementById('alloc-dept-select').value = department;
  document.getElementById('alloc-date').value = new Date().toISOString().split('T')[0];

  await refreshAvailableBedsInModal(department, bedNumber);
  modal.classList.add('active');
}

async function refreshAvailableBedsInModal(department, selectedBedNumber = '') {
  const select = document.getElementById('alloc-bed-select');
  const hint = document.getElementById('alloc-bed-hint');
  select.innerHTML = '<option value="">Loading available beds...</option>';

  try {
    const resp = await API.getAvailableBeds(department);
    if (resp.success && resp.data && resp.data.length > 0) {
      select.innerHTML = '<option value="">-- Select Available Bed --</option>' +
        resp.data.map(b => `<option value="${b.bedNumber}" ${b.bedNumber === selectedBedNumber ? 'selected' : ''}>${b.bedNumber} (${b.room || 'Ward Room'})</option>`).join('');
      hint.textContent = `${resp.data.length} beds currently available in ${department}`;
    } else {
      select.innerHTML = '<option value="">No available beds in this department</option>';
      hint.textContent = `Warning: 0 available beds in ${department}! Consider emergency transfer.`;
      hint.style.color = '#EF4444';
    }
  } catch (err) {
    select.innerHTML = '<option value="">Error fetching beds</option>';
  }
}

// Open Transfer Modal
async function openTransferModal(patientId, patientName, currentBed, currentDept) {
  const modal = document.getElementById('modal-transfer-bed');
  document.getElementById('transfer-patient-id').value = patientId;
  document.getElementById('transfer-patient-name').value = `${patientName} (${patientId})`;
  document.getElementById('transfer-current-bed').value = `${currentBed} - ${currentDept}`;

  // Default destination department to same or next
  const deptSelect = document.getElementById('transfer-dept-select');
  deptSelect.value = currentDept;

  await refreshTransferAvailableBeds(deptSelect.value);
  modal.classList.add('active');
}

async function refreshTransferAvailableBeds(department) {
  const bedSelect = document.getElementById('transfer-bed-select');
  bedSelect.innerHTML = '<option value="">Loading destination beds...</option>';
  try {
    const resp = await API.getAvailableBeds(department);
    if (resp.success && resp.data && resp.data.length > 0) {
      bedSelect.innerHTML = '<option value="">-- Choose Destination Bed --</option>' +
        resp.data.map(b => `<option value="${b.bedNumber}">${b.bedNumber} (${b.department} - ${b.room || 'Standard Bay'})</option>`).join('');
    } else {
      bedSelect.innerHTML = '<option value="">No available beds in selected department</option>';
    }
  } catch (err) {
    bedSelect.innerHTML = '<option value="">Error loading beds</option>';
  }
}

// Discharge from Bed
function confirmDischargeFromBed(patientId, patientName, bedNumber) {
  showConfirmDialog(
    'Discharge Patient',
    `Confirm discharge for ${patientName} (${patientId})? This will immediately release Bed ${bedNumber} and return it to Available service.`,
    'Confirm Discharge',
    async () => {
      try {
        const resp = await API.dischargePatient(patientId);
        showToast(resp.message || 'Patient discharged successfully.', 'success');
        await loadBedManagementData();
      } catch (err) {
        showToast(err.message, 'danger');
      }
    }
  );
}

// Toggle Maintenance Mode
function toggleMaintenance(bedNumber, underMaintenance) {
  const actionText = underMaintenance ? 'place under maintenance' : 'restore to active available service';
  showConfirmDialog(
    'Bed Maintenance Protocol',
    `Are you sure you want to ${actionText} for Bed ${bedNumber}?`,
    underMaintenance ? 'Start Maintenance' : 'Restore Bed',
    async () => {
      try {
        const resp = await API.updateBedMaintenance(bedNumber, underMaintenance);
        showToast(resp.message, 'success');
        await loadBedManagementData();
      } catch (err) {
        showToast(err.message, 'danger');
      }
    },
    underMaintenance
  );
}

// Setup Event Listeners
function initBedListeners() {
  // Department Tab Switching
  document.querySelectorAll('.bed-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bed-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDeptFilter = btn.getAttribute('data-dept');
      loadBedManagementData();
    });
  });

  // Bed Status Filter Dropdown
  document.getElementById('bed-status-filter').addEventListener('change', (e) => {
    currentStatusFilter = e.target.value;
    loadBedManagementData();
  });

  // Smart Auto-Allocate Button (Rule-Based Engine)
  const smartBtn = document.getElementById('btn-smart-auto-allocate');
  if (smartBtn) {
    smartBtn.addEventListener('click', async () => {
      smartBtn.disabled = true;
      smartBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Processing Rules...`;
      try {
        const resp = await API.smartAutoAllocate();
        showToast(resp.message, 'success');
        await loadBedManagementData();
      } catch (err) {
        showToast(err.message || 'Smart allocation could not find an eligible bed', 'danger');
      } finally {
        smartBtn.disabled = false;
        smartBtn.innerHTML = `<i data-lucide="zap"></i><span>Smart Auto-Allocate</span>`;
        if (window.lucide) lucide.createIcons();
      }
    });
  }

  // Open Manual Allocate Modal
  const openManualBtn = document.getElementById('btn-open-manual-allocate');
  const allocModal = document.getElementById('modal-allocate-bed');
  if (openManualBtn && allocModal) {
    openManualBtn.addEventListener('click', async () => {
      document.getElementById('form-allocate-bed').reset();
      document.getElementById('alloc-date').value = new Date().toISOString().split('T')[0];
      const dept = document.getElementById('alloc-dept-select').value;
      await refreshAvailableBedsInModal(dept);
      allocModal.classList.add('active');
    });
  }

  // When patient is selected in allocation modal, auto-update department & priority preview
  const patientSelect = document.getElementById('alloc-patient-select');
  if (patientSelect) {
    patientSelect.addEventListener('change', async (e) => {
      const opt = e.target.selectedOptions[0];
      if (opt && opt.value) {
        const desiredDept = opt.getAttribute('data-dept');
        const priority = opt.getAttribute('data-priority');
        document.getElementById('alloc-dept-select').value = desiredDept;
        document.getElementById('alloc-priority-preview').value = `${priority} Priority`;
        await refreshAvailableBedsInModal(desiredDept);
      }
    });
  }

  // When target department changes in allocation modal
  const deptSelect = document.getElementById('alloc-dept-select');
  if (deptSelect) {
    deptSelect.addEventListener('change', async (e) => {
      await refreshAvailableBedsInModal(e.target.value);
    });
  }

  // Allocation Form Submission
  const allocForm = document.getElementById('form-allocate-bed');
  if (allocForm) {
    allocForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const patientId = document.getElementById('alloc-patient-select').value;
      const bedNumber = document.getElementById('alloc-bed-select').value;
      const admissionDate = document.getElementById('alloc-date').value;

      if (!patientId || !bedNumber) {
        showToast('Please select both a patient and an available bed.', 'warning');
        return;
      }

      try {
        const resp = await API.allocateBed(patientId, bedNumber, admissionDate);
        showToast(resp.message, 'success');
        allocModal.classList.remove('active');
        await loadBedManagementData();
      } catch (err) {
        showToast(err.message, 'danger');
      }
    });
  }

  // Transfer Modal Destination Department Change
  const transferDeptSelect = document.getElementById('transfer-dept-select');
  if (transferDeptSelect) {
    transferDeptSelect.addEventListener('change', async (e) => {
      await refreshTransferAvailableBeds(e.target.value);
    });
  }

  // Transfer Form Submission
  const transferForm = document.getElementById('form-transfer-bed');
  if (transferForm) {
    transferForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const patientId = document.getElementById('transfer-patient-id').value;
      const destinationBedNumber = document.getElementById('transfer-bed-select').value;

      if (!destinationBedNumber) {
        showToast('Please select a valid destination bed.', 'warning');
        return;
      }

      try {
        const resp = await API.transferBed(patientId, destinationBedNumber);
        showToast(resp.message, 'success');
        document.getElementById('modal-transfer-bed').classList.remove('active');
        await loadBedManagementData();
      } catch (err) {
        showToast(err.message, 'danger');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadBedManagementData();
  initBedListeners();
});
