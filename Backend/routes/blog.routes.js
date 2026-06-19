import express from "express";
import STATUS from "../config/statusCodes.js";
import Blog from "../models/blog.model.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();



router.get("/all-blogs", async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return res.status(STATUS.OK).json({
            success: true,
            message: "Blog posts fetched successfully",
            data: blogs,
        });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching blog posts",
        });
    }
});

router.delete("/delete-blog/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(STATUS.NOT_FOUND).json({
                success: false,
                message: "Blog post not found",
            });
        }

        await Blog.findByIdAndDelete(id);
        return res.status(STATUS.OK).json({
            success: true,
            message: "Blog post deleted successfully",
        });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error deleting blog post",
        });
    }
});

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate(
            "author",
            "name email",
        );

        if (!blog) {
            return res.status(STATUS.NOT_FOUND).json({
                success: false,
                message: "Blog post not found",
            });
        }

        blog.views += 1;
        await blog.save();

        return res.status(STATUS.OK).json({
            success: true,
            message: "Blog post fetched successfully",
            data: blog,
        });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching blog post",
        });
    }
});

export default router;
