import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ef4444"];

export default function StatsCharts({ analyses = [], skillData = [] }) {
  const scoreData = analyses.map((item, index) => ({
    name: `A${index + 1}`,
    match: Number(item.match_score || item.score || 0),
    ats: Number(item.ats_score || 0),
  }));

  const pieData = [
    {
      name: "Match",
      value: scoreData.reduce((sum, item) => sum + item.match, 0) || 0,
    },
    {
      name: "ATS",
      value: scoreData.reduce((sum, item) => sum + item.ats, 0) || 0,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl bg-slate-900/80 p-4 shadow-lg ring-1 ring-white/10 lg:col-span-2">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Match & ATS Trend
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="match" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ats" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/80 p-4 shadow-lg ring-1 ring-white/10">
        <h3 className="mb-4 text-lg font-semibold text-white">Score Split</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/80 p-4 shadow-lg ring-1 ring-white/10 lg:col-span-3">
        <h3 className="mb-4 text-lg font-semibold text-white">Skill Radar</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={skillData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="skill" stroke="#cbd5e1" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" />
              <Radar
                name="Skill Strength"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.35}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
