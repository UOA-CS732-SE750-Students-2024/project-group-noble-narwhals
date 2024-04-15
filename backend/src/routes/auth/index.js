import express from "express";
import passport from "passport";
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  console.log(req.body);
  // const user = users.find(u => u.username === username);

  // if (!user) {
  //     return res.status(401).send('用户名不存在');
  // }

  // if (!bcrypt.compareSync(password, user.password)) {
  //     return res.status(401).send('密码错误');
  // }

  // const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });

  res.json({ message: "登录成功" });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {scope: ["profile", "email"], failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

export default router;
