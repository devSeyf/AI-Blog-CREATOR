import { Trash } from "lucide-react";
import React from "react";
import { deleteBlog } from "../utils/blogsApi";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Author {
  _id?: string;
  name: string;
  email?: string;
}

interface Blog {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  category: "Technology" | "Startup" | "Lifestyle" | "Finance";
  author: Author;
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogTableProps {
  blogs: Blog[];
  onDelete?: (id: string) => void;
}

function BlogTable({ blogs, onDelete }: BlogTableProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(id);
      toast.success("Blog deleted successfully");

      if (onDelete) {
        onDelete(id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete blog");
    }
  };

  return (
    <div className="bg-white shadow-sm border mt-5 border-emerald-100 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
        Recent Blogs
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-emerald-50 text-emerald-700 text-left text-sm font-medium">
              <th className="p-3 border-b">#</th>
              <th className="p-3 border-b">BLOG TITLE</th>
              <th className="p-3 border-b">AUTHOR</th>
              <th className="p-3 border-b">VIEWS</th>
              <th className="p-3 border-b">THUMBNAIL</th>
              <th className="p-3 border-b">DATE</th>
              <th className="p-3 border-b">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No blogs found
                </td>
              </tr>
            ) : (
              blogs.map((blog, index) => (
                <tr key={blog._id}>
                  <td className="p-3 border-b">{index + 1}</td>

                  <td className="p-3 border-b">{blog.title}</td>

                  <td className="p-3 border-b">
                    {blog.author?.name || "Unknown"}
                  </td>

                  <td className="p-3 border-b">{blog.views}</td>

                  <td className="p-3 border-b">
                    {blog.thumbnail ? (
                      <img
                        src={`${BASE_URL}/images/${blog.thumbnail}`}
                        alt={blog.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>

                  <td className="p-3 border-b">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3 border-b">
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BlogTable;