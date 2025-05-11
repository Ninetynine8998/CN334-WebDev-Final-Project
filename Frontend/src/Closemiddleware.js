// middleware.ts (ใน root project)
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request) {
    // const token = request.cookies.get("jwt")?.value
    const token = localStorage.getItem("token");

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/','/home', '/dashboard'], // ใช้ middleware แค่บาง route
}
