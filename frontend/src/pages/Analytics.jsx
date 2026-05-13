import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import api from "../services/api";
import StatsCharts from "../charts/StatsCharts";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const loadStats = async () => {
      try {
        const res = await api.get("/api/analysis/dashboard/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [navigate]);

  const skillData = (stats?.recent_analyses || []).map((item, index) => ({
    skill: `Skill ${index + 1}`,
    value: Math.min(100, Number(item.match_score || 0)),
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-slate-400">
              Track your resume performance, ATS trends, and skill insights
            </p>
          </div>
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800 transition-all duration-300 whitespace-nowrap"
          >
            ← Back to Dashboard
          </Link>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-12 border border-slate-700/50 text-center"
          >
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-purple-500"></div>
            </div>
            <p className="mt-4 text-slate-300">Loading your analytics...</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Key Metrics Cards */}
            <motion.div
              variants={itemVariants}
              className="grid gap-6 md:grid-cols-4"
            >
              {[
                {
                  label: "Total Resumes",
                  value: stats?.resume_count || 0,
                  icon: "📄",
                  color: "from-purple-500/20 to-pink-500/20",
                  borderColor: "border-purple-500/30",
                  trend: "+12% this month",
                  trendUp: true,
                },
                {
                  label: "Analyses Completed",
                  value: stats?.analysis_count || 0,
                  icon: "📊",
                  color: "from-cyan-500/20 to-blue-500/20",
                  borderColor: "border-cyan-500/30",
                  trend: "+8% this month",
                  trendUp: true,
                },
                {
                  label: "Avg Match Score",
                  value: `${stats?.average_match_score || 0}%`,
                  icon: "🎯",
                  color: "from-emerald-500/20 to-teal-500/20",
                  borderColor: "border-emerald-500/30",
                  trend: "+5% improvement",
                  trendUp: true,
                },
                {
                  label: "Avg ATS Score",
                  value: `${stats?.average_ats_score || 0}%`,
                  icon: "✨",
                  color: "from-amber-500/20 to-orange-500/20",
                  borderColor: "border-amber-500/30",
                  trend: "+3% improvement",
                  trendUp: true,
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl bg-gradient-to-br ${card.color} border ${card.borderColor} p-6 hover:border-opacity-100 transition-all duration-300 backdrop-blur`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{card.icon}</span>
                    {card.trendUp ? (
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                        <ArrowUpRight className="w-4 h-4" />
                        {card.trend}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-400 text-xs font-semibold">
                        <ArrowDownLeft className="w-4 h-4" />
                        {card.trend}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{card.label}</p>
                  <h3 className="text-4xl font-bold text-white">
                    {card.value}
                  </h3>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts Section */}
            <motion.div
              variants={itemVariants}
              className="rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-8 backdrop-blur hover:border-slate-600/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">
                  Performance Insights
                </h2>
              </div>
              <StatsCharts
                analyses={stats?.recent_analyses || []}
                skillData={skillData}
              />
            </motion.div>

            {/* Recent Activity */}
            {stats?.recent_analyses && stats.recent_analyses.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="rounded-2xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-8 backdrop-blur"
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Recent Analyses
                </h2>
                <div className="space-y-4">
                  {stats.recent_analyses.slice(0, 5).map((analysis, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                          📄
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">
                            Analysis #{index + 1}
                          </p>
                          <p className="text-sm text-slate-400">
                            Resume evaluation and optimization
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-400">
                          {Math.round(analysis.match_score || 0)}%
                        </div>
                        <p className="text-xs text-slate-400">Match Score</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
