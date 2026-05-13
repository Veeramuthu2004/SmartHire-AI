import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700/50 bg-slate-900 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500" />
              SmartHire
            </div>
            <p className="text-slate-400">
              AI-powered resume analysis and career advancement platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/analytics"
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="text-slate-400">Resume Analysis</li>
              <li className="text-slate-400">ATS Scoring</li>
              <li className="text-slate-400">Skill Gap Detection</li>
              <li className="text-slate-400">Cover Letter Generation</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-slate-500 text-sm">
              © {currentYear} SmartHire AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-slate-400 hover:text-slate-200 transition-colors text-sm"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-slate-200 transition-colors text-sm"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-slate-200 transition-colors text-sm"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
