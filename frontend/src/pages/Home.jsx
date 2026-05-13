import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Brain, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning analyzes your resume for strengths and improvements",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      icon: Shield,
      title: "ATS Optimization",
      description:
        "Ensure your resume passes through Applicant Tracking Systems",
      color: "from-cyan-500 to-blue-500",
      gradient: "from-cyan-500/10 to-blue-500/10",
    },
    {
      icon: Zap,
      title: "Skill Gap Detection",
      description: "Identify missing skills and get targeted recommendations",
      color: "from-amber-500 to-orange-500",
      gradient: "from-amber-500/10 to-orange-500/10",
    },
    {
      icon: Sparkles,
      title: "Cover Letter AI",
      description: "Generate personalized, compelling cover letters instantly",
      color: "from-emerald-500 to-teal-500",
      gradient: "from-emerald-500/10 to-teal-500/10",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      quote:
        "SmartHire helped me land interviews at top tech companies in just 2 weeks.",
      avatar: "👩‍💼",
    },
    {
      name: "Marcus Johnson",
      role: "Software Engineer",
      quote:
        "The ATS scoring feature is a game-changer. My application rate increased 300%.",
      avatar: "👨‍💻",
    },
    {
      name: "Emma Davis",
      role: "Marketing Manager",
      quote: "Professional, intuitive, and the results speak for themselves.",
      avatar: "👩‍🔬",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 z-40 w-full border-b border-slate-800/50 bg-slate-950/70 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 text-2xl font-bold"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300">
                SmartHire
              </span>
            </motion.div>
            <div className="flex gap-2">
              <Link
                to="/login"
                className="rounded-lg px-5 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              >
                Get Started
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
        className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden"
      >
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div variants={itemVariants} className="mb-6 inline-block">
            <div className="rounded-full px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-sm font-medium text-purple-300">
              ✨ Trusted by 50K+ job seekers
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold mb-8 text-white leading-tight"
          >
            Your Resume,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Perfected by AI
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Get instant AI-powered feedback on your resume. Optimize for ATS,
            identify skill gaps, and land more interviews.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              to="/signup"
              className="group rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 px-10 py-4 font-semibold text-white hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-slate-700 px-10 py-4 font-semibold text-slate-200 hover:border-slate-600 hover:bg-white/5 transition-all duration-300"
            >
              Sign In
            </Link>
          </motion.div>

          <motion.p variants={itemVariants} className="text-slate-400 text-sm">
            💳 No credit card • ⚡ Free analysis • 🚀 Results in seconds
          </motion.p>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Powerful Features for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Job Success
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to optimize your resume and land interviews
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className={`group rounded-2xl bg-gradient-to-br ${feature.gradient} border border-slate-700/50 p-8 backdrop-blur hover:border-purple-500/50 transition-all duration-300 overflow-hidden`}
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${feature.color}/20 blur-3xl -z-10`}
                  />
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-6 text-white shadow-lg`}
                  >
                    <Icon className="w-full h-full" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-purple-400 to-cyan-400 transition-all">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-lg group-hover:text-slate-300 transition-colors">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 border-y border-slate-800">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: "50K+", label: "Job Seekers Helped" },
              { stat: "2.8x", label: "Avg Interview Increase" },
              { stat: "98%", label: "Positive Feedback" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                  {item.stat}
                </div>
                <p className="text-slate-400 text-lg">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Loved by Professionals
            </h2>
            <p className="text-xl text-slate-400">
              Real results from real users
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="rounded-2xl bg-slate-900/50 border border-slate-800 p-8 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{testimonial.avatar}</span>
                  <div className="text-left">
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-32 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl -z-10" />
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 p-12 md:p-16 text-center backdrop-blur-xl">
            <h2 className="text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of job seekers who have landed their dream roles
              using SmartHire AI. Start your free analysis today—no credit card
              required.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 px-10 py-4 font-semibold text-white hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 group"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-16 px-4">
        <div className="mx-auto max-w-7xl grid md:grid-cols-4 gap-12 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500" />
              <span className="font-bold text-white">SmartHire</span>
            </div>
            <p className="text-slate-400 text-sm">
              AI-powered resume optimization for your dream job.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          <p>© 2026 SmartHire AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
