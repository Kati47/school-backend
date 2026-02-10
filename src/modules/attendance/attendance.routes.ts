import { Router } from "express";
import { authenticate } from "../../common/middleware/auth";
import { authorize } from "../../common/middleware/authorize";
import { Roles } from "../../types/roles";
import { createCrudRouter } from "../../common/crud/createCrudRouter";
import { Attendance } from "./attendance.model";

const router = Router();

router.use(authenticate);
router.use(authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER]));
router.use("/", createCrudRouter({ model: Attendance }));

export default router;
