import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/store";
import {
  Menu,
  X,
  LogOut,
  Home,
  FileText,
  Briefcase,
  BarChart3,
  FileUp,
  Settings,
} from "lucide-react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: FileUp, label: "Upload Resume", path: "/upload-resume" },
    { icon: Briefcase, label: "Job Analysis", path: "/job-match-analysis" },
    { icon: FileText, label: "Cover Letter", path: "/cover-letter-generator" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
      <aside
        className={`$${sidebarOpen ? "w-64" : "w-20"} relative flex flex-col border-r border-white/60 bg-white/80 backdrop-blur-xl shadow-2xl transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/90`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
          {sidebarOpen && (
            <h1 className="text-xl font-bold gradient-text">SmartHire AI</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-xl p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-primary text-white shadow-lg shadow-primary/30"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-gray-100 p-4 dark:border-gray-800">
          {sidebarOpen && (
            <div className="mb-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-pink-50 p-4 dark:from-gray-800 dark:to-gray-900">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {user?.full_name || user?.username}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
