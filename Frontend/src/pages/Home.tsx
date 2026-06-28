import { ArrowRight, PenLine } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import CategoriesBar from "../components/CategoriesBar";
import { EmptyState, ErrorState, LoadingState } from "../components/ui/AsyncState";
import { useAuth } from "../context/AuthContext";
import { buttonStyles, pageStyles } from "../styles/ui";
import { getAllPublicBlogs } from "../utils/blogsApi";
import { onlyPublishedBlogs } from "../utils/blogFilters";

interface PublicBlog {
  _id: string;
  title: string;
  subtitle?: string;
  category: string;
  thumbnail?: string;
  author?: { name?: string };
  createdAt: string;
  published?: boolean;
}

export default function Home() {
  const { user } = useAuth();
  const [category, setCategory] = useState("all");
  const [blogs, setBlogs] = useState<PublicBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setBlogs(onlyPublishedBlogs(await getAllPublicBlogs()));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBlogs();
  }, [loadBlogs]);

  const filteredBlogs = useMemo(
    () =>
      category === "all"
        ? blogs
        : blogs.filter((blog) => blog.category === category),
    [blogs, category],
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <section className="border-b border-slate-200 bg-white">
        <div className={`${pageStyles} px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8`}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
            Stories from independent creators
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Ideas that move people forward.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Discover practical perspectives, thoughtful stories, and fresh ideas from the AIBLOG community.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#latest" className={buttonStyles.primary}>
              Explore stories <ArrowRight className="size-4" />
            </a>
            {user && (
              <Link to="/dashboard/add-blog" className={buttonStyles.secondary}>
                <PenLine className="size-4" /> Write a blog
              </Link>
            )}
          </div>
        </div>
      </section>

      <main id="latest" className={`${pageStyles} scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8 lg:py-14`}>
        <div className="mb-8 flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Latest writing</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">Explore the community</h2>
          </div>
          <CategoriesBar selectedCategory={category} onSelect={setCategory} />
        </div>

        {loading ? (
          <LoadingState message="Loading stories..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadBlogs} />
        ) : blogs.length === 0 ? (
          <EmptyState title="No stories yet" message="The first AIBLOG story will appear here." />
        ) : filteredBlogs.length === 0 ? (
          <EmptyState title="No stories in this category" message="Choose another category to keep exploring." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                id={blog._id}
                title={blog.title}
                subtitle={blog.subtitle}
                category={blog.category}
                thumbnail={blog.thumbnail}
                author={blog.author?.name}
                date={blog.createdAt}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
