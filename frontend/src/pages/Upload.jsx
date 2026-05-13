import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status >= 200 && res.status < 300) {
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
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <h2 className="text-3xl font-bold">Upload Resume</h2>
        <p className="mt-2 text-slate-400">Accepted formats: PDF, DOCX</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            required
            className="w-full rounded-xl border border-dashed border-white/20 bg-slate-900 px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </button>
        </form>
      </div>
    </div>
  );
}
