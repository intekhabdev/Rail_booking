import Train from "../models/Train.js";
import Booking from "../models/Booking.js";
import { generatePNR } from "../utils/generatePNR.js";
import { allocateSeats } from "../utils/allocateSeats.js";
import { sendCancelEmail } from "../utils/sendCancelEmail.js";
import User from "../models/User.js";

export const bookTicket = async (req, res) => {
  try {
    const { trainId, seatsBooked, journeyDate } = req.body;

    if (!journeyDate) {
      return res.status(400).json({
        message: "Journey date is required",
      });
    }

    const train = await Train.findById(trainId);

    if (!train) {
      return res.status(404).json({
        message: "Train not found",
      });
    }

    const existingBookings = await Booking.find({
      trainId,
      status: "CONFIRMED",
    });

    const bookedSeats = existingBookings.flatMap(
      (booking) => booking.seatNumbers || [],
    );

    let seatNumbers = [];
    let status = "PENDING";
    let waitlistStatus = "NONE";

    if (train.availableSeats >= seatsBooked) {
      seatNumbers = allocateSeats(train.totalSeats, bookedSeats, seatsBooked);

      if (seatNumbers.length < seatsBooked) {
        return res.status(400).json({
          message: "Unable to allocate seats",
        });
      }

      status = "PENDING";
      waitlistStatus = "NONE";
    } else {
      const waitlistCount = await Booking.countDocuments({
        trainId,
        waitlistStatus: "WAITLIST",
        status: { $ne: "CANCELLED" },
      });

      if (waitlistCount < 10) {
        waitlistStatus = "WAITLIST";
      } else {
        waitlistStatus = "RAC";
      }

      seatNumbers = [];
      status = "PENDING";
    }

    const totalFare = train.fare * seatsBooked;

    const booking = await Booking.create({
      userId: req.user._id,
      trainId,
      journeyDate,
      seatsBooked,
      seatNumbers,
      totalFare,
      pnr: generatePNR(),
      status,
      paymentStatus: "Pending",
      waitlistStatus,
    });

    res.status(201).json({
      success: true,
      message:
        waitlistStatus === "NONE"
          ? "Booking initialized"
          : `Booking added to ${waitlistStatus}`,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const cancelTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        message: "Ticket already cancelled",
      });
    }

    const cancellationCharge = Math.floor(booking.totalFare * 0.1);
    const refundAmount = booking.totalFare - cancellationCharge;
    const train = await Train.findById(booking.trainId);
    if (train && booking.waitlistStatus === "NONE") {
      train.availableSeats += booking.seatsBooked;
      await train.save();
    }

    await checkRACUpgrade(booking.trainId, booking.journeyDate);
    booking.status = "CANCELLED";
    booking.paymentStatus = "Refund Initiated";
    booking.cancellationCharge = cancellationCharge;
    booking.refundAmount = refundAmount;

    await booking.save();

    const user = await User.findById(booking.userId);

    if (user && train) {
      try {
        await sendCancelEmail(user, booking, train);
        console.log("CANCELLATION EMAIL SENT");
      } catch (err) {
        console.log("CANCEL EMAIL ERROR:", err.message);
      }
    }

    res.status(200).json({
      message: "Ticket cancelled successfully",
      refundAmount,
      cancellationCharge,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const checkSeatAvailability = async (req, res) => {
  try {
    const train = await Train.findById(req.params.trainId);

    if (!train) {
      return res.status(404).json({
        message: "Train not found",
      });
    }

    res.status(200).json({
      trainName: train.trainName,
      trainNumber: train.trainNumber,
      availableSeats: train.availableSeats,
      totalSeats: train.totalSeats,
      status: train.availableSeats > 0 ? "Seats Available" : "Sold Out",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("trainId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkRACUpgrade = async (trainId, journeyDate) => {
  const train = await Train.findById(trainId);
  if (!train || train.availableSeats <= 0) return;

  const existingBookings = await Booking.find({
    trainId,
    journeyDate,
    status: "CONFIRMED",
    waitlistStatus: "NONE",
  });
  let bookedSeats = existingBookings.flatMap((b) => b.seatNumbers || []);

  const overflowBookings = await Booking.find({
    trainId,
    journeyDate,
    status: "CONFIRMED",
    waitlistStatus: { $in: ["RAC", "WAITLIST"] },
  }).sort({ createdAt: 1 });

  for (let booking of overflowBookings) {
    if (train.availableSeats >= booking.seatsBooked) {
      const dynamicSeats = allocateSeats(
        train.totalSeats,
        bookedSeats,
        booking.seatsBooked,
      );

      if (dynamicSeats.length === booking.seatsBooked) {
        booking.waitlistStatus = "NONE";
        booking.seatNumbers = dynamicSeats;

        bookedSeats = [...bookedSeats, ...dynamicSeats];
        train.availableSeats -= booking.seatsBooked;

        await booking.save();
        const user = await User.findById(booking.userId);
        if (user) {
          try {
            await sendBookingEmail(user, booking, train);
            console.log(`Upgrade email sent to ${user.email}`);
          } catch (err) {
            console.log("Upgrade email failed:", err.message);
          }
        }
      }
    }
  }

  await train.save();
};
