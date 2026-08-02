import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Train from "../models/Train.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalTrains = await Train.countDocuments();
    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalFare" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        totalUsers,
        totalTrains,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDailyRevenue = async (req, res) => {
  try {
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalFare" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ success: true, data: revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyRevenue = async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalFare" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTrainAnalytics = async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $lookup: {
          from: "trains",
          localField: "trainId",
          foreignField: "_id",
          as: "trainDetails",
        },
      },
      { $unwind: "$trainDetails" },
      {
        $group: {
          _id: "$trainId",
          trainName: { $first: "$trainDetails.trainName" },
          trainNumber: { $first: "$trainDetails.trainNumber" },
          totalTicketsSold: { $sum: "$seatsBooked" },
          totalRevenueGenerated: { $sum: "$totalFare" },
        },
      },
      { $sort: { totalTicketsSold: -1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPopularRoutes = async (req, res) => {
  try {
    const data = await Booking.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $lookup: {
          from: "trains",
          localField: "trainId",
          foreignField: "_id",
          as: "train",
        },
      },
      { $unwind: "$train" },
      {
        $group: {
          _id: { source: "$train.source", destination: "$train.destination" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPeakHours = async (req, res) => {
  try {
    const data = await Booking.aggregate([
      {
        $group: {
          _id: { $hour: "$createdAt" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Booking.find()
      .populate("userId", "name email")
      .populate("trainId", "trainName trainNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaidTransactions = async (req, res) => {
  try {
    const transactions = await Booking.find({ paymentStatus: "Paid" })
      .populate("userId", "name email")
      .populate("trainId", "trainName trainNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
