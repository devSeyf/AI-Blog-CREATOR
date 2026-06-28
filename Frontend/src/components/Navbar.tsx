import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { LogOut, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.jpg";
import { buttonStyles } from "../styles/ui";

const publicNavigation = [{ name: "Home", href: "/" }];
const privateNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Write Blog", href: "/dashboard/add-blog" },
  { name: "Comments", href: "/dashboard/comments" },
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
    isActive
      ? "bg-cyan-50 text-cyan-800"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const navigation = user
    ? [...publicNavigation, ...privateNavigation]
    : publicNavigation;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Disclosure
      as="nav"
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <img src={logo} alt="" className="size-10 rounded-xl object-cover" />
            <span className="text-xl font-black tracking-tight text-slate-900">
              AI<span className="text-cyan-600">BLOG</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <NavLink key={item.href} to={item.href} className={navClass} end={item.href === "/"}>
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login" className={buttonStyles.ghost}>
                  Login
                </Link>
                <Link to="/register" className={buttonStyles.primary}>
                  Sign Up
                </Link>
              </div>
            ) : (
              <Menu as="div" className="relative hidden sm:block">
                <MenuButton className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
                  <img
                    alt=""
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0891b2&color=fff`}
                    className="size-8 rounded-lg"
                  />
                  <span className="max-w-28 truncate">{user.name}</span>
                </MenuButton>
                <MenuItems
                  transition
                  anchor="bottom end"
                  className="z-50 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl transition duration-100 data-closed:scale-95 data-closed:opacity-0"
                >
                  <MenuItem>
                    <button
                      type="button"
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 data-focus:bg-rose-50 disabled:opacity-50"
                    >
                      <LogOut className="size-4" />
                      {loggingOut ? "Signing out..." : "Sign out"}
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )}

            <DisclosureButton className="group inline-flex size-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 md:hidden">
              <span className="sr-only">Toggle navigation</span>
              <MenuIcon className="size-5 group-data-open:hidden" />
              <X className="hidden size-5 group-data-open:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
        <div className="space-y-1">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.href}
              as={NavLink}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }: { isActive: boolean }) =>
                `${navClass({ isActive })} block w-full`
              }
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
        {!user ? (
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 sm:hidden">
            <DisclosureButton as={Link} to="/login" className={buttonStyles.secondary}>
              Login
            </DisclosureButton>
            <DisclosureButton as={Link} to="/register" className={buttonStyles.primary}>
              Sign Up
            </DisclosureButton>
          </div>
        ) : (
          <button
            type="button"
            disabled={loggingOut}
            onClick={handleLogout}
            className={`${buttonStyles.danger} mt-4 w-full sm:hidden`}
          >
            <LogOut className="size-4" />
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
}
