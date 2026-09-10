# Agent Authentication Guide (AUTH.md)

> Specification compliance: [WorkOS auth.md specification](https://github.com/workos/auth.md) and RFC 9728 / RFC 8414 OAuth 2.0 metadata standards.

This document describes how autonomous AI agents, LLM tool-calling clients, and automated integrations authenticate and interact with the NICHSEDGE API and data services.

## 1. Discover

Agents can discover authorization endpoints and resource metadata from the following well-known locations:

- **OAuth Protected Resource Metadata (RFC 9728)**: `https://nichsedge.github.io/.well-known/oauth-protected-resource`
- **OAuth Authorization Server Metadata (RFC 8414)**: `https://nichsedge.github.io/.well-known/oauth-authorization-server`
- **Agentic Resource Discovery (ARD)**: `https://nichsedge.github.io/.well-known/ard.json`
- **API Catalog (RFC 9727)**: `https://nichsedge.github.io/.well-known/api-catalog`
- **OpenAPI 3.1 Specification**: `https://nichsedge.github.io/openapi.json`

The authorization server metadata includes the `agent_auth` discovery block declaring support for `identity_endpoint`, `claim_endpoint`, and `events_endpoint`.

When unauthenticated agents access protected routes without credentials, the service returns HTTP 401 with a `WWW-Authenticate` header pointing directly to the protected resource metadata:
```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://nichsedge.github.io/.well-known/oauth-protected-resource"
Content-Type: application/json

{"error": {"code": "unauthorized", "message": "Authentication required. See WWW-Authenticate header."}}
```

## 2. Pick a Method

The NICHSEDGE platform supports three agent authentication patterns under `agent_auth`:

1. **Anonymous / Public Read (`anonymous`)**:
   - For all read-only portfolio queries, skill evaluations, project dossiers, and resume data.
   - No token required; requests succeed immediately against public endpoints.
2. **Identity Assertion (`identity_assertion`)**:
   - For autonomous agents presenting cryptographically signed assertions such as `id-jag` (`urn:ietf:params:oauth:token-type:id-jag`).
3. **Service Auth (`service_auth`)**:
   - For trusted server-to-server agents using pre-shared API bearer keys or mutual TLS / RFC 9421 HTTP Message Signatures.

## 3. Register

Autonomous agents register dynamically by submitting their agent identity or key assertion to the `identity_endpoint`:
- Endpoint: `https://nichsedge.github.io/api/v1/auth/identity`
- Supported assertion types: `urn:ietf:params:oauth:token-type:id-jag`

Request example:
```json
{
  "client_name": "MyAutonomousAgent",
  "assertion_type": "urn:ietf:params:oauth:token-type:id-jag",
  "redirect_uris": ["https://agent.example.com/callback"]
}
```

## 4. Claim

Agents claim authorization scopes on behalf of a human principal or automated workflow via the `claim_endpoint`:
- Endpoint: `https://nichsedge.github.io/api/v1/auth/claim`
- Supported scopes: `portfolio:read`, `projects:read`, `skills:read`, `contact:read`

The response includes a claim verification token or confirmation nonce.

## 5. Exchange

Exchange your authorization grant or assertion for an `access_token` at the token endpoint:
- Endpoint: `https://nichsedge.github.io/api/v1/auth/token`
- Grant type: `urn:ietf:params:oauth:grant-type:token-exchange` or `client_credentials`

Request example:
```http
POST /api/v1/auth/token HTTP/1.1
Host: nichsedge.github.io
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&scope=portfolio:read
```

Response example:
```json
{
  "access_token": "nichsedge_sec_token_demo",
  "token_type": "Bearer",
  "expires_in": 86400,
  "scope": "portfolio:read projects:read skills:read"
}
```

## 6. Use the access_token

Pass the minted access token in the `Authorization` request header:
```http
GET /api/v1/profile HTTP/1.1
Host: nichsedge.github.io
Authorization: Bearer <access_token>
Accept: application/json
```

For public data endpoints, requests without tokens will default to anonymous read mode.

## 7. Errors

All error responses strictly follow RFC 7807 (Problem Details for HTTP APIs):
- `400 Bad Request`: `{ "type": "https://nichsedge.github.io/docs/errors#bad-request", "title": "Bad Request", "status": 400, "detail": "Invalid parameters supplied." }`
- `401 Unauthorized`: Returned with `WWW-Authenticate` header describing authentication parameters.
- `403 Forbidden`: Scope insufficient for the requested action.
- `404 Not Found`: Target resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded.

## 8. Revocation

Tokens may be revoked by issuing an HTTP POST to:
- Endpoint: `https://nichsedge.github.io/api/v1/auth/revoke`
```http
POST /api/v1/auth/revoke HTTP/1.1
Host: nichsedge.github.io
Content-Type: application/x-www-form-urlencoded

token=<access_token>&token_type_hint=access_token
```
Upon revocation, active sessions are invalidated immediately.
