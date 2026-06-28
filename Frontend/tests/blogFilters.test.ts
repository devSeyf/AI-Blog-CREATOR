import assert from "node:assert/strict";
import test from "node:test";

import { onlyPublishedBlogs } from "../src/utils/blogFilters.ts";

test("onlyPublishedBlogs keeps published and legacy blogs out of public drafts", () => {
  const blogs = [
    { _id: "published", published: true },
    { _id: "draft", published: false },
    { _id: "legacy" },
  ];

  assert.deepEqual(
    onlyPublishedBlogs(blogs).map((blog) => blog._id),
    ["published", "legacy"],
  );
});

