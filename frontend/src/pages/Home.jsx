import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>SmartHire AI</h1>
      <p>AI-powered Resume Analyzer</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/signup" style={{ marginRight: "10px" }}>
          <button>Sign Up</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
}
