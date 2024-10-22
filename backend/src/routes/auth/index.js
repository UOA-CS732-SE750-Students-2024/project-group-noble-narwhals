import express from "express";
import passport from "passport";
import isLoggedIn from "../../middleware/authMiddleware.js";
import bcrypt from "bcrypt";
import User from "../../models/userModel.js";
import Notification from "../../models/notificationModel.js";
import { avatarStyles } from "../api/user.js";
const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to log in due to server error.",
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || "Login failed. Check email and password.",
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to log in due to server error.",
        });
      }
      res.json({ isLoggedIn: true, user: user });
    });
  })(req, res, next);
});

router.post("/signup", async (req, res) => {
  const email = req.body.email;

  try {
    let checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: email.split("@")[0],
      email,
      gender: "Not specified",
      password: hashedPassword,
      accountType: "email",
      isVerification: false,
    });

    const selectedStyle =
      avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    const avatarUrl = `https://api.dicebear.com/8.x/${selectedStyle}/svg?seed=${user._id}`;
    user.avatar = avatarUrl;

    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to create user due to server error.",
    });
  }
});

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
    if (req.user) {
      if (req.user.accountType === "google") {
        res.redirect(`${process.env.CLIENT_URL}/`);
      } else {
        res.redirect(`${process.env.CLIENT_URL}/user/settings/${req.user._id}`);
      }
    } else {
      res.status(500).redirect(`${process.env.CLIENT_URL}/signup`).json({
        success: false,
        message: "Failed to create user due to server error.",
      });
    }
  }
);

router.get("/check-session", isLoggedIn, async (req, res) => {
  //get unread messages number
  const messages = await Notification.find({
    receiverId: req.user._id,
    isRead: false,
  });
  const newUser = { ...req.user._doc, unreadMessages: messages.length };

  res.json({ isLoggedIn: true, user: newUser });
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
