import { api } from "./apiClient";
import { normalizeApiError } from "./apiErrors";

export const getCommentsByBlog = async (blogId: string): Promise<any> => {
  try {
    const res = await api.get(`/comments/blog-comment/${blogId}`);
    return res.data.comments;
  } catch (error: unknown) {
    throw normalizeApiError(error, "Failed to fetch comments");
  }
};

export const getMyBlogComments = async (): Promise<any> => {
  try {
    const res = await api.get("/dashboard/comment/user-comments");
    return res.data.comments;
  } catch (error: unknown) {
    throw normalizeApiError(error, "Failed to fetch comments");
  }
};

export const addComment = async (
  blogId: string,
  username: string,
  comment: string
): Promise<any> => {
  try {
    const res = await api.post("/comments/add-comment", {
      username,
      comment,
      blogId,
    });

    return res.data.comment;
  } catch (error: unknown) {
    throw normalizeApiError(error, "Failed to add comment");
  }
};

export const generateAiCommentSuggestions = async (
  topic: string
): Promise<string[]> => {
  try {
    const res = await api.post("/commentAi/generate-comment", { topic });
    return res.data.suggestions || [];
  } catch (error: unknown) {
    throw normalizeApiError(error, "Failed to generate AI comments");
  }
};

export const getMyCommentsCount = async (): Promise<number> => {
  try {
    const res = await api.get("/dashboard/comment/user-comments");
    return res.data.count || 0;
  } catch (error: unknown) {
    throw normalizeApiError(error, "Failed to fetch comments count");
  }
};
