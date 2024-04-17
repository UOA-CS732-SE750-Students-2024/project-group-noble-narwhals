import express from "express";
import passport from "passport";
import isLoggedIn from "../../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ isLoggedIn: true, user: req.user });
});

// router.post("/signup", )

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.json({ isLoggedIn: true, user: req.user });
  }
);

router.get("/check-session", isLoggedIn, (req, res) => {
  res.json({ isLoggedIn: true, user: req.user });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ isLoggedIn: false });
  });
});

export default router;
