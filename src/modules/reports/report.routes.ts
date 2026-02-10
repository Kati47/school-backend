import { Router } from "express";
import { authenticate } from "../../common/middleware/auth";
import { authorize } from "../../common/middleware/authorize";
import { Roles } from "../../types/roles";
import mongoose from "mongoose";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { Attendance } from "../attendance/attendance.model";

const router = Router();

router.use(authenticate);

router.get(
  "/attendance",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER]),
  asyncHandler(async (req, res) => {
    const { classId, startDate, endDate } = req.query;

    const match: Record<string, unknown> = {};
    if (classId) match.classId = new mongoose.Types.ObjectId(String(classId));
    if (startDate || endDate) {
      match.date = {};
      if (startDate) (match.date as Record<string, unknown>).$gte = new Date(String(startDate));
      if (endDate) (match.date as Record<string, unknown>).$lte = new Date(String(endDate));
    }

    const summary = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ summary });
  })
);

export default router;
