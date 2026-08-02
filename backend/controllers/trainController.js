import Booking from "../models/Booking.js";
import Train from "../models/Train.js";

export const addTrain = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const train = await Train.create(req.body);

    res.status(201).json({
      message: "Train added successfully 🚆",
      train,
    });
  } catch (error) {
    console.log("ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllTrains = async (req, res) => {
  try {
    const {
      search,
      source,
      destination,
      maxFare,
      page = 1,
      limit = 6,
    } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { trainName: { $regex: search, $options: "i" } },
        { trainNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (source) {
      filter.source = { $regex: source, $options: "i" };
    }

    if (destination) {
      filter.destination = { $regex: destination, $options: "i" };
    }

    if (maxFare) {
      filter.fare = { $lte: Number(maxFare) };
    }

    const skip = (page - 1) * limit;

    const trains = await Train.find(filter).skip(skip).limit(Number(limit));

    const total = await Train.countDocuments(filter);

    const trainsWithBookingInfo = await Promise.all(
      trains.map(async (train) => {
        const bookingExists = await Booking.exists({
          trainId: train._id,
        });

        return {
          ...train._doc,
          hasBookings: bookingExists ? true : false,
        };
      }),
    );

    res.status(200).json({
      trains: trainsWithBookingInfo,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalTrains: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrain = async (req, res) => {
  try {
    const train = await Train.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      message: "Train updated successfully ✏️",
      train,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrain = async (req, res) => {
  try {
    await Train.findByIdAndDelete(req.params.id);
    res.json({
      message: "Train deleted successfully 🗑️",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
