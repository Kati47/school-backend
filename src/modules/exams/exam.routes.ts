import { Router } from "express";
import { authenticate } from "../../common/middleware/auth";
import { authorize } from "../../common/middleware/authorize";
import { Roles } from "../../types/roles";
import { createCrudRouter } from "../../common/crud/createCrudRouter";
import { Exam } from "./exam.model";
import { Grade } from "./grade.model";

const router = Router();

router.use(authenticate);

router.use(
  "/grades",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER]),
  createCrudRouter({ model: Grade })
);

router.use(
  "/",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER]),
  createCrudRouter({ model: Exam })
);

export default router;
