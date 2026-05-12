import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../context/store";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validationError, setValidationError] = useState(null);

  const normalizeErrorMessage = (err) => {
    if (!err) return "Login failed";
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
    const password = String(formValues.password || "");

    if (!email || !password) {
      setValidationError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-100">Login to your SmartHire AI account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
          {validationError && (
            <Alert
              type="error"
              message={validationError}
              onClose={() => setValidationError(null)}
            />
          )}
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setValidationError(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full mt-6"
              type="submit"
            >
              Login
            </Button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
