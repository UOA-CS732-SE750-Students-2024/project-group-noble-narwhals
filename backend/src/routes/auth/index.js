import express from "express";
import passport from "passport";
import isLoggedIn from "../../middleware/authMiddleware";
const router = express.Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("logged in");
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
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

rpute.get('/check-session', isLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isLoggedIn: true, user: req.user });
} else {
    res.json({ isLoggedIn: false });
}
});

export default router;
