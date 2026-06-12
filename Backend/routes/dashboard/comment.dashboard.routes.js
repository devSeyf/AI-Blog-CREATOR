import express from "express";
import STATUS from "../../config/statusCodes.js";
import Blog from "../../models/blog.model.js";
import Comment from "../../models/comment.model.js";
import authMiddleware from "../../middleware/auth.middleware.js"

const router = express.Router();







router.get("/all-comments-count", authMiddleware, async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id })
        const blogIds = blogs.map(blog => blog._id);
        const comments = await Comment.countDocuments({ blog: { $in: blogIds } });
        res.status(STATUS.OK).json({ count: comments });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching comments count" });
    }
});




router.get("/blogs-count", authMiddleware, async (req, res) => {
    try {
        const count = await Blog.countDocuments({ author: req.user._id });
        res.status(STATUS.OK).json({ count });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching blogs count" });
    }
});







router.get("/user-comments", authMiddleware, async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id });
        const blogIds = blogs.map(blog => blog._id);
        const comments = await Comment.find({ blog: { $in: blogIds } })
            .populate("blog", "title")
            .populate("author", "name email")
            .sort({ createdAt: -1 });
        res.status(STATUS.OK).json({ comments, message: "User comments fetched successfully", count: comments.length });



    }
    catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching user comments" });
    }
})

export default router;