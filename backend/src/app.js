// Configure environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import session from "express-session";
import passportSetup from "./config/passport.js";

// Set's our port to the PORT environment variable, or 3000 by default if the env is not configured.
const PORT = process.env.PORT ?? 3000;

// Creates the express server
const app = express();

// Configure middleware
app.use(morgan("combined"));
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173', // frontend 
  credentials: true, // Allow（cookies）
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // 是否允许通过客户端脚本访问cookie，一般设置为true
      secure: false, // 是否只通过https协议传输cookie
      maxAge: 1000 * 60 * 60 * 24 * 7, // 设置 session cookie 的过期时间，例如1小时
    },
  })
);

// Configure Passport for Google
app.use(passport.initialize());
app.use(passport.session());
passportSetup(passport);

// Import and use our application routes.
import routes from "./routes/routes.js";
app.use("/", routes);

// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(PORT, () => console.log(`App server listening on port ${PORT}!`));

// connect to MongoDB
import mongoose from "mongoose";

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
