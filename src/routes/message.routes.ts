import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { send ,list , edit ,remove } from "../controllers/message.controllers";

const router = Router({mergeParams:true})

router.use(authenticate);

router.post("/", send);
router.get("/", list);
router.patch("/:messageId", edit);
router.delete("/:messageId", remove);

export default router;