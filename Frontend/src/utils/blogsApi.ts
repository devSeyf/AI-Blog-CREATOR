import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getBlogsCount = async (): Promise<number> => {
  try {
    const res = await api.get("/dashboard/blog/blogs-count");
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

export const getAllBlogs = async (): Promise<any[]> => {
  try {
    const res = await api.get("/dashboard/blog/all-blogs");
    return res.data.blogs;
  } catch (error: any) {
    console.error(
      "Error fetching blogs:",
      error.response?.data || error.message,
    );
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
};

export const getAllPublicBlogs = async (): Promise<any[]> => {
  try {
    const res = await api.get("/blogs/all-blogs");
    return res.data.blogs;
  } catch (error: any) {
    console.error(
      "Error fetching blogs:",
      error.response?.data || error.message,
    );
    throw new Error(error.response?.data?.message || "Failed to fetch blogs");
  }
};

export const getBlogById = async (id: string): Promise<any> => {
  try {
    const res = await api.get(`/blogs/${id}`);
    return res.data.blog;
  } catch (error: any) {
    console.error(
      "Error fetching blog by ID:",
      error.response?.data || error.message,
    );
    throw new Error(error.response?.data?.message || "Failed to fetch blog");
  }
};

export const deleteBlog = async (id: string): Promise<void> => {
  try {
    await api.delete(`/dashboard/blog/delete-blog/${id}`);
  } catch (error: any) {
    console.error(
      "Error deleting blog:",
      error.response?.data || error.message,
    );
    throw new Error(error.response?.data?.message || "Failed to delete blog");
  }
};
