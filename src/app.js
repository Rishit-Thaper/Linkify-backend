import express  from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());


// Importing all routes
import userRouter from "./routes/userRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profile", profileRouter);

export { app };
