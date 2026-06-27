import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

function AddBlog() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate("/login");
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const handleGenerateAI = async () => {
    if (!title) {
      toast.error("Please enter a topic or title first");
      return;
    }

    try {
      setAiLoading(true);
      const prompt = title;

      const res = await api.post(
        "/ai/generate",
        { prompt },
      );
      if (res.data.success) {
        setDescription(res.data.content);
        toast.success("AI content generated successfully!");
      } else {
        toast.error("Failed to generate content.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("published", String(published));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await api.post(
        "/dashboard/blog/add-blog",
        formData,
      );

      if (res.data.success) {
        toast.success("Blog added successfully");
        setTitle("");
        setSubtitle("");
        setCategory("");
        setDescription("");
        setThumbnail(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add blog");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen bg-linear-to-br from-sky-50 via-cyan-50 to-emerald-50 flex justify-center p-6
    "
    >
      <form
        className="bg-white/80 backdrop-blur-md w-full max-w-2xl rounded-2xl shadow-lg p-8 space-y-5"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-sky-800 text-center mb-6">
          Create a New Blog 📝
        </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-sky-800 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-sky-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            placeholder="Enter blog title"
            required
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-sky-800 mb-1">
            Subtitle
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full border border-sky-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            placeholder="Enter subtitle (optional)"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-sky-800 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-sky-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            required
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Startup">Startup</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        {/* Description + AI Generation */}
        <div>
          <label className="block text-sm font-medium text-sky-800 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={7}
            className="w-full border border-sky-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-sky-300"
            placeholder="Write your blog content..."
          />
          <button
            type="button"
            onClick={handleGenerateAI}
            className="mt-3 text-sm px-4 py-2 bg-linear-to-r from-emerald-400 to-cyan-400 text-white rounded-lg hover:from-emerald-500 hover:to-cyan-500 transition"
            disabled={aiLoading}
          >
            {aiLoading ? "Generating..." : "✨ Generate by AI"}
          </button>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-sky-800 mb-1">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setThumbnail(file);
              if (file) {
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
              }
            }}
            className="w-full border border-sky-200 rounded-lg px-4 py-2"
          />

          {preview && (
            <div className="mt-3">
              <p className="text-sm text-sky-700 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Thumbnail Preview"
                className="w-full h-64 object-cover rounded-lg shadow-md border border-sky-100"
              />
            </div>
          )}
        </div>

        {/* Published */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            id="published"
          />
          <label htmlFor="published" className="text-sky-800 text-sm">
            Publish immediately
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 bg-linear-to-r from-sky-400 to-cyan-400 text-white py-2 rounded-lg font-semibold hover:from-sky-500 hover:to-cyan-500 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
}

export default AddBlog;
