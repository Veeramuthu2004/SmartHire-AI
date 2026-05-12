import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // Load user profile and resumes
    setUser({ id: 1, email: "user@example.com", name: "User" });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>Dashboard</h1>
          {user && <p>Welcome, {user.name}!</p>}
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <Link to="/upload">
          <button>Upload Resume</button>
        </Link>
        <Link to="/analysis">
          <button>View Analysis</button>
        </Link>
      </div>

      <div>
        <h2>Your Resumes</h2>
        {resumes.length === 0 ? (
          <p>
            No resumes uploaded yet. <Link to="/upload">Upload one</Link>
          </p>
        ) : (
          <ul>
            {resumes.map((resume) => (
              <li key={resume.id}>{resume.filename}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
