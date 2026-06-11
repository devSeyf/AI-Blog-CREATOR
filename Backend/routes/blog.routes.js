import express from "express";
import STATUS from "../config/statusCodes.js";
import Blog from "../models/blog.model.js";

const router = express.Router();

router.post("/add-blog", async (req, res) => {
    try {
        const { title, subtitle, description, category, published } = req.body;
        if (!title || !description || !category || !author) {
            return res.status(STATUS.BAD_REQUEST).json({
                success: false,
                message: "Please provide all the required fields",
            });
        }

        const newBlog = new Blog({
            title,
            subtitle,
            description,
            category,
            published: published === "true",
            author: req.user._id,
        });

        await newBlog.save();

        return res.status(STATUS.CREATED).json({
            success: true,
            message: "Blog post created successfully",
            data: newBlog,
        });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error creating blog post",
        });
    }
});

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

router.delete("/delete-blog/:id", async (req, res) => {
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
