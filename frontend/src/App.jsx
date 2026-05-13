import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Analysis from "./pages/Analysis";
import Analytics from "./pages/Analytics";
import CoverLetter from "./pages/CoverLetter";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const noNavbarPages = ["/", "/login", "/signup"];
  const shouldShowNavbar = !noNavbarPages.includes(location.pathname) && user;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white dark:bg-slate-950 dark:text-white transition-colors">
      {shouldShowNavbar && (
        <Navbar user={user} onLogout={() => setUser(null)} />
      )}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLoginSuccess={setUser} />} />
          <Route
            path="/signup"
            element={<Signup onSignupSuccess={setUser} />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {location.pathname !== "/" &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
