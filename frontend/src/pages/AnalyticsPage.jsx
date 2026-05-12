import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "../components/Card";
import { dashboardService } from "../services";

export default function AnalyticsPage() {
  const [matchScores, setMatchScores] = useState([]);
  const [skillDistribution, setSkillDistribution] = useState([]);
  const [applicationHistory, setApplicationHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [scoresRes, skillsRes, historyRes] = await Promise.all([
        dashboardService.getMatchScores(),
        dashboardService.getSkillDistribution(),
        dashboardService.getApplicationHistory(),
      ]);
      setMatchScores(scoresRes.data.data);
      setSkillDistribution(skillsRes.data.skills);
      setApplicationHistory(historyRes.data.applications);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-gray-500 dark:text-gray-400">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-2xl"
      >
        <p className="mb-3 inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
          Insights
        </p>
        <h1 className="text-4xl font-bold mb-2 md:text-5xl">Analytics</h1>
        <p className="max-w-2xl text-white/85">
          Track your job search performance with a cleaner, more data-forward
          layout.
        </p>
      </motion.div>

      {/* Match Scores Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-8 rounded-3xl border border-gray-100 bg-white/80 shadow-xl shadow-black/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Match Score Trends
          </h2>
          {matchScores.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={matchScores}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="job_title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="match_score"
                  stroke="#6366f1"
                  name="Match Score"
                />
                {matchScores.some((d) => d.ats_score) && (
                  <Line
                    type="monotone"
                    dataKey="ats_score"
                    stroke="#8b5cf6"
                    name="ATS Score"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No data yet</p>
          )}
        </Card>
      </motion.div>

      {/* Skills Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mb-8 rounded-3xl border border-gray-100 bg-white/80 shadow-xl shadow-black/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Top Skills
          </h2>
          {skillDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No data yet</p>
          )}
        </Card>
      </motion.div>

      {/* Application History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-3xl border border-gray-100 bg-white/80 shadow-xl shadow-black/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Application History
          </h2>
          {applicationHistory.length > 0 ? (
            <div className="space-y-4">
              {applicationHistory.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {app.job_title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {app.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {app.match_score}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(app.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No applications yet
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
