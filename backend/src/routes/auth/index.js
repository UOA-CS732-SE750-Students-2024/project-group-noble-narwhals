import express from "express";
import passport from "passport";
import isLoggedIn from "../../middleware/authMiddleware.js";
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

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout((err) =>{
    if(err){ return next(err)}
    res.json({ isLoggedIn: false });
  });
});

router.get("/check-session", isLoggedIn, (req, res) => {
  res.json({ isLoggedIn: true });
});

export default router;
