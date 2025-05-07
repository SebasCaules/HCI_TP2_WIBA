import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    await supabase.auth.getSession() // Esto setea la cookie automáticamente si existe
    return res
}

// Solo proteger las rutas privadas (dashboard y subrutas)
export const config = {
    matcher: ["/dashboard/:path*", "/dashboard"],
}