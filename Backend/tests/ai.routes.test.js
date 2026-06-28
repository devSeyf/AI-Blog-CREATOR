import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after, before, beforeEach } from "node:test";

import axios from "axios";
import cookieParser from "cookie-parser";
import express from "express";
import jwt from "jsonwebtoken";

import blogAiRouter from "../controllers/blog.controller.js";
import commentAiRouter from "../controllers/comment.controller.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/ai", blogAiRouter);
app.use("/commentAi", commentAiRouter);

const originalAdapter = axios.defaults.adapter;
const originalApiKey = process.env.OPENROUTER_API_KEY;
const originalModel = process.env.AI_MODEL;
const originalJwtSecret = process.env.JWT_SECRET;
let baseUrl;
let server;
let providerRequests;

const providerSuccess = (content) => async (config) => {
  providerRequests.push(JSON.parse(config.data));
  return {
    data: { choices: [{ message: { content } }] },
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
};

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(() => {
  process.env.OPENROUTER_API_KEY = "test-key";
  delete process.env.AI_MODEL;
  providerRequests = [];
});

after(async () => {
  axios.defaults.adapter = originalAdapter;

  if (originalApiKey === undefined) {
    delete process.env.OPENROUTER_API_KEY;
  } else {
    process.env.OPENROUTER_API_KEY = originalApiKey;
  }

  if (originalModel === undefined) {
    delete process.env.AI_MODEL;
  } else {
    process.env.AI_MODEL = originalModel;
  }

  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalJwtSecret;
  }

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("blog AI generation returns content using the configured fallback model", async () => {
  axios.defaults.adapter = providerSuccess("Generated blog content");

  const response = await fetch(`${baseUrl}/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Testing MERN applications" }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.content, "Generated blog content");
  assert.equal(providerRequests[0].model, "google/gemma-3-27b-it");
});

test("blog AI generation preserves an unavailable-model provider response", async () => {
  axios.defaults.adapter = async (config) => {
    const error = new Error("Request failed with status code 404");
    error.response = {
      status: 404,
      data: { error: { message: "The requested model is unavailable" } },
      config,
    };
    throw error;
  };

  const response = await fetch(`${baseUrl}/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "Unavailable model test" }),
  });
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.deepEqual(body, {
    success: false,
    message: "The requested model is unavailable",
  });
});

test("comment AI generation returns suggestions using the same model", async () => {
  process.env.JWT_SECRET = "test-jwt-secret";
  const token = jwt.sign({ id: "507f1f77bcf86cd799439011" }, process.env.JWT_SECRET);
  axios.defaults.adapter = providerSuccess(
    "Clear and useful explanation!\nI learned something new today.",
  );

  const response = await fetch(`${baseUrl}/commentAi/generate-comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${token}`,
    },
    body: JSON.stringify({ topic: "MERN testing" }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body.suggestions, [
    "Clear and useful explanation!",
    "I learned something new today.",
  ]);
  assert.equal(providerRequests[0].model, "google/gemma-3-27b-it");
});

test("server mounts the comment AI router at /commentAi", async () => {
  const serverSource = await readFile(new URL("../server.js", import.meta.url), "utf8");

  assert.match(serverSource, /app\.use\(["']\/commentAi["'],\s*commentAiRouter\)/);
});
