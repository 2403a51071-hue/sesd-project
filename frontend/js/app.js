/**
 * Smart Hospital Bed Allocation & Patient Flow Management System
 * Shared Application Core & API Client
 */

// Centralized API Client
const API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error(`API Error on ${url}:`, error);
      throw error;
    }
  },

  // Dashboard APIs
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  },

  async getOccupancy() {
    return this.request('/dashboard/occupancy');
  },

  async getActivities(limit = 10) {
    return this.request(`/dashboard/activities?limit=${limit}`);
  },

  // Patient APIs
  async getPatients(filters = {}) {
    const params = new URLSearchParams();
    if (filters.department && filters.department !== 'All') params.append('department', filters.department);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/patients${query}`);
  },

  async getPatient(id) {
    return this.request(`/patients/${id}`);
  },

  async createPatient(patientData) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData)
    });
  },

  async updatePatient(id, patientData) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData)
    });
  },

  async deletePatient(id) {
    return this.request(`/patients/${id}`, {
      method: 'DELETE'
    });
  },

  // Bed APIs
  async getBeds(department = 'All', status = 'All') {
    const params = new URLSearchParams();
    if (department && department !== 'All') params.append('department', department);
    if (status && status !== 'All') params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/beds${query}`);
  },

  async getAvailableBeds(department) {
    const query = department && department !== 'All' ? `?department=${encodeURIComponent(department)}` : '';
    return this.request(`/beds/available${query}`);
  },

  async allocateBed(patientId, bedNumber, admissionDate) {
    return this.request('/beds/allocate', {
      method: 'POST',
      body: JSON.stringify({ patientId, bedNumber, admissionDate })
    });
  },

  async smartAutoAllocate(patientId) {
    return this.request('/beds/smart-allocate', {
      method: 'POST',
      body: JSON.stringify({ patientId })
    });
  },

  async transferBed(patientId, destinationBedNumber) {
    return this.request('/beds/transfer', {
      method: 'POST',
      body: JSON.stringify({ patientId, destinationBedNumber })
    });
  },

  async updateBedMaintenance(bedNumber, maintenance) {
    return this.request(`/beds/${encodeURIComponent(bedNumber)}`, {
      method: 'PUT',
      body: JSON.stringify({ maintenance })
    });
  },

  // Patient Flow APIs
  async getFlow() {
    return this.request('/flow');
  },

  async updateFlowStatus(patientId, status) {
    return this.request(`/flow/${patientId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  async dischargePatient(patientId) {
    return this.request(`/flow/${patientId}/discharge`, {
      method: 'POST'
    });
  }
};

// Toast Notification System
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'danger') iconName = 'alert-triangle';
  if (type === 'warning') iconName = 'alert-circle';

  toast.innerHTML = `
    <div class="toast-icon"><i data-lucide="${iconName}"></i></div>
    <div class="toast-msg">${message}</div>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}

// Confirmation Modal Utility
function showConfirmDialog(title, message, confirmText = 'Confirm', onConfirm, isDanger = false) {
  let modalOverlay = document.getElementById('global-confirm-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'global-confirm-modal';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-dialog" style="max-width: 440px;">
        <div class="modal-header">
          <h3 id="confirm-modal-title"><i data-lucide="help-circle"></i> Confirm Action</h3>
          <button class="modal-close-btn" id="confirm-modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p id="confirm-modal-message" style="font-size: 0.95rem; color: #334155; line-height: 1.5;"></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline btn-sm" id="confirm-modal-cancel">Cancel</button>
          <button class="btn btn-sm" id="confirm-modal-proceed"></button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    const close = () => modalOverlay.classList.remove('active');
    document.getElementById('confirm-modal-close').onclick = close;
    document.getElementById('confirm-modal-cancel').onclick = close;
  }

  document.getElementById('confirm-modal-title').innerHTML = `<i data-lucide="${isDanger ? 'alert-triangle' : 'help-circle'}"></i> ${title}`;
  document.getElementById('confirm-modal-message').textContent = message;
  
  const proceedBtn = document.getElementById('confirm-modal-proceed');
  proceedBtn.textContent = confirmText;
  proceedBtn.className = isDanger ? 'btn btn-danger btn-sm' : 'btn btn-accent btn-sm';
  proceedBtn.onclick = async () => {
    modalOverlay.classList.remove('active');
    if (typeof onConfirm === 'function') {
      await onConfirm();
    }
  };

  modalOverlay.classList.add('active');
  if (window.lucide) lucide.createIcons();
}

// Update Topbar Clock
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }
  update();
  setInterval(update, 1000);
}

// Notification Bell Dropdown Toggle & Population
function initNotificationDropdown() {
  const notifBtn = document.getElementById('notif-btn');
  const dropdown = document.getElementById('notif-dropdown');
  if (!notifBtn || !dropdown) return;

  notifBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');

    if (dropdown.classList.contains('show')) {
      try {
        const resp = await API.getActivities(6);
        const listEl = document.getElementById('notif-list');
        if (listEl && resp.data && resp.data.activities) {
          listEl.innerHTML = resp.data.activities.map(act => {
            const timeAgo = formatTimeAgo(act.timestamp);
            return `
              <div class="notification-item">
                <i data-lucide="${getActIcon(act.type)}" style="width: 18px; height: 18px; color: #13A89E; flex-shrink: 0; margin-top: 2px;"></i>
                <div>
                  <div style="font-weight: 600; color: #163A5F;">${act.title}</div>
                  <div style="color: #64748B; font-size: 0.78rem;">${act.description}</div>
                  <div class="time">${timeAgo}</div>
                </div>
              </div>
            `;
          }).join('');
          if (window.lucide) lucide.createIcons();
        }
      } catch (err) {
        console.error('Error fetching activities for dropdown:', err);
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !notifBtn.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
}

function getActIcon(type) {
  switch (type) {
    case 'Registration': return 'user-plus';
    case 'Allocation': return 'check-circle';
    case 'Transfer': return 'repeat';
    case 'Discharge': return 'log-out';
    case 'Maintenance': return 'wrench';
    default: return 'activity';
  }
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now';
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Refresh Sidebar Live Stats
async function refreshSidebarStats() {
  try {
    const resp = await API.getDashboardStats();
    if (resp.success && resp.data) {
      const { availableBeds, patientsWaiting } = resp.data;
      const availEl = document.getElementById('sidebar-avail-val');
      const waitEl = document.getElementById('sidebar-wait-val');
      const badgeAvail = document.getElementById('sidebar-badge-avail');
      const badgeWait = document.getElementById('sidebar-badge-wait');

      if (availEl) availEl.textContent = availableBeds;
      if (waitEl) waitEl.textContent = patientsWaiting;
      if (badgeAvail) badgeAvail.textContent = availableBeds;
      if (badgeWait) badgeWait.textContent = patientsWaiting;
    }
  } catch (err) {
    console.error('Error updating sidebar live metrics:', err);
  }
}

// Auto-run on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initNotificationDropdown();
  refreshSidebarStats();
  if (window.lucide) {
    lucide.createIcons();
  }
});
