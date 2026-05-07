import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const maintenanceMode = false

  if (maintenanceMode) {
    return NextResponse.redirect(
      new URL('/maintenance', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!maintenance).*)'],
}
