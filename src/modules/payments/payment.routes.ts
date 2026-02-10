import { Router } from "express";
import { authenticate } from "../../common/middleware/auth";
import { authorize } from "../../common/middleware/authorize";
import { Roles } from "../../types/roles";
import { createCrudRouter } from "../../common/crud/createCrudRouter";
import { Fee } from "./fee.model";
import { Payment } from "./payment.model";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { initializePaypalOrder, initializeStripeCharge, recordPayment } from "./payment.service";

const router = Router();

router.use(authenticate);

router.use(
  "/fees",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT]),
  createCrudRouter({ model: Fee })
);

router.use(
  "/",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT]),
  createCrudRouter({ model: Payment })
);

router.post(
  "/charge",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT]),
  asyncHandler(async (req, res) => {
    const payment = await recordPayment(req.body);
    res.status(201).json(payment);
  })
);

router.post(
  "/stripe/intent",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT]),
  asyncHandler(async (req, res) => {
    const result = await initializeStripeCharge(req.body);
    res.json(result);
  })
);

router.post(
  "/paypal/order",
  authorize([Roles.ADMIN, Roles.SUPER_ADMIN, Roles.ACCOUNTANT]),
  asyncHandler(async (req, res) => {
    const result = await initializePaypalOrder(req.body);
    res.json(result);
  })
);

export default router;
