
import express from "express";
import Blog from "../../models/blog.model.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import STATUS from "../../config/statusCodes.js";
import multer from "multer";
import path from "node:path";

const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        const filename = Date.now() + "-" + file.fieldname + ext

        cb(null, filename);
    },
});

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });


router.get("/blogs-count", authMiddleware, async (req, res) => {
    try {
        const count = await Blog.countDocuments({ author: req.user.id });
        return res.status(STATUS.OK).json({ count });
    } catch (error) {
        return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error fetching blogs count" });
    }
});


router.post("/add-blog", authMiddleware, upload.single("thumbnail"), async (req, res) => {
    try {
        const { title, subtitle, description, category, published } = req.body;
        if (!title || !description || !category) {
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
            author: req.user.id,
            thumbnail: req.file?.filename
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



router.get("/all-blogs", authMiddleware, async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id })
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
export default router;
