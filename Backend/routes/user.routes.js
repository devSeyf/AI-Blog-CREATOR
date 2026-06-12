import express from "express";
import STATUS from "../config/statusCodes.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = express.Router();


function setAuthCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}





router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(STATUS.BAD_REQUEST).json({
                success: false,
                message: "Please provide all the required fields",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(STATUS.CONFLICT).json({
                success: false,
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
            name,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(STATUS.CREATED).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        });
    }
});




router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Please provide all the required fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(STATUS.BAD_REQUEST).json({ success: false, message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(STATUS.BAD_REQUEST).json({ success: false, message: "Invalid email or password" });
        }



        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        setAuthCookie(res, token);


        res.status(STATUS.OK).json({ success: true, message: "User logged in successfully", user: { id: user._id, email: user.email, name: user.name }, token });



    }
    catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }


})


//get current user details
router.get("/:id", async (req, res) => {

    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({ success: false, message: "User not found" });
        }

        res.status(STATUS.OK).json({ success: true, user });
    }
    catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
}

)




router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(STATUS.OK).json({ success: true, message: "User logged out successfully" });
});


router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({ success: false, message: "User not found" });
        }

        res.status(STATUS.OK).json({ success: true, user });


    }
    catch (error) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal server error" });
    }
}
);
export default router;
