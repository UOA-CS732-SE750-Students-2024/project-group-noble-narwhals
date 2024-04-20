// Configure environment variables
import dotenv from "dotenv";
dotenv.config();


import express from "express";
import cors from "cors";
import morgan from "morgan";


// Set's our port to the PORT environment variable, or 3000 by default if the env is not configured.
const PORT = process.env.PORT ?? 3000;

// Creates the express server
const app = express();

// Configure middleware (logging, CORS support, JSON parsing support, static files support)
app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
// app.use(express.static("public"));

// Import and use our application routes.
import routes from './routes/routes.js';
app.use("/", routes);


// Start the server running. Once the server is running, the given function will be called, which will
// log a simple message to the server console. Any console.log() statements in your node.js code
// can be seen in the terminal window used to run the server.
app.listen(PORT, () => console.log(`App server listening on port ${PORT}!`));


// connect to MongoDB
import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
