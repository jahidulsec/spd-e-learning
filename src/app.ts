import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
// import { errorHandler } from "./middlewares/error-handler";
// import router from "./routes";

// config();
dotenv.config();

export const app = express();

// cors
app.use(cors());

// middlewares
const publicFolderUploads = path.join(__dirname, "../uploads/photos");
app.use("/uploads/photos", express.static(publicFolderUploads));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// api endpoints
app.get("/", (req, res) => {
  res.send("X-obese APP");
});

// app.use("/api", router);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Use error handling middleware
// app.use(errorHandler);
