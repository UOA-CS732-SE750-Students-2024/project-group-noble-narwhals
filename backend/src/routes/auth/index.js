import express from "express";

const router = express.Router();

const users = [
    { id: 1, username: 'user1', password: bcrypt.hashSync('pass123', 10) },
    { id: 2, username: 'user2', password: bcrypt.hashSync('password', 10) }
];

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    console.log(req.body)
    // const user = users.find(u => u.username === username);

    // if (!user) {
    //     return res.status(401).send('用户名不存在');
    // }

    // if (!bcrypt.compareSync(password, user.password)) {
    //     return res.status(401).send('密码错误');
    // }

    // const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ message: '登录成功'});

});

export default router;
