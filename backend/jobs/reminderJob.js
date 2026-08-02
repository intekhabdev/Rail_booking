import cron from "node-cron";
import Booking from "../models/Booking.js";
import Train from "../models/Train.js";
import User from "../models/User.js";
import { sendReminderEmail } from "../utils/sendReminderEmail.js";

// Runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  try {
    console.log("Running journey reminder job...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const start = new Date(tomorrow.setHours(0, 0, 0, 0));
    const end = new Date(tomorrow.setHours(23, 59, 59, 999));

    const bookings = await Booking.find({
      status: "CONFIRMED",
      journeyDate: { $gte: start, $lte: end },
    });

    for (const booking of bookings) {
      const user = await User.findById(booking.userId);
      const train = await Train.findById(booking.trainId);

      if (user && train) {
        await sendReminderEmail(user, booking, train);
        console.log("Reminder sent to:", user.email);
      }
    }
  } catch (error) {
    console.log("Reminder job error:", error.message);
  }
});
