import assert from "node:assert/strict";
import test from "node:test";

import {
  ApiError,
  isUnauthorized,
  normalizeApiError,
} from "../src/utils/apiErrors.ts";

test("normalizeApiError preserves a readable provider message and status", () => {
  const result = normalizeApiError(
    {
      response: {
        status: 429,
        data: { message: "Please wait before trying again." },
      },
    },
    "Request failed",
  );

  assert.ok(result instanceof ApiError);
  assert.equal(result.message, "Please wait before trying again.");
  assert.equal(result.status, 429);
});

test("normalizeApiError returns a clean fallback for unknown failures", () => {
  const result = normalizeApiError({ unexpected: true }, "Unable to load blogs");

  assert.equal(result.message, "Unable to load blogs");
  assert.equal(result.status, undefined);
});

test("isUnauthorized detects normalized 401 errors", () => {
  assert.equal(isUnauthorized(new ApiError("Please sign in", 401)), true);
  assert.equal(isUnauthorized(new ApiError("Server unavailable", 503)), false);
});

