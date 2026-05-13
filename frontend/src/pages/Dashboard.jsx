import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileUp, BarChart3, BookOpen, TrendingUp } from "lucide-react";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const [profileRes, resumesRes, statsRes] = await Promise.all([
          api.get("/api/auth/me"),
          api.get("/api/resume/list"),
          api.get("/api/analysis/dashboard/stats"),
        ]);
        setUser(profileRes.data);
        setResumes(resumesRes.data || []);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const statCards = [
    {
      label: "Resumes",
      value: stats?.resume_count || resumes.length || 0,
      icon: "📄",
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30",
    },
    {
      label: "Analyses",
      value: stats?.analysis_count || 0,
      icon: "📊",
      color: "from-cyan-500/20 to-cyan-600/20",
      borderColor: "border-cyan-500/30",
    },
    {
      label: "Avg Match",
      value: `${stats?.average_match_score || 0}%`,
      icon: "🎯",
      color: "from-pink-500/20 to-pink-600/20",
      borderColor: "border-pink-500/30",
    },
    {
      label: "Avg ATS",
      value: `${stats?.average_ats_score || 0}%`,
      icon: "✨",
      color: "from-emerald-500/20 to-emerald-600/20",
      borderColor: "border-emerald-500/30",
    },
  ];

  const quickActions = [
    {
      label: "Upload Resume",
      to: "/upload",
      icon: "📤",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "View Analysis",
      to: "/analysis",
      icon: "📈",
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "Analytics",
      to: "/analytics",
      icon: "📊",
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Cover Letter",
      to: "/cover-letter",
      icon: "💌",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 overflow-hidden rounded-3xl"
        >
          <div className="relative bg-gradient-to-br from-purple-900/40 via-slate-900/40 to-cyan-900/40 border border-purple-500/20 p-8 md:p-12 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 pointer-events-none" />
            <div className="relative z-10">
              <p className="text-purple-300 text-sm font-semibold mb-2 uppercase tracking-widest">
                Welcome Back
              </p>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
                {user?.name?.split(" ")?.[0] || "User"}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  !
                </span>
              </h1>
              <p className="text-lg text-slate-300">
                Let's optimize your resume and land your dream job. 🚀
              </p>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            Your Statistics
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {statCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -8 }}
                className={`group rounded-2xl bg-gradient-to-br ${card.color} border ${card.borderColor} p-6 backdrop-blur-xl hover:border-opacity-100 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{card.icon}</div>
                  </div>
                  <p className="text-slate-400 text-sm mb-2 group-hover:text-slate-300 transition-colors">
                    {card.label}
                  </p>
                  <h3 className="text-4xl md:text-5xl font-bold text-white">
                    {card.value}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {quickActions.map((action, index) => {
              return (
                <Link key={action.label} to={action.to}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className={`rounded-2xl bg-gradient-to-br ${action.color} p-8 text-white cursor-pointer hover:shadow-2xl hover:shadow-purple-500/40 transition-all group overflow-hidden relative`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300">
                        {action.icon}
                      </div>
                      <p className="font-semibold text-lg">{action.label}</p>
                      <p className="text-sm text-white/80 mt-1">Quick access</p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Resumes Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 border border-slate-700/50 p-8 md:p-10 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    📄 Your Resumes
                  </h2>
                  <p className="text-slate-400">
                    Manage and track your uploaded resume documents
                  </p>
                </div>
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 font-semibold text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 whitespace-nowrap"
                >
                  <FileUp className="w-5 h-5" />
                  Upload New Resume
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-slate-400">Loading your resumes...</p>
                  </div>
                </div>
              ) : resumes.length === 0 ? (
                <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-dashed border-slate-600 p-16 text-center hover:border-slate-500 transition-colors duration-300">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="text-7xl mb-4">📄</div>
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    No Resumes Yet
                  </h3>
                  <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
                    Start by uploading your resume to get instant AI-powered
                    analysis, ATS optimization, and personalized
                    recommendations.
                  </p>
                  <Link
                    to="/upload"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 font-semibold text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
                  >
                    <FileUp className="w-5 h-5" />
                    Upload Your First Resume
                  </Link>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {resumes.map((resume, index) => (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="group rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 hover:border-purple-500/30 p-6 backdrop-blur transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                            {resume.file_type
                              ?.toLowerCase?.()
                              .includes("pdf") || resume.file_type === "pdf"
                              ? "📕"
                              : "📗"}
                          </div>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 group-hover:bg-purple-500/30 transition-colors">
                            {resume.file_type?.toUpperCase?.() || "FILE"}
                          </span>
                        </div>
                        <p className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                          {resume.filename}
                        </p>
                        <p className="text-sm text-slate-400 mt-3">
                          📅{" "}
                          {new Date(resume.uploaded_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
