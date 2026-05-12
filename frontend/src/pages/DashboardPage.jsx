import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";
import { dashboardService } from "../services";
import { BarChart3, FileText, Briefcase, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500 dark:text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  const statCards = [
    {
      icon: FileText,
      label: "Total Resumes",
      value: stats?.total_resumes || 0,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Briefcase,
      label: "Job Descriptions",
      value: stats?.total_job_descriptions || 0,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: BarChart3,
      label: "Analyses",
      value: stats?.total_analyses || 0,
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: TrendingUp,
      label: "Avg Match Score",
      value: `${stats?.average_match_score || 0}%`,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl"
      >
        <div className="max-w-3xl">
          <p className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
            Overview
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Welcome back! Here's your career progress in one clean snapshot.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="h-full"
          >
            <Card
              className={`!bg-gradient-to-br ${stat.color} !text-white h-full rounded-3xl border-0 shadow-xl shadow-black/10`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm/6 opacity-90">{stat.label}</p>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight">
                    {stat.value}
                  </h3>
                </div>
                <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
                  <stat.icon size={34} className="opacity-90" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Analyses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-3xl border border-gray-100 bg-white/80 shadow-xl shadow-black/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
          <h2 className="mb-6 text-2xl font-bold">Recent Job Analyses</h2>
          {stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Job Analysis #{analysis.id}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Match Score: {analysis.match_percentage}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {analysis.match_percentage}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No analyses yet. Start by uploading a resume!
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
