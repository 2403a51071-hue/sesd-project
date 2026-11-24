import { DashboardStats, Patient } from './app.js';

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}

export interface ActivityResponse {
  success: boolean;
  data: {
    activities: any[];
    recentAdmissions: Patient[];
  };
}
