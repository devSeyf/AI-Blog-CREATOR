import jwt from "jsonwebtoken";
import STATUS from "../config/statusCodes.js";

export const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token

    if (!token)
        return res.status(STATUS.UNAUTHORIZED).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded;
        next();

    } catch (error) {
        res.status(STATUS.UNAUTHORIZED).json({ error: "Invalid token" });
    }
}