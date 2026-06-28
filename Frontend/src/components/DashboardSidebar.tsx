import {
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PenSquare,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, end: true },
  { name: "Add Blog", path: "/dashboard/add-blog", icon: PenSquare },
  { name: "Comments", path: "/dashboard/comments", icon: MessageCircle },
  { name: "Public Home", path: "/", icon: Home },
];

export default function DashboardSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      setIsOpen(false);
      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open dashboard navigation"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:hidden"
      >
        <Menu className="size-5" />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-200 shadow-2xl transition-transform duration-300 md:sticky md:top-0 md:z-10 md:h-screen md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-700/70 px-6">
          <span className="text-2xl font-black tracking-tight text-white">
            AI<span className="text-cyan-400">BLOG</span>
          </span>
          <button
            type="button"
            aria-label="Close dashboard navigation"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6" aria-label="Dashboard navigation">
          <p className="mb-3 px-3 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>
          {menuItems.map(({ name, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-400/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="size-4.5" />
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-700/70 p-4">
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-50"
          >
            <LogOut className="size-4" />
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
