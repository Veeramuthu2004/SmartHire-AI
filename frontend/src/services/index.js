import apiClient from "./api";

export const authService = {
  register: (userData) => apiClient.post("/api/auth/register", userData),
  login: (email, password) =>
    apiClient.post("/api/auth/login", { email, password }),
  getCurrentUser: () => apiClient.get("/api/auth/me"),
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/api/auth/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const resumeService = {
  uploadResume: (file, config = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    // Let Axios/browser set the multipart boundary automatically unless caller overrides headers.
    const headers = Object.assign({}, config.headers || {});
    return apiClient.post(
      "/api/resume/upload",
      formData,
      Object.assign({}, config, { headers }),
    );
  },
  getResume: (resumeId) => apiClient.get(`/api/resume/${resumeId}`),
  listResumes: () => apiClient.get("/api/resume"),
  deleteResume: (resumeId) => apiClient.delete(`/api/resume/${resumeId}`),
};

export const jobDescriptionService = {
  createJobDescription: (jobData) =>
    apiClient.post("/api/job-description", jobData),
  getJobDescription: (jobId) => apiClient.get(`/api/job-description/${jobId}`),
  listJobDescriptions: () => apiClient.get("/api/job-description"),
  deleteJobDescription: (jobId) =>
    apiClient.delete(`/api/job-description/${jobId}`),
};

export const analysisService = {
  analyzeResume: (resumeId, jobDescriptionId) =>
    apiClient.post("/api/analysis", {
      resume_id: resumeId,
      job_description_id: jobDescriptionId,
    }),
  getAnalysis: (analysisId) => apiClient.get(`/api/analysis/${analysisId}`),
  listAnalyses: () => apiClient.get("/api/analysis"),
  deleteAnalysis: (analysisId) =>
    apiClient.delete(`/api/analysis/${analysisId}`),
};

export const coverLetterService = {
  generateCoverLetter: (resumeId, jobTitle, companyName, jobDescription) =>
    apiClient.post("/api/cover-letter", {
      resume_id: resumeId,
      job_title: jobTitle,
      company_name: companyName,
      job_description: jobDescription,
    }),
  getCoverLetter: (coverLetterId) =>
    apiClient.get(`/api/cover-letter/${coverLetterId}`),
  listCoverLetters: () => apiClient.get("/api/cover-letter"),
  deleteCoverLetter: (coverLetterId) =>
    apiClient.delete(`/api/cover-letter/${coverLetterId}`),
};

export const dashboardService = {
  getStats: () => apiClient.get("/api/dashboard/stats"),
  getMatchScores: () => apiClient.get("/api/dashboard/analytics/match-scores"),
  getSkillDistribution: () =>
    apiClient.get("/api/dashboard/analytics/skill-distribution"),
  getApplicationHistory: () =>
    apiClient.get("/api/dashboard/analytics/application-history"),
};
