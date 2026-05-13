import { useState } from "react";
import api from "../services/api";

export default function CoverLetter() {
  const [form, setForm] = useState({
    resume_id: "",
    job_title: "",
    company: "",
    job_description: "",
  });
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/analysis/generate-cover-letter", {
        resume_id: Number(form.resume_id),
        job_title: form.job_title,
        company: form.company,
        job_description: form.job_description,
      });
      setGenerated(res.data.generated_text || "");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generated);
    alert("Cover letter copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <form
          onSubmit={submit}
          className="rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10"
        >
          <h1 className="text-3xl font-bold">AI Cover Letter Generator</h1>
          <p className="mt-2 text-slate-400">
            Generate a tailored cover letter in seconds.
          </p>
          {[
            { key: "resume_id", label: "Resume ID", type: "number" },
            { key: "job_title", label: "Job Title", type: "text" },
            { key: "company", label: "Company Name", type: "text" },
          ].map((field) => (
            <div key={field.key} className="mt-4">
              <label className="mb-2 block text-sm text-slate-300">
                {field.label}
              </label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-purple-500"
              />
            </div>
          ))}
          <div className="mt-4">
            <label className="mb-2 block text-sm text-slate-300">
              Job Description
            </label>
            <textarea
              rows={8}
              value={form.job_description}
              onChange={(e) =>
                setForm({ ...form, job_description: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>
          <button
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-3 font-semibold text-white"
          >
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
        </form>

        <div className="rounded-2xl bg-white/5 p-6 shadow-lg ring-1 ring-white/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Generated Output</h2>
            <button
              onClick={copyToClipboard}
              disabled={!generated}
              className="rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20 disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <div className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-slate-200 min-h-[420px]">
            {generated || "Your generated cover letter will appear here."}
          </div>
        </div>
      </div>
    </div>
  );
}
