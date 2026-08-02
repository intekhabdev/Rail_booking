import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Train from "../models/Train.js";
import { sendBookingEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const verifyPayment = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body missing",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret missing in .env",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payment Signature",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "Paid",
        status: "CONFIRMED",
      },
      { new: true },
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const train = await Train.findById(booking.trainId);

    if (train && booking.waitlistStatus === "NONE") {
      train.availableSeats -= booking.seatsBooked;
      await train.save();
    }

    const user = await User.findById(booking.userId);

    if (user && train) {
      try {
        await sendBookingEmail(user, booking, train);
        console.log("EMAIL SENT SUCCESSFULLY");
      } catch (err) {
        console.log("EMAIL ERROR:", err.message);
      }
    }
    res.status(200).json({
      success: true,
      message: "Payment Verified & Booking Confirmed",
      booking,
    });
  } catch (error) {
    console.log("VERIFY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
