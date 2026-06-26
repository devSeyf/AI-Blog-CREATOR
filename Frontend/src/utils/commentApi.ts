import axios from "axios";

const api = axios.create({
  baseURL: "https://backendblogainode.onrender.com/comments",
  withCredentials: true,
});

const dashboardApi = axios.create({
  baseURL: "https://backendblogainode.onrender.com/dashboard/comment",
  withCredentials: true,
});

const aiApi = axios.create({
  baseURL: "https://backendblogainode.onrender.com/commentAi",
  withCredentials: true,
});

export const getCommentsByBlog = async (blogId: string): Promise<any> => {
  try {
    const res = await api.get(`/blog-comment/${blogId}`);
    return res.data.comments;
  } catch (error: any) {
    console.error(
      "Error fetching comments:",
      error.response?.data || error.message,
    );
    throw new Error(error.response?.data?.message || "Failed to fetch comment");
  }
};

export const getMyBlogComments = async (): Promise<any> => {
  try {
    const res = await dashboardApi.get("user-comments");
    return res.data.comments;
  } catch (error: any) {
    console.error(
      "Error fetching comments:",
      error.response?.data || error.message,
    );
    throw new Error(error.response?.data?.message || "Failed to fetch comment");
  }
};

export const addComment = async (
  blogId: string,
  username: string,
  comment: string,
): Promise<any> => {
  try {
    const res = await api.post("add-comment", { username, comment, blogId });
    return res.data.comment;
  } catch (error: any) {
    console.error(
      "Error fetching comments:",
      error.response?.data || error.message,
    );
    throw new Error(error.response?.data?.message || "Failed to fetch comment");
  }
};

export const generateAiCommentSuggestions = async (
  topic: string,
): Promise<string[]> => {
  try {
    const res = await aiApi.post("generate-comment", { topic });
    return res.data.suggestions || [];
  } catch (error: any) {
    console.error(
      "Error fetching AI  comments:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch  AI  comment",
    );
  }
};

export const getMyCommentsCount = async (): Promise<number> => {
  try {
    const res = await dashboardApi.get("/user-comments");
    return res.data.count || 0;
  } catch (error: any) {
    console.error(
      "Error fetching blogs count:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch blogs count",
    );
  }
};
