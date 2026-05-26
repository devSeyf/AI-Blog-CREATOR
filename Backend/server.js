import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🖥️ Server running on port ${PORT}`);
});