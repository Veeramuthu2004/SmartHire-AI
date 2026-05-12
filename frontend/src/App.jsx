import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "./context/store";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UploadResumePage from "./pages/UploadResumePage";
import JobMatchAnalysisPage from "./pages/JobMatchAnalysisPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import CoverLetterGeneratorPage from "./pages/CoverLetterGeneratorPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { user, fetchUser } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser().finally(() => setIsInitialized(true));
    } else {
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <RegisterPage />}
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload-resume" element={<UploadResumePage />} />
          <Route
            path="/job-match-analysis"
            element={<JobMatchAnalysisPage />}
          />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route
            path="/cover-letter-generator"
            element={<CoverLetterGeneratorPage />}
          />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
