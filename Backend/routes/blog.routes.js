import express from "express";
import STATUS from "../config/statusCodes.js";
import Blog from "../models/blog.model.js";
const router = express.Router();



router.get("/all-blogs", async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        return res.status(STATUS.OK).json({
            success: true,
            message: "Blog posts fetched successfully",
            blogs,
        });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching blog posts",
        });
    }
});



router.get("/:id", async (req, res) => {
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

        const now = new Date();
        const lastUpdated = new Date(blog.updatedAt)
        const secondDiff = (now - lastUpdated) / 1000;

        if (secondDiff > 2) {
            blog.views += 1;
            await blog.save();

        }
        await blog.save();

        return res.status(STATUS.OK).json({
            success: true,
            message: "Blog post fetched successfully",
            blog,
        });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching blog post",
        });
    }
});

export default router;
