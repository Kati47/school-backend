import { Router } from "express";
import { authenticate } from "../../common/middleware/auth";
import { authorize } from "../../common/middleware/authorize";
import { createCrudRouter } from "../../common/crud/createCrudRouter";
import { Message } from "./message.model";
import { Notification } from "./notification.model";
import { emitToUser } from "../../realtime/socket";
import { asyncHandler } from "../../common/middleware/asyncHandler";
import { Roles } from "../../types/roles";
import { User } from "../users/user.model";

const router = Router();

router.use(authenticate);

router.post(
	"/notifications/broadcast",
	authorize([Roles.ADMIN, Roles.SUPER_ADMIN]),
	asyncHandler(async (req, res) => {
		const { title, body, role, type } = req.body as { title: string; body: string; role?: string; type?: string };
		const targetRole = role || Roles.STUDENT;
		const users = await User.find({ role: targetRole }).select("_id");
		const notifications = users.map((user) => ({
			userId: user._id,
			title,
			body,
			type: type || "ANNOUNCEMENT"
		}));
		const created = await Notification.insertMany(notifications);
		created.forEach((item) => emitToUser(String(item.userId), "notification:new", item));
		res.status(201).json({ sent: created.length });
	})
);

router.use(
	"/",
	createCrudRouter({
		model: Message,
		onCreate: async (doc) => {
			const messageDoc = doc as unknown as { senderId: string; receiverId: string };
			emitToUser(String(messageDoc.receiverId), "message:new", doc);
			emitToUser(String(messageDoc.senderId), "message:sent", doc);
		}
	})
);

router.use(
	"/notifications",
	createCrudRouter({
		model: Notification,
		onCreate: async (doc) => {
			const notificationDoc = doc as unknown as { userId: string };
			emitToUser(String(notificationDoc.userId), "notification:new", doc);
		}
	})
);

export default router;
