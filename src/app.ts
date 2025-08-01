import router from "./routes/index.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use("/api", router); // Use the router for all API routes

app.get("debug-cookies", (req, res) => {
  console.log("Cookies en /api/debug-cookies:", req.cookies);

  res.json({ cookies: req.cookies as string });
});

export default app;
