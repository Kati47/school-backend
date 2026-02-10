import { Router } from "express";
import { authenticate } from "../../common/middleware/auth";
import { authorize } from "../../common/middleware/authorize";
import { Roles } from "../../types/roles";
import { createCrudRouter } from "../../common/crud/createCrudRouter";
import { Assignment } from "./assignment.model";
import { AssignmentSubmission } from "./assignmentSubmission.model";

const router = Router();

router.use(authenticate);

router.use(
  "/submissions",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER, Roles.STUDENT]),
  createCrudRouter({ model: AssignmentSubmission })
);

router.use(
  "/",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.TEACHER]),
  createCrudRouter({ model: Assignment })
);

export default router;
