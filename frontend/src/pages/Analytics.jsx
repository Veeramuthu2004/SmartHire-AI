import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-slate-400">
              Track resume performance and ATS trends.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white/5 p-6">Loading analytics...</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Resumes", value: stats?.resume_count || 0 },
                { label: "Analyses", value: stats?.analysis_count || 0 },
                {
                  label: "Avg Match",
                  value: `${stats?.average_match_score || 0}%`,
                },
                {
                  label: "Avg ATS",
                  value: `${stats?.average_ats_score || 0}%`,
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
                >
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
                </div>
              ))}
            </div>

            <StatsCharts
              analyses={stats?.recent_analyses || []}
              skillData={skillData}
            />
          </>
        )}
      </div>
    </div>
  );
}
