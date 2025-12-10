/**
 * Tests for error handling utilities
 */

import {
  AppError,
  ErrorCode,
  createErrorResponse,
  getUserFriendlyMessage,
  isRetryableError,
} from "../errors";

describe("AppError", () => {
  it("should create error with correct properties", () => {
    const error = new AppError(
      ErrorCode.VALIDATION_ERROR,
      "Invalid email",
      400,
      { field: "email" }
    );

    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Invalid email");
    expect(error.details?.field).toBe("email");
    expect(error.timestamp).toBeDefined();
  });

  it("should have default status code of 500", () => {
    const error = new AppError(
      ErrorCode.INTERNAL_ERROR,
      "Something went wrong"
    );

    expect(error.statusCode).toBe(500);
  });
});

describe("createErrorResponse", () => {
  it("should format AppError correctly", () => {
    const appError = new AppError(
      ErrorCode.UNAUTHORIZED,
      "Not authenticated",
      401
    );

    const response = createErrorResponse(appError);

    expect(response.status).toBe(401);
    expect(response.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(response.message).toBe("Not authenticated");
    expect(response.timestamp).toBeDefined();
  });

  it("should handle TypeError (network errors)", () => {
    const networkError = new TypeError("Failed to fetch");
    const response = createErrorResponse(networkError);

    expect(response.status).toBe(503);
    expect(response.code).toBe(ErrorCode.NETWORK_ERROR);
    expect(response.message).toContain("Network connection");
  });

  it("should handle SyntaxError (JSON parse errors)", () => {
    const syntaxError = new SyntaxError("Invalid JSON");
    const response = createErrorResponse(syntaxError);

    expect(response.status).toBe(400);
    expect(response.code).toBe(ErrorCode.INVALID_INPUT);
  });

  it("should include requestId when provided", () => {
    const error = new AppError(ErrorCode.INTERNAL_ERROR, "Error");
    const response = createErrorResponse(error, 500, "req-123");

    expect(response.requestId).toBe("req-123");
  });
});

describe("getUserFriendlyMessage", () => {
  it("should return appropriate message for UNAUTHORIZED", () => {
    const error = new AppError(
      ErrorCode.UNAUTHORIZED,
      "Auth failed",
      401
    );
    const message = getUserFriendlyMessage(error);

    expect(message).toContain("session has expired");
  });

  it("should return appropriate message for FORBIDDEN", () => {
    const error = new AppError(
      ErrorCode.FORBIDDEN,
      "No access",
      403
    );
    const message = getUserFriendlyMessage(error);

    expect(message).toContain("permission");
  });

  it("should handle TypeError network error", () => {
    const error = new TypeError("Failed to fetch");
    const message = getUserFriendlyMessage(error);

    expect(message).toContain("Network connection");
  });

  it("should return custom message for VALIDATION_ERROR", () => {
    const error = new AppError(
      ErrorCode.VALIDATION_ERROR,
      "Email is required",
      400
    );
    const message = getUserFriendlyMessage(error);

    expect(message).toBe("Email is required");
  });
});

describe("isRetryableError", () => {
  it("should retry for 503 status", () => {
    expect(isRetryableError(null, 503)).toBe(true);
  });

  it("should retry for 502 status", () => {
    expect(isRetryableError(null, 502)).toBe(true);
  });

  it("should retry for 500 status", () => {
    expect(isRetryableError(null, 500)).toBe(true);
  });

  it("should not retry for 401 status", () => {
    expect(isRetryableError(null, 401)).toBe(false);
  });

  it("should not retry for UNAUTHORIZED error", () => {
    const error = new AppError(
      ErrorCode.UNAUTHORIZED,
      "Not authorized",
      401
    );
    expect(isRetryableError(error)).toBe(false);
  });

  it("should not retry for FORBIDDEN error", () => {
    const error = new AppError(
      ErrorCode.FORBIDDEN,
      "Forbidden",
      403
    );
    expect(isRetryableError(error)).toBe(false);
  });

  it("should not retry for VALIDATION_ERROR", () => {
    const error = new AppError(
      ErrorCode.VALIDATION_ERROR,
      "Invalid input",
      400
    );
    expect(isRetryableError(error)).toBe(false);
  });

  it("should retry for network TypeError", () => {
    const error = new TypeError("Failed to fetch");
    expect(isRetryableError(error)).toBe(true);
  });
});
