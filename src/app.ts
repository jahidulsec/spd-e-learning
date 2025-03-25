import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error-handler";
import router from "./routes";

// config();
dotenv.config();

export const app = express();

// cors
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// middlewares
const publicFolderUploads = path.join(__dirname, "../uploads/files");
app.use("/uploads/files", express.static(publicFolderUploads));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// api endpoints
app.get("/", (req, res) => {
  res.send("SPD e-Learning APP");
});

app.use("/api", router);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Use error handling middleware
app.use(errorHandler);
