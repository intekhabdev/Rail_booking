import API from "./api";

export const getDashboardStats = () => API.get("/admin/stats");

export const getDailyRevenue = () => API.get("/admin/revenue/daily");
export const getMonthlyRevenue = () => API.get("/admin/revenue/monthly");

export const getTrainAnalytics = () => API.get("/admin/analytics/trains");
export const getPopularRoutes = () => API.get("/admin/analytics/routes");
export const getPeakHours = () => API.get("/admin/analytics/hours");

export const getAllTransactions = () => API.get("/admin/transactions");
export const getPaidTransactions = () => API.get("/admin/transactions/paid");
