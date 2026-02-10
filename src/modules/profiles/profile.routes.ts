import { Router } from "express";
import { authenticate } from "../../common/middleware/auth";
import { authorize } from "../../common/middleware/authorize";
import { Roles } from "../../types/roles";
import { createCrudRouter } from "../../common/crud/createCrudRouter";
import { StudentProfile } from "./studentProfile.model";
import { TeacherProfile } from "./teacherProfile.model";
import { ParentProfile } from "./parentProfile.model";

const router = Router();

router.use(authenticate);

router.use(
  "/students",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER]),
  createCrudRouter({ model: StudentProfile })
);

router.use(
  "/teachers",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN]),
  createCrudRouter({ model: TeacherProfile })
);

router.use(
  "/parents",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN]),
  createCrudRouter({ model: ParentProfile })
);

export default router;
