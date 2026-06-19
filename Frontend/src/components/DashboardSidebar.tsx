import {
  Home,
  LayoutDashboardIcon,
  LogOut,
  Menu,
  MessageCircle,
  PlusCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardSidebar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboardIcon size={18} />,
    },
    {
      name: "Add Blog",
      path: "/dashboard/add-blog",
      icon: <PlusCircle size={18} />,
    },

    {
      name: "Comments",
      path: "/dashboard/comments",
      icon: <MessageCircle size={18} />,
    },
  ];
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="h-[100%] md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 shadow-md border border-sky-100 text-sky-800"
      >
        <Menu size={22} />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed  md:static z-50 top-0 left-0  w-64 bg-white/90 backdrop-blur-md border-r border-sky-100 shadow-lg flex flex-col justify-between transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="p-6 border-b border-sky-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-sky-800">
              AI<span className="text-cyan-500">BLOG</span>
            </h2>

            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-sky-700"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 text-sky-700 hover:bg-linear-to-r from-sky-100 to-cyan-100 rounded-lg px-4 py-2 transition-all duration-200"
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-sky-100">
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
              navigate("/");
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg py-2 font-medium hover:from-red-500 hover:to-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
