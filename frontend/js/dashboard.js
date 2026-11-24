/**
 * Dashboard Page Logic
 * Renders Stat Cards, Chart.js Visualizations, Recent Admissions Table & Activity Stream
 */

let occupancyChartInstance = null;
let departmentChartInstance = null;

async function loadDashboard() {
  try {
    // Parallel fetch
    const [statsResp, activitiesResp] = await Promise.all([
      API.getDashboardStats(),
      API.getActivities(7)
    ]);

    if (statsResp.success && statsResp.data) {
      updateStatCards(statsResp.data);
      updateAnalyticsBanner(statsResp.data);
      renderOccupancyChart(statsResp.data);
      renderDepartmentChart(statsResp.data.departmentStats);
    }

    if (activitiesResp.success && activitiesResp.data) {
      renderRecentAdmissions(activitiesResp.data.recentAdmissions);
      renderRecentActivities(activitiesResp.data.activities);
    }

    refreshSidebarStats();
  } catch (err) {
    console.error('Error loading dashboard data:', err);
    showToast('Failed to load dashboard metrics. Check server connection.', 'danger');
  }
}

function updateStatCards(stats) {
  document.getElementById('stat-total-beds').textContent = stats.totalBeds;
  document.getElementById('stat-available-beds').textContent = stats.availableBeds;
  document.getElementById('stat-occupied-beds').textContent = stats.occupiedBeds;
  document.getElementById('stat-waiting-patients').textContent = stats.patientsWaiting;
}

function updateAnalyticsBanner(stats) {
  document.getElementById('metric-daily-adm').textContent = stats.dailyAdmissions;
  document.getElementById('metric-daily-dis').textContent = stats.dailyDischarges;
  document.getElementById('metric-occupancy-rate').textContent = `${stats.occupancyPercentage}%`;
  document.getElementById('metric-turnover-rate').textContent = stats.bedTurnoverRate;
  document.getElementById('chart-center-percent').textContent = `${stats.occupancyPercentage}%`;
}

// Chart A: Bed Occupancy Doughnut Chart
function renderOccupancyChart(stats) {
  const ctx = document.getElementById('occupancyDoughnutChart');
  if (!ctx) return;

  if (occupancyChartInstance) {
    occupancyChartInstance.destroy();
  }

  occupancyChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Occupied', 'Available', 'Maintenance', 'Reserved'],
      datasets: [{
        data: [
          stats.occupiedBeds,
          stats.availableBeds,
          stats.maintenanceBeds,
          stats.reservedBeds
        ],
        backgroundColor: [
          '#EF4444', // Red
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#3B82F6'  // Blue
        ],
        hoverOffset: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = stats.totalBeds || 250;
              const val = context.raw || 0;
              const pct = Math.round((val / total) * 100);
              return ` ${context.label}: ${val} beds (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

// Chart B: Department-wise Bed Availability Bar Chart
function renderDepartmentChart(deptStats) {
  const ctx = document.getElementById('departmentBarChart');
  if (!ctx || !deptStats) return;

  if (departmentChartInstance) {
    departmentChartInstance.destroy();
  }

  const labels = deptStats.map(d => d.department);
  const occupiedData = deptStats.map(d => d.occupied);
  const availableData = deptStats.map(d => d.available);

  departmentChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Occupied',
          data: occupiedData,
          backgroundColor: '#EF4444',
          borderRadius: 4
        },
        {
          label: 'Available',
          data: availableData,
          backgroundColor: '#10B981',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            font: { family: 'Inter', size: 11 }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Inter', size: 11, weight: '500' } }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#F1F5F9' },
          ticks: { font: { family: 'Inter', size: 11 } }
        }
      }
    }
  });
}

// Table C: Recent Patient Admissions Table
function renderRecentAdmissions(admissions) {
  const tbody = document.getElementById('admissions-table-body');
  if (!tbody) return;

  if (!admissions || admissions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #64748B;">No recent admissions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = admissions.slice(0, 7).map(patient => {
    let statusClass = 'badge-admitted';
    if (patient.status === 'Under Treatment') statusClass = 'badge-treatment';
    if (patient.status === 'Ready for Discharge') statusClass = 'badge-ready';

    return `
      <tr>
        <td style="font-weight: 700; color: #163A5F;">${patient.id}</td>
        <td>
          <div style="font-weight: 600;">${patient.name}</div>
          <div style="font-size: 0.72rem; color: #64748B;">${patient.medicalCondition}</div>
        </td>
        <td><span class="badge badge-waiting">${patient.department}</span></td>
        <td><strong style="color: #0F2742;">${patient.bedNumber || 'Unassigned'}</strong></td>
        <td>${patient.admissionDate || 'Today'}</td>
        <td><span class="badge ${statusClass}">${patient.status}</span></td>
      </tr>
    `;
  }).join('');
}

// Section D: Recent Activities
function renderRecentActivities(activities) {
  const feed = document.getElementById('dashboard-activity-feed');
  if (!feed) return;

  if (!activities || activities.length === 0) {
    feed.innerHTML = `<div style="text-align: center; color: #64748B;">No recent activities logged.</div>`;
    return;
  }

  feed.innerHTML = activities.slice(0, 5).map(act => {
    const timeAgo = formatTimeAgo(act.timestamp);
    const badgeType = act.badgeType || 'info';

    return `
      <div class="activity-item">
        <div class="activity-icon-wrap ${badgeType}">
          <i data-lucide="${getActIcon(act.type)}" style="width: 18px; height: 18px;"></i>
        </div>
        <div class="activity-content">
          <div class="activity-title">${act.title}</div>
          <div class="activity-desc">${act.description}</div>
          <div class="activity-meta">
            <span class="activity-time">${timeAgo}</span>
            ${act.department ? `<span class="badge badge-waiting" style="font-size: 0.68rem; padding: 1px 6px;">${act.department}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// Quick Auto-Allocate Handler
function initQuickActions() {
  const btn = document.getElementById('btn-quick-smart-allocate');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Allocating...`;
    try {
      const resp = await API.smartAutoAllocate();
      if (resp.success) {
        showToast(resp.message, 'success');
        // Refresh dashboard
        await loadDashboard();
      }
    } catch (err) {
      showToast(err.message || 'Auto-allocation failed', 'danger');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="zap"></i><span>Auto-Allocate Next</span>`;
      if (window.lucide) lucide.createIcons();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  initQuickActions();
});
