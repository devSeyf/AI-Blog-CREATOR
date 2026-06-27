import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import Generate from "../Backend/controllers/blog.controller.js"
import BlogDashboard from "./routes/dashboard/blog.dashboard.routes.js"
import CommentDashboard from "./routes/dashboard/comment.dashboard.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))


app.use(cookieParser())
app.use(express.json());

connectDB();


app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/comments", commentRoutes);
app.use("/dashboard/blog", BlogDashboard);
app.use("/dashboard/comment", CommentDashboard);
app.use("/ai", Generate);
app.use("/images", express.static("images"));

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
