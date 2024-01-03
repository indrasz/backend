import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/admin/UserRouteAdmin.js";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:3000"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5001, () => {
  console.log("Server berhasil berjalan");
});