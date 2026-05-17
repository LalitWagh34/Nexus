import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  createConversation,
  getConversations,
  getConversation,
} from "../controllers/conversation.controller";
import { validate } from "../middlewares/validate";
import { refreshTokenSchema } from "../types/schemas";
import { markAsRead , unreadCount } from "../controllers/readReceipt.controller";

const router = Router();

router.use(authenticate); // protect all conversation routes

router.post("/", validate(refreshTokenSchema) ,createConversation);
router.get("/", getConversations);
router.get("/:id", getConversation);
router.post("/:id/read", markAsRead);
router.get("/:id/unread-count", unreadCount);

export default router;