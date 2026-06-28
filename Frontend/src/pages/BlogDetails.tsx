import { ArrowLeft, CalendarDays, Eye, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BlogComments from "../components/BlogComments";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";
import { buttonStyles, cardStyles, pageStyles } from "../styles/ui";
import { getAssetUrl } from "../utils/apiClient";
import { getBlogById } from "../utils/blogsApi";

interface Blog {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  thumbnail?: string;
  author?: { name?: string; email?: string };
  views: number;
  createdAt: string;
}

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const loadBlog = async () => {
      if (!id) {
        setError("This blog link is invalid.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const loadedBlog = await getBlogById(id);
        if (active) setBlog(loadedBlog);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Failed to load blog");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadBlog();
    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 pt-24"><LoadingState message="Loading story..." /></div>;
  }

  if (error || !blog) {
    return (
      <main className={`${pageStyles} min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8`}>
        <ErrorState message={error || "Blog not found"} onRetry={() => setReloadKey((key) => key + 1)} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-16">
      <main className={`${pageStyles} px-4 py-8 sm:px-6 lg:px-8 lg:py-12`}>
        <Link to="/" className={buttonStyles.ghost}>
          <ArrowLeft className="size-4" /> Back to stories
        </Link>

        <article className={`${cardStyles} mt-5 overflow-hidden`}>
          {blog.thumbnail && (
            <img
              src={getAssetUrl(`/images/${blog.thumbnail}`)}
              alt=""
              className="max-h-[32rem] w-full object-cover"
            />
          )}
          <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">{blog.category}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{blog.title}</h1>
            {blog.subtitle && <p className="mt-4 text-lg leading-8 text-slate-600">{blog.subtitle}</p>}

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-y border-slate-200 py-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2"><User className="size-4 text-cyan-700" />{blog.author?.name || "AIBLOG creator"}</span>
              <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-cyan-700" />{new Date(blog.createdAt).toLocaleDateString()}</span>
              <span className="inline-flex items-center gap-2"><Eye className="size-4 text-cyan-700" />{blog.views || 0} views</span>
            </div>

            <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">{blog.description}</div>
          </div>
        </article>

        <BlogComments blogTitle={blog.title} blogId={blog._id} />
      </main>
    </div>
  );
}
