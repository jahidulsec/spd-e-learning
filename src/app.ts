import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import { errorHandler } from "./middlewares/error-handler";
import router from "./routes";


export const app = express();

// cors
app.use(cors({
  // origin: "http://localhost:3000",
  // credentials: true,
}));

// middlewares
const publicFolderUploads = path.join(__dirname, "../uploads/files");
app.use("/uploads/files", express.static(publicFolderUploads));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(cookieParser());

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

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
