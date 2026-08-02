import express from "express";
import {
  getDashboardStats,
  getDailyRevenue,
  getMonthlyRevenue,
  getTrainAnalytics,
  getPopularRoutes,
  getPeakHours,
  getAllTransactions,
  getPaidTransactions,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/revenue/daily", getDailyRevenue);
router.get("/revenue/monthly", getMonthlyRevenue);
router.get("/analytics/trains", getTrainAnalytics);
router.get("/analytics/routes", getPopularRoutes);
router.get("/analytics/hours", getPeakHours);
router.get("/transactions", getAllTransactions);
router.get("/transactions/paid", getPaidTransactions);

export default router;
