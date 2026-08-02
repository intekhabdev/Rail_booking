import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },

    pnr: {
      type: String,
      required: true,
      unique: true,
    },

    seatsBooked: {
      type: Number,
      required: true,
      min: 1,
    },

    totalFare: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
    seatNumbers: [
      {
        type: String,
      },
    ],
    journeyDate: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded", "Refund Initiated"],
      default: "Pending",
    },

    razorpayOrderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },
    waitlistStatus: {
      type: String,
      enum: ["NONE", "WAITLIST", "RAC"],
      default: "NONE",
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    cancellationCharge: {
      type: Number,
      default: 0,
    },
    journeyDate: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
