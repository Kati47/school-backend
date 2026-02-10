import { Router } from "express";
import { authenticate } from "../../common/middleware/auth";
import { authorize } from "../../common/middleware/authorize";
import { Roles } from "../../types/roles";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { Announcement } from "./announcement.model";
import { User } from "../users/user.model";
import { Notification } from "../messaging/notification.model";
import { emitToUser } from "../../realtime/socket";
import { ApiError } from "../../common/utils/ApiError";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const announcements = await Announcement.find().sort({ publishedAt: -1 });
    res.json(announcements);
  })
);

router.post(
  "/",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN]),
  asyncHandler(async (req, res) => {
    const { title, body, audienceRoles } = req.body as { title: string; body: string; audienceRoles?: (typeof Roles)[keyof typeof Roles][] };
    const announcement = await Announcement.create({
      title,
      body,
      audienceRoles: audienceRoles?.length ? audienceRoles : [Roles.STUDENT],
      createdBy: req.user?.id
    });

    const users = await User.find({ role: { $in: announcement.audienceRoles } }).select("_id");
    const notifications = users.map((user) => ({
      userId: user._id,
      title,
      body,
      type: "ANNOUNCEMENT"
    }));
    const created = await Notification.insertMany(notifications);
    created.forEach((item) => emitToUser(String(item.userId), "notification:new", item));

    res.status(201).json(announcement);
  })
);

router.put(
  "/:id",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN]),
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) {
      throw new ApiError(404, "Not found");
    }
    res.json(announcement);
  })
);

router.delete(
  "/:id",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN]),
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      throw new ApiError(404, "Not found");
    }
    res.status(204).send();
  })
);

export default router;
