// Central fetch wrapper. Reads the backend base URL from VITE_API_BASE_URL so
// no component hardcodes it. All domain API helpers build on this.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extractDetail(data) {
  if (!data) return null;
  if (typeof data.detail === "string") return data.detail;
  // FastAPI validation errors arrive as a list of {loc, msg, ...}.
  if (Array.isArray(data.detail)) {
    return data.detail.map((item) => item.msg).filter(Boolean).join(", ");
  }
  return null;
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    // Network-level failure: backend almost certainly not running.
    throw new ApiError(
      "Backend is not available. Please start the backend server.",
      0
    );
  }

  if (!response.ok) {
    let detail = null;
    try {
      detail = extractDetail(await response.json());
    } catch {
      // response had no JSON body
    }
    throw new ApiError(detail || `Request failed (${response.status})`, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
