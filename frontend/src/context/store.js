import { create } from "zustand";
import { authService } from "../services";

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.detail || "Registration failed" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      localStorage.setItem("access_token", response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
      try {
        const userResponse = await authService.getCurrentUser();
        set({ user: userResponse.data });
        return userResponse.data;
      } catch {
        set({ user: null });
        return response.data;
      }
    } catch (error) {
      set({ error: error.response?.data?.detail || "Login failed" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null });
  },

  fetchUser: async () => {
    try {
      const response = await authService.getCurrentUser();
      set({ user: response.data });
    } catch (error) {
      set({ user: null });
    }
  },
}));

export const useResumeStore = create((set) => ({
  resumes: [],
  selectedResume: null,
  isLoading: false,

  setResumes: (resumes) => set({ resumes }),
  setSelectedResume: (resume) => set({ selectedResume: resume }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useAnalysisStore = create((set) => ({
  analyses: [],
  currentAnalysis: null,
  isLoading: false,

  setAnalyses: (analyses) => set({ analyses }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
