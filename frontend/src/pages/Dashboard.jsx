import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
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
      }
    };

    loadDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {user && (
              <p className="text-slate-400">Welcome back, {user.name}!</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              label: "Resumes",
              value: stats?.resume_count || resumes.length || 0,
            },
            { label: "Analyses", value: stats?.analysis_count || 0 },
            {
              label: "Avg Match",
              value: `${stats?.average_match_score || 0}%`,
            },
            { label: "Avg ATS", value: `${stats?.average_ats_score || 0}%` },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 ring-1 ring-white/10"
            >
              <p className="text-sm text-slate-400">{card.label}</p>
              <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Upload Resume", to: "/upload" },
            { label: "View Analysis", to: "/analysis" },
            { label: "Analytics", to: "/analytics" },
            { label: "Cover Letter", to: "/cover-letter" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="rounded-2xl bg-white/5 p-5 text-center ring-1 ring-white/10 hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Resumes</h2>
            <Link
              to="/upload"
              className="text-purple-300 hover:text-purple-200"
            >
              Upload new
            </Link>
          </div>
          {resumes.length === 0 ? (
            <p className="text-slate-400">
              No resumes uploaded yet.{" "}
              <Link to="/upload" className="text-cyan-300 hover:text-cyan-200">
                Upload one
              </Link>
              .
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="rounded-xl bg-slate-900 p-4 ring-1 ring-white/10"
                >
                  <p className="font-medium">{resume.filename}</p>
                  <p className="text-sm text-slate-400">
                    {resume.file_type?.toUpperCase?.() || resume.file_type}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
