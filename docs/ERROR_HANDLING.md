# 🔧 Error Handling Implementation Guide

This document provides implementation guidelines for using the new error handling system in Alika Frontend.

## Quick Start

### 1. Using AppError in API Routes

```typescript
// src/app/api/example/route.ts
import { AppError, ErrorCode, createErrorResponse } from "@/lib/errors";
import { nanoid } from "nanoid";

export async function GET(req: Request) {
  const requestId = nanoid();
  
  try {
    // Your logic here
    
    // Throw errors with AppError
    if (!session) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        "Session not found. Please login again.",
        401
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    const response = createErrorResponse(error, 500, requestId);
    return NextResponse.json(response, { status: response.status });
  }
}
```

### 2. Using fetchWithRetry in Components/Contexts

```typescript
// src/context/example.tsx
import { fetchWithRetry } from "@/lib/fetch-with-retry";
import { getUserFriendlyMessage } from "@/lib/errors";

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetchWithRetry("/api/data", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }, {
      maxRetries: 3,
      onRetry: (attempt) => {
        console.log(`Retrying attempt ${attempt}...`);
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    
    const data = await response.json();
    setData(data);
  } catch (error) {
    const errorMessage = getUserFriendlyMessage(error);
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
```

## Error Codes Reference

### Authentication & Authorization
- `UNAUTHORIZED` (401) - User not authenticated
- `FORBIDDEN` (403) - User not authorized
- `SESSION_EXPIRED` (401) - Session has expired
- `INVALID_CREDENTIALS` (401) - Invalid username/password

### CSRF
- `CSRF_INVALID` (403) - CSRF token is invalid
- `CSRF_MISSING` (403) - CSRF token is missing

### Validation
- `VALIDATION_ERROR` (400) - Input validation failed
- `INVALID_INPUT` (400) - Invalid input data

### Not Found
- `NOT_FOUND` (404) - Resource not found
- `RESOURCE_NOT_FOUND` (404) - Specific resource not found

### Server Errors
- `INTERNAL_ERROR` (500) - Internal server error
- `SERVICE_UNAVAILABLE` (503) - Service is down
- `DATABASE_ERROR` (500) - Database error

### Network
- `NETWORK_ERROR` (503) - Network connection failed
- `TIMEOUT` (408) - Request timed out

## Error Response Format

All API errors now follow this standardized format:

```json
{
  "status": 401,
  "code": "UNAUTHORIZED",
  "message": "Your session has expired. Please login again.",
  "timestamp": "2025-12-10T11:34:39Z",
  "details": {
    "field": "email",
    "validation": "Must be a valid email"
  },
  "requestId": "req_1234567890"
}
```

## HTTP Status Code Mapping

| Status | Use Case | Example |
|--------|----------|----------|
| 400 | Validation Error | Invalid input data |
| 401 | Unauthorized | No session or expired |
| 403 | Forbidden | CSRF invalid, no permission |
| 404 | Not Found | Resource doesn't exist |
| 408 | Timeout | Request took too long |
| 500 | Internal Error | Unhandled exception |
| 502 | Bad Gateway | Backend unreachable |
| 503 | Unavailable | Service down, retry possible |

## Retry Behavior

### Will Retry (Transient Errors)
- Network errors (TypeError with "fetch")
- 408 (Request Timeout)
- 429 (Too Many Requests)
- 500 (Internal Server Error)
- 502 (Bad Gateway)
- 503 (Service Unavailable)
- 504 (Gateway Timeout)

### Will NOT Retry (Permanent Errors)
- 400 (Bad Request)
- 401 (Unauthorized)
- 403 (Forbidden)
- 404 (Not Found)
- CSRF errors
- Validation errors

## Backoff Strategy

Retries use exponential backoff with jitter:

```
Delay = min(
  initialDelay × (backoffMultiplier ^ attempt),
  maxDelay
) + random_jitter(±10%)
```

Default config:
- initialDelayMs: 1000 (1 second)
- maxDelayMs: 10000 (10 seconds)
- backoffMultiplier: 2
- maxRetries: 3

## Migration Checklist

### Phase 1: Foundation (This PR)
- [x] Create error utilities
- [x] Create fetch-with-retry
- [x] Create root error boundary
- [ ] Update HTTP status codes in existing routes

### Phase 2: Integration
- [ ] Update API routes to use AppError
- [ ] Update context providers with error state
- [ ] Add error UI to components
- [ ] Setup toast notifications

### Phase 3: Testing
- [ ] Run unit tests
- [ ] Test error scenarios
- [ ] Test retry behavior
- [ ] User acceptance testing

## Testing Error Handling

### Unit Tests
```bash
npm test -- src/lib/__tests__/errors.test.ts
```

### Manual Testing

1. **Test Network Error:**
   - Open DevTools → Network tab
   - Throttle to "Offline"
   - Trigger API call
   - Should retry automatically

2. **Test Validation Error:**
   - Submit form with invalid data
   - Should show error message
   - Should NOT retry

3. **Test Auth Error:**
   - Login with invalid credentials
   - Should show "Invalid username or password"
   - Should redirect to login

## Monitoring & Debugging

### Enable Debug Logging
```typescript
// Add to fetchWithRetry call
const response = await fetchWithRetry(
  url,
  options,
  {
    onRetry: (attempt, error) => {
      console.debug(`[Retry ${attempt}]`, error);
    },
  }
);
```

### Check Error Response Format
```javascript
// In browser console
const response = await fetch("/api/example");
const data = await response.json();
console.log(data);
// Should have: status, code, message, timestamp
```

## Best Practices

1. **Always use AppError in routes:**
   ```typescript
   throw new AppError(ErrorCode.NOT_FOUND, "User not found", 404);
   ```

2. **Provide context in error details:**
   ```typescript
   throw new AppError(
     ErrorCode.VALIDATION_ERROR,
     "Validation failed",
     400,
     { field: "email", value: "invalid" }
   );
   ```

3. **Show user-friendly messages:**
   ```typescript
   const message = getUserFriendlyMessage(error);
   // Use this to show to users, not technical details
   ```

4. **Use correct HTTP status codes:**
   ```typescript
   // Not this:
   throw new AppError(code, message, 500);  // Wrong!
   
   // Do this:
   throw new AppError(ErrorCode.UNAUTHORIZED, message, 401);
   ```

5. **Include requestId for tracking:**
   ```typescript
   const requestId = nanoid();
   const response = createErrorResponse(error, 500, requestId);
   ```

## Troubleshooting

### Q: Errors not being caught?
A: Make sure your catch block calls `createErrorResponse()`

### Q: User sees technical error message?
A: Use `getUserFriendlyMessage()` for display messages

### Q: Request retrying too many times?
A: Check if the error is actually retryable. Non-auth errors will retry.

### Q: Status code always 500?
A: Use correct `statusCode` in AppError constructor:
```typescript
new AppError(code, message, 401)  // Not 500!
```

## Resources

- [HTTP Status Codes (RFC 9110)](https://httpwg.org/specs/rfc9110.html#status.codes)
- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/handling-errors)
- [Error Handling Best Practices](https://github.com/goldbergyoni/nodebestpractices#6-error-handling-practices)

## Next Steps

After this PR is merged:

1. Update all existing API routes to use AppError
2. Update context providers with error state
3. Add error UI to components
4. Setup toast notifications
5. Add error monitoring (Sentry, etc.)

See `/docs/action_items.md` for detailed implementation plan.

---

**Version:** 1.0  
**Last Updated:** 2025-12-10
