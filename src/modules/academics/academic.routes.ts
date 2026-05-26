import { Router } from "express";
import { authenticate } from "../../common/middleware/auth";
import { authorize } from "../../common/middleware/authorize";
import { Roles } from "../../types/roles";
import { createCrudRouter } from "../../common/crud/createCrudRouter";
import { AcademicYear } from "./academicYear.model";
import { ClassModel } from "./class.model";
import { Subject } from "./subject.model";
import { Schedule } from "./schedule.model";
import { User } from "../users/user.model";
import { Notification } from "../messaging/notification.model";
import { emitToUser } from "../../realtime/socket";

const router = Router();

router.use(authenticate);

router.use(
  "/years",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN]),
  createCrudRouter({ model: AcademicYear })
);

router.use(
  "/classes",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER]),
  createCrudRouter({ model: ClassModel })
);

router.use(
  "/subjects",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN]),
  createCrudRouter({ model: Subject })
);

router.use(
  "/schedules",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER]),
  createCrudRouter({
    model: Schedule,
    onCreate: async (doc) => {
      const admins = await User.find({ role: { $in: [Roles.ADMIN, Roles.SUPER_ADMIN] } }).select("_id");
      const notifications = admins.map((admin) => ({
        userId: admin._id,
        title: "Timetable created",
        body: `A timetable entry was created for class ${String(doc.classId)}.`,
        type: "TIMETABLE"
      }));
      if (notifications.length) {
        const created = await Notification.insertMany(notifications);
        created.forEach((item) => emitToUser(String(item.userId), "notification:new", item));
      }
    },
    onUpdate: async (doc) => {
      const admins = await User.find({ role: { $in: [Roles.ADMIN, Roles.SUPER_ADMIN] } }).select("_id");
      const notifications = admins.map((admin) => ({
        userId: admin._id,
        title: "Timetable updated",
        body: `A timetable entry was updated for class ${String(doc.classId)}.`,
        type: "TIMETABLE"
      }));
      if (notifications.length) {
        const created = await Notification.insertMany(notifications);
        created.forEach((item) => emitToUser(String(item.userId), "notification:new", item));
      }
    },
    onDelete: async (doc) => {
      const admins = await User.find({ role: { $in: [Roles.ADMIN, Roles.SUPER_ADMIN] } }).select("_id");
      const notifications = admins.map((admin) => ({
        userId: admin._id,
        title: "Timetable canceled",
        body: `A timetable entry was canceled for class ${String(doc.classId)}.`,
        type: "TIMETABLE"
      }));
      if (notifications.length) {
        const created = await Notification.insertMany(notifications);
        created.forEach((item) => emitToUser(String(item.userId), "notification:new", item));
      }
    }
  })
);

export default router;
