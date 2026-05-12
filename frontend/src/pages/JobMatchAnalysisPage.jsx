import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import {
  resumeService,
  jobDescriptionService,
  analysisService,
} from "../services";
import { BarChart3, TrendingUp } from "lucide-react";

export default function JobMatchAnalysisPage() {
  const [resumes, setResumes] = useState([]);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    description: "",
    requirements: "",
    location: "",
  });
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resumesRes, jobsRes] = await Promise.all([
        resumeService.listResumes(),
        jobDescriptionService.listJobDescriptions(),
      ]);
      setResumes(resumesRes.data);
      setJobDescriptions(jobsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleJobChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company_name || !formData.description) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response =
        await jobDescriptionService.createJobDescription(formData);
      setJobDescriptions([...jobDescriptions, response.data]);
      setFormData({
        title: "",
        company_name: "",
        description: "",
        requirements: "",
        location: "",
      });
      setMessage("Job description added successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage("Error adding job description");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResume || !selectedJob) {
      setMessage("Please select both a resume and job description");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await analysisService.analyzeResume(
        selectedResume,
        selectedJob,
      );
      setAnalysisResult(response.data);
      setMessage("Analysis completed successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage("Error analyzing resume");
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
        <h1 className="text-4xl font-bold mb-2">Job Match Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Compare your resume with job descriptions
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
        {/* Job Description Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6">Add Job Description</h2>
            <form onSubmit={handleAddJob} className="space-y-4">
              <Input
                label="Job Title"
                placeholder="Senior React Developer"
                name="title"
                value={formData.title}
                onChange={handleJobChange}
              />
              <Input
                label="Company Name"
                placeholder="Tech Company Inc."
                name="company_name"
                value={formData.company_name}
                onChange={handleJobChange}
              />
              <Input
                label="Location"
                placeholder="New York, NY"
                name="location"
                value={formData.location}
                onChange={handleJobChange}
              />
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Job Description
                </label>
                <textarea
                  placeholder="Paste the job description here"
                  name="description"
                  value={formData.description}
                  onChange={handleJobChange}
                  className="input-field min-h-32"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Requirements (Optional)
                </label>
                <textarea
                  placeholder="Required skills and experience"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleJobChange}
                  className="input-field min-h-20"
                />
              </div>
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
                type="submit"
              >
                Add Job
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <h2 className="text-2xl font-bold mb-6">Select & Analyze</h2>

            {/* Resume Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Your Resume
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
              {resumes.length === 0 && (
                <p className="text-orange-600 text-sm mt-2">
                  No resumes uploaded yet
                </p>
              )}
            </div>

            {/* Job Description Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Job Description
              </label>
              <select
                value={selectedJob || ""}
                onChange={(e) => setSelectedJob(Number(e.target.value))}
                className="input-field"
              >
                <option value="">Select a job</option>
                {jobDescriptions.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} at {job.company_name}
                  </option>
                ))}
              </select>
              {jobDescriptions.length === 0 && (
                <p className="text-orange-600 text-sm mt-2">
                  Add a job description first
                </p>
              )}
            </div>

            {/* Analyze Button */}
            <Button
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mb-6"
              onClick={handleAnalyze}
              disabled={!selectedResume || !selectedJob}
            >
              <TrendingUp size={20} className="mr-2 inline" />
              Analyze Match
            </Button>

            {/* Analysis Results */}
            {analysisResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 p-6 rounded-lg">
                  <h3 className="text-2xl font-bold mb-4">Analysis Results</h3>

                  {/* Match Score */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Match Score
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {analysisResult.match_percentage}%
                      </p>
                    </div>
                    {analysisResult.ats_score && (
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ATS Score
                        </p>
                        <p className="text-3xl font-bold text-blue-600">
                          {analysisResult.ats_score}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Matching Skills */}
                  {analysisResult.matching_skills &&
                    analysisResult.matching_skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Matching Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.matching_skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-100 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Missing Skills */}
                  {analysisResult.missing_skills &&
                    analysisResult.missing_skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Missing Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missing_skills
                            .slice(0, 5)
                            .map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-red-200 dark:bg-red-700 text-red-800 dark:text-red-100 px-3 py-1 rounded-full text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Suggestions */}
                  {analysisResult.improvement_suggestions &&
                    analysisResult.improvement_suggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">
                          Improvement Suggestions
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {analysisResult.improvement_suggestions.map(
                            (suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
