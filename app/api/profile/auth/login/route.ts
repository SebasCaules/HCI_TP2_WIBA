import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await req.json()
    const { email, password } = body

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 401 })
    }

    // Guardar nombre de usuario en cookie (si está disponible)
    const user = data.user
    const response = NextResponse.json({ success: true })

    if (user) {
        const name = user.user_metadata.name
        response.cookies.set("user_name", encodeURIComponent(name), {
            path: "/",
            httpOnly: false, // accesible desde el cliente
        })

        const id = user.id
        response.cookies.set("user_id", id, {
            path: "/",
            httpOnly: false, // accesible desde el cliente
        })
    }
    console.log("Usuario completo:", user)

    return response
}