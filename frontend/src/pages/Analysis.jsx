import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Analysis() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await api.get("/api/analysis/history");
        setAnalyses(
          Array.isArray(res.data) ? res.data : res.data.analyses || [],
        );
      } catch (err) {
        console.error("Failed to fetch analyses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div>
            <h1 className="text-3xl font-bold">Analysis Results</h1>
            <p className="text-slate-400">Resume-vs-job comparison history</p>
          </div>
          <Link
            to="/dashboard"
            className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="rounded-2xl bg-white/5 p-6">Loading analyses...</p>
        ) : analyses.length === 0 ? (
          <p className="rounded-2xl bg-white/5 p-6 text-slate-400">
            No analyses yet.{" "}
            <Link to="/upload" className="text-cyan-300">
              Upload a resume
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <div className="grid gap-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
              >
                <h3 className="text-xl font-semibold">
                  Resume #{analysis.resume_id}
                </h3>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <p>
                    <strong>Match Score:</strong>{" "}
                    {analysis.match_score ?? analysis.score ?? 0}%
                  </p>
                  <p>
                    <strong>ATS Score:</strong> {analysis.ats_score ?? 0}%
                  </p>
                  <p>
                    <strong>Matching Skills:</strong>{" "}
                    {(analysis.matching_skills || []).join(", ") || "None"}
                  </p>
                  <p>
                    <strong>Missing Skills:</strong>{" "}
                    {(analysis.missing_skills || []).join(", ") || "None"}
                  </p>
                </div>
                <p className="mt-3">
                  <strong>Recommendations:</strong>{" "}
                  {(analysis.recommendations || [])
                    .map((item) => item.skill || item)
                    .join(", ") || "None"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
