import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_AI_MODEL,
  getAiModel,
  handleOpenRouterError,
} from "../utils/openRouter.js";

test("getAiModel uses the configured model and falls back to Gemma 3 27B", () => {
  const originalModel = process.env.AI_MODEL;

  try {
    process.env.AI_MODEL = "openrouter/auto";
    assert.equal(getAiModel(), "openrouter/auto");

    delete process.env.AI_MODEL;
    assert.equal(getAiModel(), DEFAULT_AI_MODEL);
    assert.equal(DEFAULT_AI_MODEL, "google/gemma-3-27b-it");
  } finally {
    if (originalModel === undefined) {
      delete process.env.AI_MODEL;
    } else {
      process.env.AI_MODEL = originalModel;
    }
  }
});

test("handleOpenRouterError returns provider status and a readable message", () => {
  const response = {
    statusCode: null,
    payload: null,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
  const providerError = new Error("Request failed");
  providerError.response = {
    status: 404,
    data: { error: { message: "The requested model is unavailable" } },
  };
  const originalConsoleError = console.error;
  console.error = () => {};

  try {
    handleOpenRouterError(providerError, response, "Blog AI generation");
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(response.statusCode, 404);
  assert.deepEqual(response.payload, {
    success: false,
    message: "The requested model is unavailable",
  });
});

