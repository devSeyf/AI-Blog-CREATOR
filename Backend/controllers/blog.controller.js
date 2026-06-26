import express from "express";
import axios from "axios";

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
        model: "google/gemma-3-27b-it:free",
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
    if (error.response) {
      console.error("🔴 AI Generation Error Response:");
      console.error("Status:", error.response.status);
      console.error("Headers:", error.response.headers);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      console.error("🟡 No response received from OpenRouter:");
      console.error(error.request);
    } else {
      console.error("⚠️ Error in request setup:", error.message);
    }

    return res.status(error.response?.status || 500).json({
      success: false,
      message:
        error.response?.data?.error?.message ||
        "Failed to generate AI content",
      error: error.message,
    });
  }
});

export default router;