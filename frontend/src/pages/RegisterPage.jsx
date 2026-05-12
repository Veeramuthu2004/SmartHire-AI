import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../context/store";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import { Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    full_name: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const normalizeErrorMessage = (err) => {
    if (!err) return "Registration failed";
    if (typeof err === "string") return err;
    if (err?.code === "ERR_NETWORK" || !err?.response) {
      return "Network error: unable to reach the server. Check your connection and try again.";
    }
    if (Array.isArray(err)) {
      return err
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object") {
            return item.msg || item.message || JSON.stringify(item);
          }
          return String(item);
        })
        .join(", ");
    }
    if (typeof err === "object") {
      return err.detail || err.message || JSON.stringify(err);
    }
    return String(err);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    const formValues = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    );
    const email = String(formValues.email || "").trim();
    const username = String(formValues.username || "").trim();
    const fullName = String(formValues.full_name || "").trim();
    const password = String(formValues.password || "");
    const confirmPassword = String(formValues.confirmPassword || "");

    // Validation
    if (!email || !username || !password) {
      setValidationError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    try {
      await register({
        email,
        username,
        full_name: fullName,
        password,
      });
      setSuccessMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setValidationError(
        normalizeErrorMessage(
          error.response?.data?.detail || error.message || error,
        ),
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-100">Join SmartHire AI today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
          {successMessage && <Alert type="success" message={successMessage} />}
          {validationError && (
            <Alert
              type="error"
              message={validationError}
              onClose={() => setValidationError(null)}
            />
          )}
          {error && !validationError && (
            <Alert
              type="error"
              message={error}
              onClose={() => setValidationError(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="full_name"
              placeholder="John Doe"
              autoComplete="name"
              value={formData.full_name}
              onChange={handleChange}
            />

            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="johndoe"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="john@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full mt-6"
              type="submit"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
