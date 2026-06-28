import { Eye, LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { buttonStyles, cardStyles } from "../styles/ui";
import { getAssetUrl } from "../utils/apiClient";
import { deleteBlog } from "../utils/blogsApi";

export interface DashboardBlog {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  category: "Technology" | "Startup" | "Lifestyle" | "Finance";
  author?: { name?: string; email?: string };
  published: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogTableProps {
  blogs: DashboardBlog[];
  onDelete: (id: string) => void;
}

export default function BlogTable({ blogs, onDelete }: BlogTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this blog permanently?")) return;

    try {
      setDeletingId(id);
      await deleteBlog(id);
      onDelete(id);
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className={`${cardStyles} overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-bold text-slate-900">Recent blogs</h2>
          <p className="text-sm text-slate-500">Manage your latest writing.</p>
        </div>
        <Link to="/dashboard/add-blog" className={buttonStyles.secondary}>
          Add blog
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Blog</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Views</th>
              <th className="px-5 py-3">Published</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No blogs yet. Create your first story to populate the dashboard.
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id} className="transition hover:bg-slate-50/80">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {blog.thumbnail ? (
                        <img
                          src={getAssetUrl(`/images/${blog.thumbnail}`)}
                          alt=""
                          className="size-11 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="size-11 rounded-lg bg-gradient-to-br from-cyan-100 to-emerald-100" />
                      )}
                      <div className="min-w-0">
                        <p className="max-w-72 truncate font-semibold text-slate-900">{blog.title}</p>
                        <p className="text-xs text-slate-500">{blog.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${blog.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{blog.views || 0}</td>
                  <td className="px-5 py-4 text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/blog-details/${blog._id}`}
                        aria-label={`Open ${blog.title}`}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-cyan-50 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                      >
                        <Eye className="size-4" />
                      </Link>
                      <button
                        type="button"
                        aria-label={`Delete ${blog.title}`}
                        disabled={deletingId === blog._id}
                        onClick={() => handleDelete(blog._id)}
                        className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50"
                      >
                        {deletingId === blog._id ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
