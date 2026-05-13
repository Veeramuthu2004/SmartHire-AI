import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-8 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-12 right-8 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="rounded-3xl bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/20 p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <h1 className="text-4xl font-bold text-white mb-2">
              Analysis Results
            </h1>
            <p className="text-lg text-slate-300">
              Review your resume-to-job matching analysis history
            </p>
          </div>
        </motion.section>

        {/* Content */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="h-12 w-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Loading your analyses...</p>
              </div>
            </div>
          ) : analyses.length === 0 ? (
            <div className="rounded-2xl bg-slate-900/50 border border-slate-700/50 p-16 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Analyses Yet
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Analyze your resume against a job description to get detailed
                matching insights, skill gaps, and ATS scoring.
              </p>
              <Link
                to="/upload"
                className="inline-block rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Upload Your Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {analyses.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl bg-slate-900/50 border border-slate-700/50 p-8 hover:border-cyan-500/30 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-700/50">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Resume #{analysis.resume_id}
                      </h3>
                      <p className="text-sm text-slate-400">
                        Analyzed on{" "}
                        {new Date(analysis.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Scores Grid */}
                  <div className="grid gap-4 md:grid-cols-3 mb-8">
                    {/* Match Score */}
                    <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-purple-300">
                          Match Score
                        </span>
                        <span className="text-2xl">🎯</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">
                          {analysis.match_score ?? analysis.score ?? 0}%
                        </span>
                      </div>
                      <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${analysis.match_score ?? analysis.score ?? 0}%`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                        />
                      </div>
                    </div>

                    {/* ATS Score */}
                    <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-cyan-300">
                          ATS Score
                        </span>
                        <span className="text-2xl">✨</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">
                          {analysis.ats_score ?? 0}%
                        </span>
                      </div>
                      <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.ats_score ?? 0}%` }}
                          transition={{
                            duration: 1,
                            ease: "easeOut",
                            delay: 0.2,
                          }}
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-400"
                        />
                      </div>
                    </div>

                    {/* Skills Match */}
                    <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-emerald-300">
                          Skills Match
                        </span>
                        <span className="text-2xl">🔧</span>
                      </div>
                      <span className="text-3xl font-bold text-white">
                        {(analysis.matching_skills || []).length}
                      </span>
                      <p className="text-xs text-slate-400 mt-2">
                        matching skills
                      </p>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Matching Skills */}
                    <div>
                      <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-emerald-400">✓</span> Matching
                        Skills
                      </h4>
                      {(analysis.matching_skills || []).length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {(analysis.matching_skills || []).map(
                            (skill, idx) => (
                              <motion.span
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-sm text-emerald-300"
                              >
                                {skill}
                              </motion.span>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-sm">
                          No matching skills found
                        </p>
                      )}
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-orange-400">⚠</span> Missing
                        Skills
                      </h4>
                      {(analysis.missing_skills || []).length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {(analysis.missing_skills || []).map((skill, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/50 text-sm text-orange-300"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-sm">
                          All skills match!
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
