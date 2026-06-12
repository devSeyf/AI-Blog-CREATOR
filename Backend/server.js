import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "localhost:3000",
  credentials: true,
}))

connectDB();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`🖥️ Server running on port ${PORT}`);
});