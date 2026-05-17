import { Router } from "express";
import passport from "passport";
import { googleCallback , refresh , logout } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { refreshTokenSchema } from "../types/schemas";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));


router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/google" }),
  googleCallback
);


router.post("/refresh",validate(refreshTokenSchema), refresh);


router.post("/logout",validate(refreshTokenSchema), logout);

export default router;