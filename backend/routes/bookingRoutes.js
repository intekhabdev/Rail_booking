import express from "express";
import {
  bookTicket,
  cancelTicket,
  checkSeatAvailability,
  getMyBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, bookTicket);
router.put("/:id/cancel", protect, cancelTicket);
router.get("/check-seats/:trainId", checkSeatAvailability);
router.get("/my", protect, getMyBookings);
export default router;
