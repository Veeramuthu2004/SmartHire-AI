import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import { resumeService, coverLetterService } from "../services";
import { Copy, Download } from "lucide-react";

export default function CoverLetterGeneratorPage() {
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    jobDescription: "",
  });
  const [currentCoverLetter, setCurrentCoverLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const response = await resumeService.listResumes();
      setResumes(response.data);
    } catch (error) {
      console.error("Error loading resumes:", error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedResume || !formData.jobTitle || !formData.companyName) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await coverLetterService.generateCoverLetter(
        selectedResume,
        formData.jobTitle,
        formData.companyName,
        formData.jobDescription,
      );
      setCurrentCoverLetter(response.data);
      setMessage("Cover letter generated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Error generating cover letter");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCoverLetter.content);
    setMessage("Cover letter copied to clipboard!");
    setMessageType("success");
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([currentCoverLetter.content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${currentCoverLetter.company_name}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">AI Cover Letter Generator</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Generate personalized cover letters powered by AI
        </p>
      </motion.div>

      {message && (
        <Alert
          type={messageType}
          message={message}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6">Generate Cover Letter</h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Resume
                </label>
                <select
                  value={selectedResume || ""}
                  onChange={(e) => setSelectedResume(Number(e.target.value))}
                  className="input-field"
                >
                  <option value="">Select a resume</option>
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      {resume.filename}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Job Title"
                placeholder="Senior Developer"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleFormChange}
              />

              <Input
                label="Company Name"
                placeholder="Tech Company Inc."
                name="companyName"
                value={formData.companyName}
                onChange={handleFormChange}
              />

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Job Description (Optional)
                </label>
                <textarea
                  placeholder="Paste job description for better personalization"
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleFormChange}
                  className="input-field min-h-32"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
                type="submit"
                disabled={!selectedResume}
              >
                Generate Letter
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          {currentCoverLetter ? (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Cover Letter</h2>
                <div className="space-x-2">
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    <Copy size={16} className="inline mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download size={16} className="inline mr-2" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg min-h-96 whitespace-pre-wrap text-sm leading-relaxed">
                {currentCoverLetter.content}
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  ✨ AI Generated Content
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  Feel free to edit this letter to make it more personal and
                  specific to your experience.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <p className="text-gray-500 text-lg">
                  No cover letter generated yet
                </p>
                <p className="text-gray-400 text-sm">
                  Fill in the form on the left to generate your cover letter
                </p>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
