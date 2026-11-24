import { Request, Response } from 'express';
import { allocationService } from '../services/allocationService.js';

export const getStats = (req: Request, res: Response): void => {
  try {
    const stats = allocationService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOccupancy = (req: Request, res: Response): void => {
  try {
    const stats = allocationService.getDashboardStats();
    res.json({
      success: true,
      data: {
        totalBeds: stats.totalBeds,
        occupiedBeds: stats.occupiedBeds,
        availableBeds: stats.availableBeds,
        maintenanceBeds: stats.maintenanceBeds,
        reservedBeds: stats.reservedBeds,
        occupancyPercentage: stats.occupancyPercentage,
        departmentBreakdown: stats.departmentStats
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActivities = (req: Request, res: Response): void => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const activities = allocationService.getRecentActivities(limit);
    const recentAdmissions = allocationService.getRecentAdmissions(limit);

    res.json({
      success: true,
      data: {
        activities,
        recentAdmissions
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
