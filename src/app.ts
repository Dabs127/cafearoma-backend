import router from "#routes/index.js";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use("/api", router); // Use the router for all API routes

export default app;
