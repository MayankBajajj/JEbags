const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, isForm = false } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.message || "Something went wrong", res.status);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body, opts) => request(path, { method: "POST", body, ...opts }),
  patch: (path, body, opts) => request(path, { method: "PATCH", body, ...opts }),
  delete: (path) => request(path, { method: "DELETE" }),
};

export { ApiError };
