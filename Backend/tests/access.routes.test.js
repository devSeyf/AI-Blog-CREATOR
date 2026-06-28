import assert from "node:assert/strict";
import test, { after, before } from "node:test";

import axios from "axios";
import express from "express";

import commentAiRouter from "../controllers/comment.controller.js";
import Blog from "../models/blog.model.js";
import blogRouter from "../routes/blog.routes.js";

const app = express();
app.use(express.json());
app.use("/blogs", blogRouter);
app.use("/commentAi", commentAiRouter);

const originalFindById = Blog.findById;
const originalAdapter = axios.defaults.adapter;
const originalApiKey = process.env.OPENROUTER_API_KEY;
let baseUrl;
let server;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  Blog.findById = originalFindById;
  axios.defaults.adapter = originalAdapter;

  if (originalApiKey === undefined) {
    delete process.env.OPENROUTER_API_KEY;
  } else {
    process.env.OPENROUTER_API_KEY = originalApiKey;
  }

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("blog details are publicly readable without an auth cookie", async () => {
  const blog = {
    _id: "507f1f77bcf86cd799439011",
    title: "Public article",
    views: 0,
    updatedAt: new Date(),
    save: async () => blog,
  };
  Blog.findById = () => ({
    populate: async () => blog,
  });

  const response = await fetch(`${baseUrl}/blogs/${blog._id}`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.blog.title, "Public article");
});

test("comment AI rejects anonymous requests before calling OpenRouter", async () => {
  process.env.OPENROUTER_API_KEY = "test-key";
  let providerCalls = 0;
  axios.defaults.adapter = async (config) => {
    providerCalls += 1;
    return {
      data: { choices: [{ message: { content: "Suggestion one" } }] },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };

  const response = await fetch(`${baseUrl}/commentAi/generate-comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: "Protected comments" }),
  });
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.error, "No token provided");
  assert.equal(providerCalls, 0);
});

