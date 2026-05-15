import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  createConversation,
  getConversations,
  getConversation,
} from "../controllers/conversation.controller";

const router = Router();

router.use(authenticate); // protect all conversation routes

router.post("/", createConversation);
router.get("/", getConversations);
router.get("/:id", getConversation);

export default router;