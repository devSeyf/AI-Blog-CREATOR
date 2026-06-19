
import express from "express";
import STATUS from "../config/statusCodes.js";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/add-comment", authMiddleware, async (req, res) => {
    try {
        const { name, comment } = req.body;
        const blogId = req.query.blogId;
        const newComment = await Comment.create({ name, comment, blog: blogId });
        res.status(STATUS.CREATED).json({ message: "Comment added successfully", comment: newComment });



    }
    catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error adding comment" });
    }

}
);




router.get("/blog-comment/:blogId", authMiddleware, async (req, res) => {
    try {
        const { blogId } = req.params;
        const comments = await Comment.find({ blog: blogId }).populate("blog", "title").sort({ createdAt: -1 });
        res.status(STATUS.OK).json({ comments });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching comments" });
    }
});


 
export default router;