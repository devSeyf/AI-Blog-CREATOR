import { Eye, FileText, MessageSquare, PenSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BlogTable, { type DashboardBlog } from "../components/BlogTable";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";
import { useAuth } from "../context/AuthContext";
import { buttonStyles, cardStyles, pageStyles } from "../styles/ui";
import { getAllBlogs, getBlogsCount } from "../utils/blogsApi";
import { getMyCommentsCount } from "../utils/commentApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [blogs, setBlogs] = useState<DashboardBlog[]>([]);
  const [blogsCount, setBlogsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login", { replace: true });
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (authLoading || !user) return;
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const [count, allBlogs, comments] = await Promise.all([
          getBlogsCount(),
          getAllBlogs(),
          getMyCommentsCount(),
        ]);
        if (!active) return;
        setBlogsCount(count);
        setBlogs(allBlogs);
        setCommentsCount(comments);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard");
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDashboard();
    return () => {
      active = false;
    };
  }, [authLoading, reloadKey, user]);

  const totalViews = useMemo(
    () => blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
    [blogs],
  );

  const handleDeleted = (id: string) => {
    setBlogs((current) => current.filter((blog) => blog._id !== id));
    setBlogsCount((current) => Math.max(0, current - 1));
  };

  if (authLoading || loading) return <LoadingState message="Loading your dashboard..." />;

  if (error) {
    return <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />;
  }

  const stats = [
    { label: "Total blogs", value: blogsCount, icon: FileText, color: "text-cyan-700 bg-cyan-100" },
    { label: "Comments", value: commentsCount, icon: MessageSquare, color: "text-emerald-700 bg-emerald-100" },
    { label: "Total views", value: totalViews, icon: Eye, color: "text-amber-700 bg-amber-100" },
  ];

  return (
    <div className={`${pageStyles} space-y-6`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Your workspace</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Everything you have published.</h2>
          <p className="mt-2 text-sm text-slate-500">Track content, engagement, and recent activity.</p>
        </div>
        <Link to="/dashboard/add-blog" className={buttonStyles.primary}>
          <PenSquare className="size-4" /> New blog
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <article key={label} className={`${cardStyles} p-5`}>
            <div className={`inline-flex size-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="size-5" />
            </div>
            <p className="mt-4 text-3xl font-black text-slate-950">{value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
          </article>
        ))}
      </div>

      <BlogTable blogs={blogs} onDelete={handleDeleted} />
    </div>
  );
}
