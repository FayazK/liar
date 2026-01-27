# API Documentation

This directory contains the OpenAPI specification for the Liar API v1.

## Files

- `openapi.json` - OpenAPI 3.0 specification with all API endpoints, schemas, and examples

## Viewing the Documentation

You can view and interact with this API documentation using several tools:

### 1. Swagger UI (Online)
Visit [Swagger Editor](https://editor.swagger.io/) and import the `openapi.json` file.

### 2. Swagger UI (Local)
```bash
npx @redocly/cli preview-docs docs/api/openapi.json
```

### 3. Redoc (Alternative viewer)
```bash
npx @redocly/cli build-docs docs/api/openapi.json -o docs/api/index.html
```

### 4. VS Code Extension
Install the "OpenAPI (Swagger) Editor" extension and open `openapi.json`.

## API Overview

**Base URL:** `http://liar.test/api/v1` (local) or `https://api.liar.app/v1` (production)

**Authentication:** Bearer token (Laravel Sanctum)

**Response Format:** JSON:API compliant

**Rate Limit:** 60 requests per minute per token/IP

## Quick Start

### 1. Register or Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "info@fayazk.com",
  "password": "@Password1"
}
```

### 2. Use the Token
```bash
GET /api/v1/auth/user
Authorization: Bearer {your-token}
```

### 3. Make Requests
All authenticated endpoints require the `Authorization: Bearer {token}` header.

## Available Endpoints

### Authentication
- `POST /auth/login` - Login with credentials
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Revoke all tokens
- `POST /auth/refresh` - Refresh access token
- `GET /auth/user` - Get authenticated user
- `POST /auth/password/forgot` - Send password reset link
- `POST /auth/password/reset` - Reset password

### Users
- `GET /users` - List users (paginated)
- `POST /users` - Create user
- `GET /users/{id}` - Get user by ID
- `PATCH /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Roles
- `GET /roles` - List roles (paginated)
- `GET /roles/{id}` - Get role by ID

## Response Examples

### Success Response
```json
{
  "data": {
    "id": 1,
    "name": "John Doe"
  },
  "message": "Operation successful"
}
```

### Error Response (JSON:API)
```json
{
  "errors": [
    {
      "status": "422",
      "title": "Validation Error",
      "detail": "The email field is required.",
      "source": {
        "pointer": "/data/attributes/email"
      }
    }
  ]
}
```

## Testing with cURL

### Login Example
```bash
curl -X POST http://liar.test/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "info@fayazk.com",
    "password": "@Password1"
  }'
```

### Authenticated Request Example
```bash
curl -X GET http://liar.test/api/v1/users \
  -H "Authorization: Bearer 1|abc123..." \
  -H "Accept: application/json"
```

## Updating the Specification

When adding new endpoints or modifying existing ones:

1. Update the `openapi.json` file
2. Follow the existing schema patterns
3. Include request/response examples
4. Document all parameters and required fields
5. Update error responses if needed
6. Test the specification with a validator

## Validation

Validate the OpenAPI specification:

```bash
npx @redocly/cli lint docs/api/openapi.json
```

## Notes

- All dates are in ISO 8601 format (e.g., `2026-01-26T18:00:00Z`)
- Token permissions inherit from user's role at creation time
- Tokens never expire by default (configurable via `config/api.php`)
- CORS is configured for cross-origin requests
- Rate limiting applies to all endpoints
