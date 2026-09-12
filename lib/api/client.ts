import type { LmsApiResponse } from "@/types/lms";

// Same-origin by default: Next.js proxies /api/* to the LMS backend
// server-side (see rewrites() in next.config.ts), so the browser never
// makes a cross-port request. Set NEXT_PUBLIC_API_URL to bypass the proxy
// and call the backend directly if you ever need to.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export class ApiError extends Error {
  status: number;
  errorCode: string;

  constructor(message: string, status: number, errorCode: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  accessToken?: string | null;
  /** Send the httpOnly refresh-token cookie. Only needed for /auth/* calls. */
  withCredentials?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, accessToken, withCredentials, headers, ...rest } = options;
  // A FormData body (file upload) must keep the browser's own
  // multipart/form-data Content-Type (with its boundary) and must not be
  // JSON-stringified — everything else keeps the existing JSON behavior.
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      credentials: withCredentials ? "include" : "same-origin",
      body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    // fetch() throws (not a rejected HTTP response) when the server is
    // unreachable, refused the connection, or CORS blocked it — surface
    // that distinctly instead of letting callers show a generic message.
    console.error("apiFetch network error:", networkError);
    throw new ApiError(
      `Could not reach the API at ${API_URL}. Is the backend running (cd server && npm run start:dev)?`,
      0,
      "NETWORK_ERROR",
    );
  }

  const json = (await response.json().catch(() => null)) as LmsApiResponse<T> | null;

  if (!response.ok || !json || json.success === false) {
    const message = json && "message" in json ? json.message : response.statusText;
    const errorCode = json && "errorCode" in json ? json.errorCode : "UNKNOWN_ERROR";
    throw new ApiError(message || "Something went wrong.", response.status, errorCode);
  }

  return json.data;
}
