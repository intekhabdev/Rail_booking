import { useEffect, useState } from "react";
import {
  getAllTransactions,
  getDailyRevenue,
  getDashboardStats,
  getTrainAnalytics,
} from "../api/admin";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [trainAnalytics, setTrainAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const statsRes = await getDashboardStats();
      setStats(statsRes?.data?.stats || {});

      const revenueRes = await getDailyRevenue();
      const rawRevenue = revenueRes?.data;
      setRevenue(
        Array.isArray(rawRevenue) ? rawRevenue : rawRevenue?.data || [],
      );

      const trainRes = await getTrainAnalytics();
      const rawTrainData = trainRes?.data;
      setTrainAnalytics(
        Array.isArray(rawTrainData) ? rawTrainData : rawTrainData?.data || [],
      );

      const txnRes = await getAllTransactions();
      const rawTxnData = txnRes?.data;
      setTransactions(
        Array.isArray(rawTxnData) ? rawTxnData : rawTxnData?.data || [],
      );
    } catch (error) {
      console.error("Error loading dashboard metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700 border border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getPaymentColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700 border border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium text-gray-600 animate-pulse">
          Loading Dashboard Analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl shadow-sm">
            <h2 className="text-blue-100 font-medium tracking-wide">
              Total Revenue
            </h2>
            <p className="text-3xl font-bold mt-2">
              ₹{(stats.totalRevenue || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-xl shadow-sm">
            <h2 className="text-green-100 font-medium tracking-wide">
              Total Bookings
            </h2>
            <p className="text-3xl font-bold mt-2">
              {stats.totalBookings || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-xl shadow-sm">
            <h2 className="text-purple-100 font-medium tracking-wide">
              Total Users
            </h2>
            <p className="text-3xl font-bold mt-2">{stats.totalUsers || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white p-6 rounded-xl shadow-sm">
            <h2 className="text-orange-100 font-medium tracking-wide">
              Total Trains
            </h2>
            <p className="text-3xl font-bold mt-2">{stats.totalTrains || 0}</p>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Revenue Trends 📈
          </h2>

          {!Array.isArray(revenue) || revenue.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">
              No structural revenue points tracked for this interval.
            </p>
          ) : (
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenue}
                  margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="_id" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="mt-10 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Train Performance Analytics 🚆
          </h2>

          {!Array.isArray(trainAnalytics) || trainAnalytics.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">
              No train execution analytics available.
            </p>
          ) : (
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto pr-2">
              {trainAnalytics.map((t, index) => (
                <div
                  key={t._id || index}
                  className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {t.trainName || "Unknown Operational Express"}
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        (#{t.trainNumber || "N/A"})
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Operational Performance Profile
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Tickets Sold
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {t.totalTicketsSold || 0}
                      </p>
                    </div>
                    <div className="min-w-[100px]">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Revenue
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        ₹
                        {(t.totalRevenueGenerated || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Bookings & Ledger 💳
          </h2>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Train Context</th>
                  <th className="p-4 font-semibold">Fare Value</th>
                  <th className="p-4 font-semibold text-center">
                    Booking Status
                  </th>
                  <th className="p-4 font-semibold text-center">
                    Ledger Settlement
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-gray-700">
                {transactions?.length > 0 ? (
                  transactions.map((t, index) => (
                    <tr
                      key={t._id || index}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-900">
                        {t.userId?.name || "System Guest"}
                      </td>
                      <td className="p-4 text-gray-600">
                        {t.trainId?.trainName || "Route Record Unlinked"}
                      </td>
                      <td className="p-4 font-semibold text-gray-900">
                        ₹{(t.totalFare || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm uppercase ${getStatusColor(t.status)}`}
                        >
                          {t.status || "Unknown"}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm uppercase ${getPaymentColor(t.paymentStatus)}`}
                        >
                          {t.paymentStatus || "Unverified"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-gray-400">
                      No operational transaction ledger entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
