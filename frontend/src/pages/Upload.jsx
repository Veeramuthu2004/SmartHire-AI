import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF or DOCX file");
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status >= 200 && res.status < 300) {
        setSuccess(true);
        setFile(null);
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-slate-900/50 border border-slate-700/50 p-8 backdrop-blur-sm"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Upload Resume
            </h1>
            <p className="text-slate-400">
              Upload your resume in PDF or DOCX format. Max file size: 5MB
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/50 p-4 flex items-start gap-3"
            >
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-emerald-300">
                  Resume uploaded successfully!
                </p>
                <p className="text-sm text-emerald-200">
                  Redirecting to dashboard...
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-lg bg-red-500/10 border border-red-500/50 p-4 flex items-start gap-3"
            >
              <span className="text-2xl">❌</span>
              <div>
                <p className="font-semibold text-red-300">Upload failed</p>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed transition-all ${
                dragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-slate-600 bg-slate-800/30 hover:border-slate-500"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
                required
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: dragActive ? 1.1 : 1 }}
                  className="text-6xl mb-4"
                >
                  {dragActive ? "📥" : "📤"}
                </motion.div>

                <h3 className="text-xl font-semibold text-white mb-2">
                  {file ? file.name : "Drop your resume here"}
                </h3>

                <p className="text-slate-400 mb-4">
                  {file
                    ? `File selected: ${(file.size / 1024).toFixed(1)} KB`
                    : "or click to browse your files"}
                </p>

                <div className="flex gap-2 justify-center text-xs text-slate-500">
                  <span>📄 PDF</span>
                  <span>•</span>
                  <span>📗 DOCX</span>
                  <span>•</span>
                  <span>Max 5MB</span>
                </div>
              </div>
            </div>

            {/* File Preview */}
            {file && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-purple-500/10 border border-purple-500/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {file.type.includes("pdf") ? "📕" : "📗"}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{file.name}</p>
                      <p className="text-sm text-slate-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="px-3 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-sm"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !file || success}
              className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-4 font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </span>
              ) : (
                "Upload Resume"
              )}
            </motion.button>

            {/* Cancel Button */}
            <Link
              to="/dashboard"
              className="block text-center rounded-lg border border-slate-600 px-6 py-4 font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Back to Dashboard
            </Link>
          </form>

          {/* Tips Section */}
          <div className="mt-8 rounded-xl bg-slate-800/50 border border-slate-700/50 p-6">
            <h3 className="font-semibold text-white mb-4">
              ✨ Tips for Better Results
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>✓ Use a clean, professional format</li>
              <li>✓ Include relevant keywords from your target job</li>
              <li>✓ Keep it to 1-2 pages for best ATS compatibility</li>
              <li>
                ✓ Use standard section headers (Experience, Education, Skills)
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
