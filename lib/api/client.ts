import type { LmsApiResponse } from "@/types/lms";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

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

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    credentials: withCredentials ? "include" : "same-origin",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = (await response.json().catch(() => null)) as LmsApiResponse<T> | null;

  if (!response.ok || !json || json.success === false) {
    const message = json && "message" in json ? json.message : response.statusText;
    const errorCode = json && "errorCode" in json ? json.errorCode : "UNKNOWN_ERROR";
    throw new ApiError(message || "Something went wrong.", response.status, errorCode);
  }

  return json.data;
}
