import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getCommentsByBlog = async (blogId: string): Promise<any> => {
  try {
    const res = await api.get(`/comments/blog-comment/${blogId}`);
    return res.data.comments;
  } catch (error: any) {
    console.error(
      "Error fetching comments:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch comment");
  }
};

export const getMyBlogComments = async (): Promise<any> => {
  try {
    const res = await api.get("/dashboard/comment/user-comments");
    return res.data.comments;
  } catch (error: any) {
    console.error(
      "Error fetching comments:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch comment");
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
  } catch (error: any) {
    console.error(
      "Error adding comment:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to add comment");
  }
};

export const generateAiCommentSuggestions = async (
  topic: string
): Promise<string[]> => {
  try {
    const res = await api.post("/commentAi/generate-comment", { topic });
    return res.data.suggestions || [];
  } catch (error: any) {
    console.error(
      "Error fetching AI comments:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch AI comment"
    );
  }
};

export const getMyCommentsCount = async (): Promise<number> => {
  try {
    const res = await api.get("/dashboard/comment/user-comments");
    return res.data.count || 0;
  } catch (error: any) {
    console.error(
      "Error fetching comments count:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch comments count"
    );
  }
};