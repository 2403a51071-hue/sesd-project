/**
 * Patient Management Page Logic
 * Handles Patient CRUD, Filtering, Searching, and View Modal
 */

let patientsCache = [];

async function loadPatients() {
  const department = document.getElementById('filter-department').value;
  const status = document.getElementById('filter-status').value;
  const priority = document.getElementById('filter-priority').value;
  const search = document.getElementById('patient-search-input').value.trim();

  const tbody = document.getElementById('patients-table-body');
  const countBadge = document.getElementById('patients-count-badge');

  try {
    const resp = await API.getPatients({ department, status, priority, search });
    if (resp.success && resp.data) {
      patientsCache = resp.data;
      renderPatientsTable(patientsCache);
      countBadge.textContent = `${resp.data.length} Inpatients`;
    }
    refreshSidebarStats();
  } catch (err) {
    console.error('Error fetching patients:', err);
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 30px; color:#EF4444;">Failed to load patient records.</td></tr>`;
  }
}

function renderPatientsTable(patients) {
  const tbody = document.getElementById('patients-table-body');
  if (!tbody) return;

  if (patients.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 40px; color: #64748B;">No matching patients found.</td></tr>`;
    return;
  }

  tbody.innerHTML = patients.map(p => {
    // Priority Badge
    let priorityClass = 'badge-priority-low';
    if (p.priority === 'Emergency') priorityClass = 'badge-priority-emergency';
    else if (p.priority === 'High') priorityClass = 'badge-priority-high';
    else if (p.priority === 'Medium') priorityClass = 'badge-priority-medium';

    // Status Badge
    let statusClass = 'badge-waiting';
    if (p.status === 'Admitted') statusClass = 'badge-admitted';
    else if (p.status === 'Under Treatment') statusClass = 'badge-treatment';
    else if (p.status === 'Ready for Discharge') statusClass = 'badge-ready';
    else if (p.status === 'Discharged') statusClass = 'badge-discharged';

    const canAllocate = p.status === 'Waiting' || !p.bedNumber;

    return `
      <tr>
        <td style="font-weight: 700; color: #163A5F;">${p.id}</td>
        <td>
          <div style="font-weight: 600;">${p.name}</div>
          <div style="font-size: 0.72rem; color: #64748B;">${p.medicalCondition}</div>
        </td>
        <td>${p.age}</td>
        <td>${p.gender}</td>
        <td style="font-size: 0.8rem; color: #475569;">${p.phone}</td>
        <td><span class="badge badge-waiting">${p.department}</span></td>
        <td>${p.admissionDate}</td>
        <td><span class="badge ${priorityClass}">${p.priority}</span></td>
        <td>
          <span class="badge ${statusClass}">${p.status}</span>
          ${p.bedNumber ? `<div style="font-size: 0.72rem; color: #0F2742; font-weight: 600; margin-top: 2px;">Bed: ${p.bedNumber}</div>` : ''}
        </td>
        <td>
          <div class="patient-action-btns">
            ${canAllocate ? `
              <button class="action-icon-btn allocate" title="Allocate Bed Now" onclick="quickAllocatePatient('${p.id}')">
                <i data-lucide="bed"></i>
              </button>
            ` : ''}
            <button class="action-icon-btn" title="View Patient File" onclick="openViewModal('${p.id}')">
              <i data-lucide="eye"></i>
            </button>
            <button class="action-icon-btn edit" title="Edit Patient Details" onclick="openEditModal('${p.id}')">
              <i data-lucide="edit-2"></i>
            </button>
            <button class="action-icon-btn delete" title="Delete Patient Record" onclick="confirmDeletePatient('${p.id}', '${p.name.replace(/'/g, "\\'")}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// Quick Allocate from Patient Table
async function quickAllocatePatient(patientId) {
  try {
    const resp = await API.smartAutoAllocate(patientId);
    showToast(resp.message, 'success');
    await loadPatients();
  } catch (err) {
    showToast(err.message, 'danger');
  }
}

// Open View Modal
function openViewModal(patientId) {
  const patient = patientsCache.find(p => p.id === patientId);
  if (!patient) return;

  const body = document.getElementById('view-patient-body');
  const initials = patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  body.innerHTML = `
    <div class="patient-profile-header">
      <div class="patient-avatar-large">${initials}</div>
      <div>
        <h4 style="font-size: 1.15rem; color: #163A5F; font-weight: 700;">${patient.name}</h4>
        <div style="font-size: 0.8rem; color: #64748B;">ID: <strong>${patient.id}</strong> &bull; ${patient.age} yrs &bull; ${patient.gender}</div>
        <div style="margin-top: 6px; display: flex; gap: 8px;">
          <span class="badge ${patient.priority === 'Emergency' ? 'badge-priority-emergency' : 'badge-priority-medium'}">${patient.priority} Priority</span>
          <span class="badge badge-admitted">${patient.status}</span>
        </div>
      </div>
    </div>

    <div class="patient-details-grid">
      <div class="detail-item">
        <span class="label">Assigned Department</span>
        <span class="value">${patient.department}</span>
      </div>
      <div class="detail-item">
        <span class="label">Bed Number</span>
        <span class="value" style="color: #13A89E; font-size: 1.05rem;">${patient.bedNumber || 'Not Allocated (Waiting Queue)'}</span>
      </div>
      <div class="detail-item">
        <span class="label">Admission Date</span>
        <span class="value">${patient.admissionDate}</span>
      </div>
      <div class="detail-item">
        <span class="label">Attending Physician</span>
        <span class="value">${patient.assignedDoctor || 'Dr. Vance (On-Call)'}</span>
      </div>
      <div class="detail-item col-span-2">
        <span class="label">Primary Diagnosis / Condition</span>
        <span class="value" style="color: #0F2742;">${patient.medicalCondition}</span>
      </div>
      <div class="detail-item">
        <span class="label">Contact Phone</span>
        <span class="value">${patient.phone}</span>
      </div>
      <div class="detail-item">
        <span class="label">Residential Address</span>
        <span class="value">${patient.address}</span>
      </div>
    </div>
  `;

  document.getElementById('modal-view-patient').classList.add('active');
  if (window.lucide) lucide.createIcons();
}

// Open Edit Modal
function openEditModal(patientId) {
  const patient = patientsCache.find(p => p.id === patientId);
  if (!patient) return;

  document.getElementById('edit-id').value = patient.id;
  document.getElementById('edit-id-display').value = patient.id;
  document.getElementById('edit-name').value = patient.name;
  document.getElementById('edit-age').value = patient.age;
  document.getElementById('edit-gender').value = patient.gender;
  document.getElementById('edit-phone').value = patient.phone;
  document.getElementById('edit-dept').value = patient.department;
  document.getElementById('edit-priority').value = patient.priority;
  document.getElementById('edit-status').value = patient.status;
  document.getElementById('edit-condition').value = patient.medicalCondition;
  document.getElementById('edit-address').value = patient.address || '';

  document.getElementById('modal-edit-patient').classList.add('active');
}

// Confirm Delete Patient
function confirmDeletePatient(patientId, patientName) {
  showConfirmDialog(
    'Delete Patient Record',
    `Are you sure you want to permanently delete patient ${patientName} (${patientId})? If the patient is assigned to an active bed, the bed will be automatically released and sanitized.`,
    'Delete Record',
    async () => {
      try {
        const resp = await API.deletePatient(patientId);
        showToast(resp.message || 'Patient deleted successfully', 'success');
        await loadPatients();
      } catch (err) {
        showToast(err.message, 'danger');
      }
    },
    true
  );
}

// Event Listeners Initialization
function initEventListeners() {
  // Add Patient Modal Triggers
  const openAddBtn = document.getElementById('btn-open-add-modal');
  const addModal = document.getElementById('modal-add-patient');
  if (openAddBtn && addModal) {
    openAddBtn.addEventListener('click', () => {
      // Set default date to today
      document.getElementById('add-admission-date').value = new Date().toISOString().split('T')[0];
      document.getElementById('form-add-patient').reset();
      document.getElementById('add-admission-date').value = new Date().toISOString().split('T')[0];
      addModal.classList.add('active');
    });
  }

  // Generic Modal Close Buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      const target = document.getElementById(targetId);
      if (target) target.classList.remove('active');
    });
  });

  // Close modals on overlay background click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });

  // Handle Add Patient Form Submission
  const addForm = document.getElementById('form-add-patient');
  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const patientData = {
        name: document.getElementById('add-name').value.trim(),
        age: parseInt(document.getElementById('add-age').value),
        gender: document.getElementById('add-gender').value,
        phone: document.getElementById('add-phone').value.trim(),
        address: document.getElementById('add-address').value.trim(),
        medicalCondition: document.getElementById('add-condition').value.trim(),
        department: document.getElementById('add-dept').value,
        priority: document.getElementById('add-priority').value,
        admissionDate: document.getElementById('add-admission-date').value
      };

      try {
        const resp = await API.createPatient(patientData);
        showToast(resp.message || 'Patient registered successfully!', 'success');
        addModal.classList.remove('active');
        addForm.reset();
        await loadPatients();
      } catch (err) {
        showToast(err.message, 'danger');
      }
    });
  }

  // Handle Edit Patient Form Submission
  const editForm = document.getElementById('form-edit-patient');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-id').value;
      const updates = {
        name: document.getElementById('edit-name').value.trim(),
        age: parseInt(document.getElementById('edit-age').value),
        gender: document.getElementById('edit-gender').value,
        phone: document.getElementById('edit-phone').value.trim(),
        address: document.getElementById('edit-address').value.trim(),
        medicalCondition: document.getElementById('edit-condition').value.trim(),
        department: document.getElementById('edit-dept').value,
        priority: document.getElementById('edit-priority').value,
        status: document.getElementById('edit-status').value
      };

      try {
        const resp = await API.updatePatient(id, updates);
        showToast(resp.message || 'Patient details updated.', 'success');
        document.getElementById('modal-edit-patient').classList.remove('active');
        await loadPatients();
      } catch (err) {
        showToast(err.message, 'danger');
      }
    });
  }

  // Filter Listeners
  document.getElementById('filter-department').addEventListener('change', loadPatients);
  document.getElementById('filter-status').addEventListener('change', loadPatients);
  document.getElementById('filter-priority').addEventListener('change', loadPatients);

  // Debounced Search
  let searchTimer = null;
  document.getElementById('patient-search-input').addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(loadPatients, 250);
  });

  // Reset Filters
  document.getElementById('btn-reset-filters').addEventListener('click', () => {
    document.getElementById('filter-department').value = 'All';
    document.getElementById('filter-status').value = 'All';
    document.getElementById('filter-priority').value = 'All';
    document.getElementById('patient-search-input').value = '';
    loadPatients();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadPatients();
  initEventListeners();
});
