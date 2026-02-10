import { Router } from "express";
import { User } from "./user.model";
import { authenticate } from "../../common/middleware/auth";
import { authorize } from "../../common/middleware/authorize";
import { Roles } from "../../types/roles";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { ApiError } from "../../common/utils/ApiError";
import { validate } from "../../common/middleware/validate";
import { userCreateSchema, userUpdateSchema } from "./user.validation";
import { hashPassword } from "../../common/utils/password";

const router = Router();

router.use(authenticate, authorize([Roles.ADMIN, Roles.SUPER_ADMIN]));

router.post(
  "/",
  validate(userCreateSchema),
  asyncHandler(async (req, res) => {
    const payload = req.body;
    payload.password = await hashPassword(payload.password);
    const user = await User.create(payload);
    res.status(201).json(user);
  })
);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const users = await User.find();
    res.json(users);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "Not found");
    res.json(user);
  })
);

router.put(
  "/:id",
  validate(userUpdateSchema),
  asyncHandler(async (req, res) => {
    const payload = req.body;
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }
    const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!user) throw new ApiError(404, "Not found");
    res.json(user);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, "Not found");
    res.status(204).send();
  })
);

export default router;
