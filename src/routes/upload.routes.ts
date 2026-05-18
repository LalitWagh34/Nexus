import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { upload } from "../middlewares/upload";
import { uploadFile } from "../controllers/upload.controller";

const router = Router();

router.use(authenticate);

router.post("/", upload.single("file"), uploadFile);

export default router;