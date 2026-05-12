import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Card from "../components/Card";
import Alert from "../components/Alert";
import { resumeService } from "../services";
import { Upload, CheckCircle } from "lucide-react";

export default function UploadResumePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  const normalizeErrorMessage = (error) => {
    const detail = error?.response?.data?.detail;

    if (!detail) {
      return "Error uploading resume";
    }

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") {
            return item.msg || item.message || JSON.stringify(item);
          }
          return String(item);
        })
        .join("; ");
    }

    if (typeof detail === "object") {
      return detail.msg || detail.message || JSON.stringify(detail);
    }

    return String(detail);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setMessage(null);
      } else {
        setFile(null);
        setMessage("Only PDF and DOCX files are allowed");
        setMessageType("error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      setMessageType("error");
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size && file.size > MAX_SIZE) {
      setMessage("File is too large (max 10 MB)");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await resumeService.uploadResume(file, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percent);
          }
        },
      });
      setMessage("Resume uploaded successfully!");
      setMessageType("success");
      setFile(null);
      setProgress(0);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage(normalizeErrorMessage(error));
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Upload Resume</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Upload your resume (PDF or DOCX) to get started with AI analysis
        </p>
      </motion.div>

      {message && (
        <Alert
          type={messageType}
          message={message}
          onClose={() => setMessage(null)}
        />
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="border-2 border-dashed border-primary rounded-lg p-12 text-center">
            <Upload size={48} className="mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">
              Drop your resume here
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              or click to browse (PDF or DOCX)
            </p>

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload">
              <Button
                variant="secondary"
                size="lg"
                as="span"
                className="cursor-pointer"
              >
                Browse Files
              </Button>
            </label>

            {file && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={24} className="text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      {file.name}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-200">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
            {loading && (
              <div className="w-full mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Uploading... {progress}%
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!file}
              type="submit"
            >
              Upload Resume
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setFile(null)}
              disabled={!file}
            >
              Clear
            </Button>
          </div>
        </form>
      </Card>

      {/* Info */}
      <Card className="mt-8 bg-blue-50 dark:bg-blue-900 border-l-4 border-primary">
        <h3 className="font-semibold mb-2">Supported Formats</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>PDF (.pdf)</li>
          <li>Word Document (.docx)</li>
          <li>Maximum file size: 10 MB</li>
        </ul>
      </Card>
    </div>
  );
}
