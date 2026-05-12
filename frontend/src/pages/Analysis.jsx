import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Analysis() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/api/analysis/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAnalyses(data.analyses || []);
        }
      } catch (err) {
        console.error("Failed to fetch analyses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1>Analysis Results</h1>
        <Link to="/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>

      {loading ? (
        <p>Loading analyses...</p>
      ) : analyses.length === 0 ? (
        <p>
          No analyses yet. <Link to="/upload">Upload a resume</Link> to get
          started.
        </p>
      ) : (
        <div>
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>{analysis.resume_id}</h3>
              <p>
                <strong>Score:</strong> {analysis.score}/10
              </p>
              <p>
                <strong>Strengths:</strong> {analysis.strengths.join(", ")}
              </p>
              <p>
                <strong>Weaknesses:</strong> {analysis.weaknesses.join(", ")}
              </p>
              <p>
                <strong>Recommendations:</strong>{" "}
                {analysis.recommendations.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
