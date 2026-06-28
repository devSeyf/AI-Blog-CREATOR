import { LoaderCircle, MessageCircle, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { buttonStyles, cardStyles, fieldStyles } from "../styles/ui";
import { isUnauthorized } from "../utils/apiErrors";
import {
  addComment,
  generateAiCommentSuggestions,
  getCommentsByBlog,
} from "../utils/commentApi";
import { EmptyState, ErrorState, LoadingState } from "./ui/AsyncState";

interface Comment {
  _id: string;
  name: string;
  comment: string;
  createdAt?: string;
}

interface BlogCommentsProps {
  blogId: string;
  blogTitle: string;
}

export default function BlogComments({ blogId, blogTitle }: BlogCommentsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentsError, setCommentsError] = useState("");
  const [posting, setPosting] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!blogId) return;
    let active = true;

    const loadComments = async () => {
      try {
        setLoadingComments(true);
        setCommentsError("");
        const loadedComments = await getCommentsByBlog(blogId);
        if (active) setComments(Array.isArray(loadedComments) ? loadedComments : []);
      } catch (error) {
        if (active) setCommentsError(error instanceof Error ? error.message : "Failed to load comments");
      } finally {
        if (active) setLoadingComments(false);
      }
    };

    void loadComments();
    return () => {
      active = false;
    };
  }, [blogId, reloadKey]);

  const requireLogin = () => {
    if (user) return false;
    toast.error("Please log in to comment.");
    navigate("/login");
    return true;
  };

  const handleProtectedError = (error: unknown, fallback: string) => {
    if (isUnauthorized(error)) {
      toast.error("Please log in to comment.");
      navigate("/login");
      return;
    }
    toast.error(error instanceof Error ? error.message : fallback);
  };

  const handleAddComment = async () => {
    if (requireLogin()) return;
    if (!comment.trim() || posting) return;

    try {
      setPosting(true);
      const newComment = await addComment(blogId, user!.name, comment.trim());
      setComments((current) => [newComment, ...current]);
      setComment("");
      toast.success("Comment posted");
    } catch (error) {
      handleProtectedError(error, "Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  const handleGenerateAI = async () => {
    if (requireLogin() || suggesting) return;

    try {
      setSuggesting(true);
      setAiSuggestions(await generateAiCommentSuggestions(blogTitle));
    } catch (error) {
      handleProtectedError(error, "AI generation failed. Please try again later.");
    } finally {
      setSuggesting(false);
    }
  };

  return (
    <section className={`${cardStyles} mx-auto mt-8 max-w-4xl p-5 sm:p-7`}>
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
          <MessageCircle className="size-5" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Join the conversation</h2>
          <p className="text-sm text-slate-500">Read public comments or share your perspective.</p>
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="new-comment" className="sr-only">Write a comment</label>
        <textarea
          id="new-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={user ? "Write a thoughtful comment..." : "Log in to join the conversation..."}
          rows={4}
          className={`${fieldStyles} resize-y`}
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={posting || suggesting || (Boolean(user) && !comment.trim())}
            onClick={handleAddComment}
            className={buttonStyles.primary}
          >
            {posting ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
            {posting ? "Posting..." : "Post comment"}
          </button>
          <button
            type="button"
            disabled={suggesting || posting}
            onClick={handleGenerateAI}
            className={buttonStyles.secondary}
          >
            {suggesting ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {suggesting ? "Generating..." : "AI Suggestions"}
          </button>
        </div>
      </div>

      {aiSuggestions.length > 0 && (
        <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-cyan-800">Choose a suggestion</p>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={`${suggestion}-${index}`}
                type="button"
                onClick={() => setComment(suggestion)}
                className="rounded-full border border-cyan-200 bg-white px-3 py-1.5 text-sm text-cyan-800 transition hover:border-cyan-400 hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-slate-200 pt-6">
        {loadingComments ? (
          <LoadingState message="Loading comments..." className="min-h-28" />
        ) : commentsError ? (
          <ErrorState message={commentsError} onRetry={() => setReloadKey((key) => key + 1)} />
        ) : comments.length === 0 ? (
          <EmptyState title="No comments yet" message="Be the first person to start the conversation." />
        ) : (
          <div className="space-y-4">
            {comments.map((currentComment) => (
              <article key={currentComment._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{currentComment.name}</p>
                  {currentComment.createdAt && (
                    <time className="text-xs text-slate-400">{new Date(currentComment.createdAt).toLocaleDateString()}</time>
                  )}
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{currentComment.comment}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
