---
name: "JWT strategy fails in middleware"
about: Report issues with JWT session handling
title: "JWT strategy fails in middleware while DB strategy works"
labels: bug
---

### Description
When using JWT strategy, /api/auth/session returns a valid payload, but middleware always sees `null` and redirects to /auth/sign-in. DB strategy works as expected.

### Steps to Reproduce
1. Configure session strategy = "jwt"
2. Sign in
3. JWT issued with payload:
   {
     "sub": "...",
     "email": "kelly@gmail.com",
     "role": "user",
     "iat": 1763562012,
     "exp": 1763648412
   }
4. Navigate to /protected
5. Middleware logs `Token in middleware: null`

### Expected Behavior
Middleware should decode JWT and allow access to protected routes.

### Actual Behavior
JWT session returns null in middleware.

### Code Snippets
```ts
export async function handlePrivateRoutes(request: NextRequest) {
  const token = await getToken(request);
  console.log("Token in middleware:", token);
  const session = normalizeSession(token?.session);
  if (!session) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }
}
```