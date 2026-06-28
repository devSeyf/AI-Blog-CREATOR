export const DEFAULT_AI_MODEL = "google/gemma-3-27b-it";

export const getAiModel = () =>
  process.env.AI_MODEL?.trim() || DEFAULT_AI_MODEL;

export const handleOpenRouterError = (error, res, context) => {
  const providerStatus = error.response?.status;
  const status = Number.isInteger(providerStatus) ? providerStatus : 502;
  const providerMessage =
    error.response?.data?.error?.message ||
    error.response?.data?.message ||
    "AI generation failed. Please try again later.";

  console.error(`${context} failed`, {
    status,
    message: providerMessage,
  });

  return res.status(status).json({
    success: false,
    message: providerMessage,
  });
};

