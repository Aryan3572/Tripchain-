import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/api/auth/profile", "GET");
        setProfile(res.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="page-container">Loading profile...</div>;

  if (!profile) return <div className="page-container">No profile data available.</div>;

  return (
    <div className="page-container">
      <h2 className="page-title">My Profile</h2>
      <div className="card">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
