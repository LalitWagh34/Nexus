import { Router } from "express";
import passport from "passport";
import { googleCallback , refresh , logout } from "../controllers/auth.controller";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));


router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/google" }),
  googleCallback
);


router.post("/refresh", refresh);


router.post("/logout", logout);

export default router;