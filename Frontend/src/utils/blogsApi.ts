import { api } from "./apiClient";
import { normalizeApiError } from "./apiErrors";

export const getBlogsCount = async (): Promise<number> => {
  try {
    const res = await api.get("/dashboard/blog/blogs-count");
    return res.data.count || 0;
  } catch (error: unknown) {
    throw normalizeApiError(error, "Failed to fetch blogs count");
  }
};

export const getAllBlogs = async (): Promise<any[]> => {
  try {
    const res = await api.get("/dashboard/blog/all-blogs");
    return res.data.blogs;
  } catch (error: unknown) {
    throw normalizeApiError(error, "Failed to fetch blogs");
  }
};

export const getAllPublicBlogs = async (): Promise<any[]> => {
  try {
    const res = await api.get("/blogs/all-blogs");
    return res.data.blogs;
  } catch (error: unknown) {
    throw normalizeApiError(error, "Failed to fetch blogs");
  }
};

export const getBlogById = async (id: string): Promise<any> => {
  try {
    const res = await api.get(`/blogs/${id}`);
    return res.data.blog;
  } catch (error: unknown) {
    throw normalizeApiError(error, "Failed to fetch blog");
  }
};

export const deleteBlog = async (id: string): Promise<void> => {
  try {
    await api.delete(`/dashboard/blog/delete-blog/${id}`);
  } catch (error: unknown) {
    throw normalizeApiError(error, "Failed to delete blog");
  }
};
