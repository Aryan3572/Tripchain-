const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export async function apiRequest(path, method = "GET", body) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data;
}
