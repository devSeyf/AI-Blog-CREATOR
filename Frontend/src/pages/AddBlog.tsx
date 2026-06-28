import { ImagePlus, LoaderCircle, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  buttonStyles,
  cardStyles,
  fieldStyles,
  labelStyles,
  pageStyles,
} from "../styles/ui";
import { api } from "../utils/apiClient";
import { normalizeApiError } from "../utils/apiErrors";

export default function AddBlog() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [published, setPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login", { replace: true });
  }, [authLoading, navigate, user]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const clearThumbnail = () => {
    setThumbnail(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (file?: File) => {
    if (!file) {
      clearThumbnail();
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      clearThumbnail();
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Thumbnail must be smaller than 5 MB.");
      clearThumbnail();
      return;
    }

    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGenerateAI = async () => {
    if (!title.trim()) {
      toast.error("Enter a title before generating content.");
      return;
    }

    try {
      setAiLoading(true);
      const response = await api.post("/ai/generate", { prompt: title.trim() });
      if (!response.data?.content) throw new Error("AI returned no content.");
      setDescription(response.data.content);
      toast.success("AI content generated successfully");
    } catch (error) {
      toast.error(normalizeApiError(error, "AI generation failed. Please try again later.").message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("subtitle", subtitle.trim());
      formData.append("category", category);
      formData.append("description", description.trim());
      formData.append("published", String(published));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const response = await api.post("/dashboard/blog/add-blog", formData);
      if (!response.data?.success) throw new Error("Failed to add blog");

      setTitle("");
      setSubtitle("");
      setCategory("");
      setDescription("");
      setPublished(false);
      clearThumbnail();
      toast.success("Blog created successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(normalizeApiError(error, "Failed to add blog").message);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className={`${pageStyles} max-w-5xl`}>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Creator studio</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">Create a new blog</h2>
        <p className="mt-2 text-sm text-slate-500">Draft your story, generate a starting point with AI, and publish when ready.</p>
      </div>

      <form onSubmit={handleSubmit} className={`${cardStyles} overflow-hidden`}>
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-5">
            <div>
              <label htmlFor="blog-title" className={labelStyles}>Title</label>
              <input
                id="blog-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={fieldStyles}
                placeholder="A clear, compelling title"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="blog-subtitle" className={labelStyles}>Subtitle</label>
                <input
                  id="blog-subtitle"
                  value={subtitle}
                  onChange={(event) => setSubtitle(event.target.value)}
                  className={fieldStyles}
                  placeholder="Optional supporting line"
                />
              </div>
              <div>
                <label htmlFor="blog-category" className={labelStyles}>Category</label>
                <select
                  id="blog-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={fieldStyles}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Startup">Startup</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="blog-description" className="text-sm font-semibold text-slate-700">Content</label>
                <button
                  type="button"
                  disabled={aiLoading || submitting}
                  onClick={handleGenerateAI}
                  className={buttonStyles.secondary}
                >
                  {aiLoading ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  {aiLoading ? "Generating..." : "Generate with AI"}
                </button>
              </div>
              <textarea
                id="blog-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={14}
                className={`${fieldStyles} resize-y leading-6`}
                placeholder="Write your story here..."
                required
              />
            </div>
          </div>

          <aside className="space-y-5">
            <div>
              <label htmlFor="blog-thumbnail" className={labelStyles}>Thumbnail</label>
              <input
                ref={fileInputRef}
                id="blog-thumbnail"
                type="file"
                accept="image/*"
                onChange={(event) => handleFileChange(event.target.files?.[0])}
                className="sr-only"
              />
              {preview ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  <img src={preview} alt="Thumbnail preview" className="aspect-video w-full object-cover" />
                  <button type="button" onClick={clearThumbnail} className={`${buttonStyles.ghost} w-full rounded-none text-rose-600`}>
                    <Trash2 className="size-4" /> Remove image
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="blog-thumbnail"
                  className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-cyan-400 hover:bg-cyan-50"
                >
                  <ImagePlus className="mb-2 size-7 text-cyan-700" />
                  <span className="text-sm font-semibold text-slate-700">Upload thumbnail</span>
                  <span className="mt-1 text-xs text-slate-500">Image up to 5 MB</span>
                </label>
              )}
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="mt-0.5 size-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-800">Publish immediately</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">Make this story visible on the public home page.</span>
              </span>
            </label>
          </aside>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button type="button" onClick={() => navigate("/dashboard")} className={buttonStyles.secondary}>
            Cancel
          </button>
          <button type="submit" disabled={submitting || aiLoading} className={buttonStyles.primary}>
            {submitting && <LoaderCircle className="size-4 animate-spin" />}
            {submitting ? "Publishing..." : published ? "Publish blog" : "Save draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
