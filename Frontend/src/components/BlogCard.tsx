import { ArrowUpRight, BookOpen, CalendarDays, User } from "lucide-react";
import { Link } from "react-router-dom";
import { cardStyles } from "../styles/ui";
import { getAssetUrl } from "../utils/apiClient";

interface BlogCardProps {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  thumbnail?: string;
  author?: string;
  date: string;
}

export default function BlogCard({
  id,
  title,
  subtitle,
  category,
  thumbnail,
  author,
  date,
}: BlogCardProps) {
  return (
    <article className={`${cardStyles} group overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg`}>
      <Link
        to={`/blog-details/${id}`}
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-inset"
      >
        {thumbnail ? (
          <img
            src={getAssetUrl(`/images/${thumbnail}`)}
            alt=""
            className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gradient-to-br from-cyan-100 via-sky-100 to-emerald-100">
            <BookOpen className="size-10 text-cyan-700/60" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-700">
              {category}
            </span>
            <ArrowUpRight className="size-4 text-slate-400 transition group-hover:text-cyan-700" />
          </div>
          <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-slate-900">
            {title}
          </h2>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
            {subtitle || "Read the full story and join the conversation."}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5" />
              {author || "AIBLOG creator"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              {new Date(date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
