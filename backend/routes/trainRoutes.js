import express from "express";
import {
  addTrain,
  getAllTrains,
  updateTrain,
  deleteTrain,
} from "../controllers/trainController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllTrains);

router.post("/", protect, adminOnly, addTrain);
router.put("/:id", protect, adminOnly, updateTrain);
router.delete("/:id", protect, adminOnly, deleteTrain);

export default router;
