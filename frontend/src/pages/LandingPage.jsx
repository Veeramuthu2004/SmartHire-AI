import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Card from "../components/Card";
import { Zap, Brain, BarChart3, Briefcase } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: "AI Resume Analysis",
      description:
        "Advanced NLP algorithms analyze your resume and provide actionable insights",
    },
    {
      icon: Briefcase,
      title: "Job Matching",
      description: "Get matched with jobs based on your skills and experience",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track your job search progress with detailed analytics and statistics",
    },
    {
      icon: Zap,
      title: "AI Cover Letter",
      description: "Generate personalized cover letters powered by AI",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 text-white">
        <h1 className="text-2xl font-bold">SmartHire AI</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 rounded-lg hover:bg-white hover:text-primary transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Your AI-Powered Career Companion
          </h2>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl">
            Analyze your resume, match with perfect jobs, and generate
            personalized cover letters using advanced AI and NLP.
          </p>
          <div className="space-x-4">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Get Started Free
              </Button>
            </Link>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary transition">
              Learn More
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-16">
          Powerful Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="h-full"
            >
              <Card className="!bg-white/10 !text-white backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8 h-full min-h-[240px] flex flex-col items-start justify-start">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-accent">
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3 leading-snug">
                  {feature.title}
                </h4>
                <p className="text-white/90 leading-relaxed text-base">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black bg-opacity-20 backdrop-blur-xl py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-3 gap-8 text-white text-center">
            <div>
              <h4 className="text-4xl font-bold mb-2">10K+</h4>
              <p>Users</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">50K+</h4>
              <p>Resumes Analyzed</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold mb-2">95%</h4>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center text-white">
        <h3 className="text-4xl font-bold mb-6">
          Ready to Transform Your Career?
        </h3>
        <p className="text-xl mb-8 text-gray-100">
          Join thousands of job seekers using SmartHire AI
        </p>
        <Link to="/register">
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
            Start Free Trial
          </Button>
        </Link>
      </section>
    </div>
  );
}
