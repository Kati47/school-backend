import { Router } from "express";
import { validate } from "../../common/middleware/validate";
import { loginSchema, refreshSchema, registerSchema } from "./auth.validation";
import { login, refresh, register } from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);

export default router;












