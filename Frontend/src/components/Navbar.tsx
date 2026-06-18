import logo from "../assets/logo.jpg";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Team", href: "#", current: false },
  { name: "Projects", href: "#", current: false },
  { name: "Calendar", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <Disclosure
      as="nav"
      className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group inline-flex items-center justify-center rounded-xl p-2 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>

          {/* Logo + Navigation */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div>
              <img src={logo} alt="AI Blog Logo" width="50" />
            </div>

            <div className="hidden sm:ml-8 sm:block">
              <div className="flex items-center gap-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600",
                      "rounded-xl px-4 py-2 text-sm font-medium transition",
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-3 pr-4 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              {!user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <>
                  <MenuButton className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="size-9 rounded-full border border-slate-200 bg-slate-100 object-cover shadow-sm"
                    />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-3 w-52 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl outline-none transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2.5 text-sm text-slate-700 transition data-focus:bg-blue-50 data-focus:text-blue-600 data-focus:outline-none"
                      >
                        Your profile
                      </a>
                    </MenuItem>

                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2.5 text-sm text-slate-700 transition data-focus:bg-blue-50 data-focus:text-blue-600 data-focus:outline-none"
                      >
                        Settings
                      </a>
                    </MenuItem>

                    <MenuItem>
                      <button
                        onClick={logout}
                        className="block w-full px-4 py-2.5 text-left text-sm text-red-600 transition data-focus:bg-red-50 data-focus:outline-none"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </>
              )}
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <DisclosurePanel className="border-t border-slate-200 bg-white/95 sm:hidden">
        <div className="space-y-1 px-4 pb-4 pt-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600",
                "block rounded-xl px-4 py-2.5 text-base font-medium transition",
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
