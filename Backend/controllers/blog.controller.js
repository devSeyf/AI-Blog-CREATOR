import express from "express";
import axios from "axios";
import {
  getAiModel,
  handleOpenRouterError,
} from "../utils/openRouter.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "OPENROUTER_API_KEY is not configured",
      });
    }

    const finalPrompt = `Write a detailed blog post about: ${prompt}.
Include an engaging introduction, main content with subheadings, and a conclusion.
Make it informative and well-structured.`;

    const resAi = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: getAiModel(),
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedContent =
      resAi.data?.choices?.[0]?.message?.content;

    if (!generatedContent) {
      return res.status(502).json({
        success: false,
        message: "No content was generated",
      });
    }

    return res.status(200).json({
      success: true,
      content: generatedContent,
    });
  } catch (error) {
    return handleOpenRouterError(error, res, "Blog AI generation");
  }
});

export default router;
