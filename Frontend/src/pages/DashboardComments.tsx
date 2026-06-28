import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "../components/ui/AsyncState";
import { cardStyles, pageStyles } from "../styles/ui";
import { getMyBlogComments } from "../utils/commentApi";

interface Comment {
  _id: string;
  name: string;
  comment: string;
  blog?: { _id: string; title: string };
  createdAt: string;
}

export default function DashboardComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    const loadComments = async () => {
      try {
        setLoading(true);
        setError("");
        const loaded = await getMyBlogComments();
        if (active) setComments(Array.isArray(loaded) ? loaded : []);
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : "Failed to load comments");
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadComments();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <div className={`${pageStyles} space-y-6`}>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Community</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Comments on your blogs</h2>
        <p className="mt-2 text-sm text-slate-500">Review the conversations happening across your published stories.</p>
      </div>

      {loading ? (
        <LoadingState message="Loading comments..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => setReloadKey((key) => key + 1)} />
      ) : comments.length === 0 ? (
        <EmptyState title="No comments yet" message="Comments on your blogs will appear here." />
      ) : (
        <section className={`${cardStyles} overflow-hidden`}>
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
            <MessageSquare className="size-5 text-cyan-700" />
            <h3 className="font-bold text-slate-900">Recent comments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Reader</th>
                  <th className="px-5 py-3">Comment</th>
                  <th className="px-5 py-3">Blog</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comments.map((comment) => (
                  <tr key={comment._id} className="align-top transition hover:bg-slate-50/80">
                    <td className="px-5 py-4 font-semibold text-slate-800">{comment.name}</td>
                    <td className="max-w-md px-5 py-4 leading-6 text-slate-600">{comment.comment}</td>
                    <td className="px-5 py-4 text-cyan-700">{comment.blog?.title || "Deleted blog"}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
