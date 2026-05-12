import { useState } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import { useAuthStore } from "../context/store";
import { useTheme } from "../context/ThemeContext";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    username: user?.username || "",
  });
  const [message, setMessage] = useState(null);
  const [emailNotifications, setEmailNotifications] = useState(() => {
    try {
      const v = localStorage.getItem("email_notifications");
      return v === null ? true : v === "true";
    } catch {
      return true;
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Profile updated successfully!" });
    setIsEditing(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggleEmailNotifications = (e) => {
    const v = e.target.checked;
    setEmailNotifications(v);
    try {
      localStorage.setItem("email_notifications", String(v));
    } catch {}
    setMessage({
      type: "success",
      text: v ? "Email notifications enabled" : "Email notifications disabled",
    });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleToggleTheme = (e) => {
    toggleTheme();
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-8 text-white shadow-2xl"
      >
        <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
          Account
        </p>
        <h1 className="text-4xl font-bold mb-2 md:text-5xl">Profile</h1>
        <p className="max-w-2xl text-white/85">
          Manage your account settings with a cleaner, more focused layout.
        </p>
      </motion.div>

      {message && (
        <Alert
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="rounded-3xl border border-gray-100 bg-white/80 shadow-xl shadow-black/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="avatar"
                    className="h-20 w-20 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-2xl font-bold text-white shadow-lg shadow-primary/30">
                    {user?.full_name?.charAt(0) ||
                      user?.username?.charAt(0) ||
                      "U"}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user?.full_name || user?.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
            <div className="space-y-3 rounded-2xl bg-gray-50/80 p-4 text-sm dark:bg-gray-800/60">
              <div className="flex justify-between gap-4">
                <span className="text-gray-600 dark:text-gray-400">
                  Account Status
                </span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-600 dark:text-gray-400">
                  Account Type
                </span>
                <span className="font-semibold">
                  {user?.is_admin ? "Admin" : "User"}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Edit Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="rounded-3xl border border-gray-100 bg-white/80 shadow-xl shadow-black/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Account Information
              </h2>
              <Button
                variant={isEditing ? "danger" : "secondary"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  value={formData.full_name}
                  onChange={handleChange}
                  name="full_name"
                />
                <Input
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  name="username"
                  disabled
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  disabled
                />
                <div className="pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 rounded-2xl bg-gray-50/80 p-5 dark:bg-gray-800/60">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Full Name
                  </label>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user?.full_name || "Not set"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Username
                  </label>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user?.username}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </label>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user?.email}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card className="rounded-3xl border border-gray-100 bg-white/80 shadow-xl shadow-black/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60">
              <div>
                <h4 className="font-semibold">Email Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive updates about your job matches
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={handleToggleEmailNotifications}
                className="w-6 h-6"
              />
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/60">
              <div>
                <h4 className="font-semibold">Dark Mode</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use dark mode for the interface
                </p>
              </div>
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={handleToggleTheme}
                className="w-6 h-6"
              />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
