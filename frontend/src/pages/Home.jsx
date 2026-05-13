import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Home() {
  const features = [
    {
      icon: "📄",
      title: "Resume Analysis",
      description: "Get instant AI-powered analysis of your resume",
    },
    {
      icon: "🎯",
      title: "ATS Scoring",
      description: "Optimize for Applicant Tracking Systems",
    },
    {
      icon: "🔧",
      title: "Skill Gap Detection",
      description: "Identify missing skills for your target role",
    },
    {
      icon: "💌",
      title: "Cover Letters",
      description: "Generate professional cover letters instantly",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 dark:from-slate-950 dark:via-purple-900/20 dark:to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 z-40 w-full border-b border-slate-700/30 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500" />
              SmartHire
            </div>
            <div className="flex gap-3">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative min-h-screen flex items-center justify-center px-4 pt-20"
      >
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300"
          >
            Land Your Dream Job
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto"
          >
            SmartHire AI analyzes your resume, provides instant feedback, and
            helps you ace the ATS. Optimize for success.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-4 justify-center mb-12"
          >
            <Link
              to="/signup"
              className="rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105 inline-block"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-slate-600 px-8 py-4 font-semibold text-slate-300 hover:bg-white/5 transition-all"
            >
              Sign In
            </Link>
          </motion.div>

          <motion.p variants={itemVariants} className="text-slate-400 text-sm">
            No credit card required • Free analysis • Results in seconds
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-24 px-4"
      >
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 text-white"
          >
            Powerful Features
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-slate-700/50 hover:border-purple-500/30 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-24 px-4"
      >
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 p-12 md:p-16 border border-purple-500/20 text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have improved their resume with
              SmartHire AI. Start your free analysis today.
            </p>
            <Link
              to="/signup"
              className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-slate-700/30 py-8 px-4 text-center text-slate-400">
        <p>© 2026 SmartHire AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
