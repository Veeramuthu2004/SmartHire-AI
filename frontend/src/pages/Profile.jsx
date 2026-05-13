import { useEffect, useState } from "react";
import api from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => setProfile(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <h1 className="text-3xl font-bold">Profile</h1>
        {profile ? (
          <div className="mt-6 space-y-3 text-slate-200">
            <p>
              <span className="text-slate-400">Name:</span> {profile.name}
            </p>
            <p>
              <span className="text-slate-400">Email:</span> {profile.email}
            </p>
            <p>
              <span className="text-slate-400">Bio:</span>{" "}
              {profile.bio || "No bio yet"}
            </p>
          </div>
        ) : (
          <p className="mt-6 text-slate-400">Loading profile...</p>
        )}
      </div>
    </div>
  );
}
