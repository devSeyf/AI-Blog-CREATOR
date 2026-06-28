import axios from "axios";
import express from "express";
import {
    getAiModel,
    handleOpenRouterError,
} from "../utils/openRouter.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/generate-comment", authMiddleware, async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Topic is required",
            });
        }

        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "OPENROUTER_API_KEY is not configured",
            });
        }

        const prompt = `Generate exactly 2 short, friendly comment suggestions for a blog about "${topic}".

Requirements:
- Each comment must be under 15 words
- Output ONLY the 2 comments, one per line
- No numbering, no explanations, no additional text
- Do not ask follow-up questions

Example format:
Great insights on this topic!
Looking forward to reading more about this.`;

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: getAiModel(),
            messages: [{ role: "user", content: prompt }],
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        const text = response.data?.choices?.[0]?.message?.content;

        if (!text) {
            return res.status(502).json({
                success: false,
                message: "No comment suggestions were generated",
            });
        }

        const suggestions = text
            .split("\n")
            .map((line) =>
                line
                    .replace(/^\d+\.\s*/, "")
                    .replace(/\*\*/g, "")
                    .replace(/^>\s?/, "")
                    .replace(/Suggestion\s*\d+:?/gi, "")
                    .trim()
            )
            .filter(
                (line) =>
                    line &&
                    !line.toLowerCase().includes("okay") &&
                    !line.toLowerCase().includes("comment") &&
                    !line.toLowerCase().includes("suggestions") &&
                    !line.toLowerCase().includes("for a blog about")
            );

        res.json({ success: true, suggestions });
    } catch (error) {
        return handleOpenRouterError(error, res, "Comment AI generation");
    }
});



export default router;
