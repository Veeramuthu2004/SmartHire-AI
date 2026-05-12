import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${apiUrl}/api/resume/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Resume uploaded successfully!");
        navigate("/dashboard");
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Upload Resume</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            required
            style={{ width: "100%", padding: "10px" }}
          />
          <small>Accepted formats: PDF, DOCX</small>
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
