import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllBlogs, getBlogsCount } from "../utils/blogsApi";
import { FileText, MessageSquare } from "lucide-react";
import BlogTable from "../components/BlogTable";
import { getMyCommentsCount } from "../utils/commentApi";

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [commentsCount, setCommentsCount] = useState<number>(0);

  const [blogs, setBlogs] = useState<any[]>([]);
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const [blogsCount, setBlogsCount] = useState<number>(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getBlogsCount();
        setBlogsCount(count);
        const allBlogs = await getAllBlogs();
        setBlogs(allBlogs);

        const comments = await getMyCommentsCount();
        setCommentsCount(comments);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, []);
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex items-center gap-3 rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition bg-white">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <FileText className="text-emerald-600 w-6 h-6" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-emerald-700">
              {loading ? "...." : blogsCount}
            </h2>

            <p className="text-gray-500 font-medium">Blogs</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition bg-white">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <MessageSquare className="text-emerald-600 w-6 h-6" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-emerald-700">
              {loading ? "...." : commentsCount}
            </h2>

            <p className="text-gray-500 font-medium">Comments</p>
          </div>
        </div>
      </div>

      <BlogTable blogs={blogs} />
    </div>
  );
}

export default Dashboard;
