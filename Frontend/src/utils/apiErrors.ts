type ErrorResponse = {
  status?: number;
  data?: {
    message?: string;
    error?: string | { message?: string };
  };
};

type ErrorLike = {
  message?: string;
  response?: ErrorResponse;
};

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function normalizeApiError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): ApiError {
  if (error instanceof ApiError) return error;

  const candidate = error as ErrorLike;
  const responseError = candidate?.response?.data?.error;
  const responseMessage =
    candidate?.response?.data?.message ||
    (typeof responseError === "string"
      ? responseError
      : responseError?.message);
  const message = responseMessage || candidate?.message || fallback;

  return new ApiError(message, candidate?.response?.status);
}

export const isUnauthorized = (error: unknown) =>
  normalizeApiError(error).status === 401;

