const API_BASE_URL =  "https://job-task-doctor-portal-backend-rho.vercel.app/api/v1";

export class ApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: BodyInit | Record<string, unknown>; token?: string | null };

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: { ...(isFormData ? {} : { "Content-Type": "application/json" }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.message || "Request failed", response.status);
  return (payload.data?.attributes ?? payload) as T;
}
