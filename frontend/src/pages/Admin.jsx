export default function Admin() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-slate-400">
          User and skill management tools will appear here.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Manage Users", "Moderate Skills", "View System Logs"].map(
            (item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-900 p-5 ring-1 ring-white/10"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
