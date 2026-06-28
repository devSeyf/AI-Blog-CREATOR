import { PenSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { buttonStyles } from "../styles/ui";

const pageCopy: Record<string, { eyebrow: string; title: string }> = {
  "/dashboard": { eyebrow: "Overview", title: "Content dashboard" },
  "/dashboard/add-blog": { eyebrow: "Create", title: "Write a new blog" },
  "/dashboard/comments": { eyebrow: "Community", title: "Blog comments" },
};

export default function DashboardHeader() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const copy = pageCopy[pathname] || pageCopy["/dashboard"];

  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 pl-16 sm:px-6 sm:pl-16 md:px-8 md:pl-8">
      <div>
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-cyan-700">
          {copy.eyebrow}
        </p>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{copy.title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {pathname !== "/dashboard/add-blog" && (
          <Link to="/dashboard/add-blog" className={`${buttonStyles.primary} hidden sm:inline-flex`}>
            <PenSquare className="size-4" />
            New blog
          </Link>
        )}
        <div className="hidden text-right lg:block">
          <p className="text-xs text-slate-500">Welcome back</p>
          <p className="text-sm font-semibold text-slate-800">{user?.name || "Creator"}</p>
        </div>
      </div>
    </header>
  );
}
