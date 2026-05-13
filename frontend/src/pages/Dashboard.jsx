import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="rounded-3xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-purple-500/20 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            {user && (
              <p className="text-lg text-slate-300">
                Welcome back,{" "}
                <span className="font-semibold text-purple-300">
                  {user.name}
                </span>
                ! 👋
              </p>
            )}
          </div>
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Your Statistics
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            {statCards.map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -5 }}
                className={`rounded-2xl bg-gradient-to-br ${card.color} border ${card.borderColor} p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-white/5 transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{card.icon}</div>
                  <div className="text-xs font-semibold text-slate-400 bg-white/5 rounded-full px-2 py-1">
                    {card.label}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-2">{card.label}</p>
                <h3 className="text-4xl font-bold text-white">{card.value}</h3>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link key={action.label} to={action.to}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl bg-gradient-to-br ${action.color} p-6 text-white cursor-pointer hover:shadow-lg hover:shadow-white/10 transition-all group`}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <p className="font-semibold text-lg">{action.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Resumes Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="rounded-2xl bg-slate-900/50 border border-slate-700/50 p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Your Resumes
                </h2>
                <p className="text-slate-400">
                  Manage and track your uploaded resume documents
                </p>
              </div>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
              >
                <span>📤</span> Upload New
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="rounded-xl bg-slate-800/50 border border-dashed border-slate-600 p-12 text-center">
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Resumes Yet
                </h3>
                <p className="text-slate-400 mb-6">
                  Start by uploading your resume to get instant AI-powered
                  analysis and recommendations.
                </p>
                <Link
                  to="/upload"
                  className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Upload Your First Resume
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resumes.map((resume, index) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-5 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-2xl">
                        {resume.file_type?.toLowerCase?.().includes("pdf") ||
                        resume.file_type === "pdf"
                          ? "📕"
                          : "📗"}
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                        {resume.file_type?.toUpperCase?.() || "FILE"}
                      </span>
                    </div>
                    <p className="font-semibold text-white truncate">
                      {resume.filename}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      Uploaded on{" "}
                      {new Date(resume.uploaded_at).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
