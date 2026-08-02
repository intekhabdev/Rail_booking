import mongoose from "mongoose";

const trainSchema = new mongoose.Schema(
  {
    trainNumber: { type: String, required: true, unique: true },
    trainName: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    fare: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Train", trainSchema);
