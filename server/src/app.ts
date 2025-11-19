import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import messageRoutes from "./routes/message";
import { connectDb } from "./db/dbConnect";
import errorHandler from "./middlewares/errorHandler";
import { ENV } from "./utils/env";

const app = express();

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);
app.use(json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// errorHandler
app.use(errorHandler);

const PORT = ENV.PORT || 8000;

app.listen(PORT, () => {
  connectDb();
  console.log("Server is running at port =>", PORT);
});
