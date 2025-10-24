import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookieOptions, sessionCookieName } from "database/src/cookie"

export async function proxy(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    const response = NextResponse.next()
    const token = request.cookies.get(sessionCookieName)?.value ?? null
    if (token !== null) {
      // Only extend cookie expiration on GET requests since we can be sure
      // a new session wasn't set when handling the request.
      response.cookies.set(sessionCookieName, token, getSessionCookieOptions())
    }
    return response
  }

  // CSRF protection
  const originHeader = request.headers.get("Origin")
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.get("Host")
  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, { status: 403 })
  }
  let origin: URL
  try {
    origin = new URL(originHeader)
  } catch {
    return new NextResponse(null, { status: 403 })
  }
  if (origin.host !== hostHeader) {
    return new NextResponse(null, { status: 403 })
  }
  return NextResponse.next()
}
