

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const supabase = createServerComponentClient({ cookies })

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
            return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 })
        }

        const [profile, accounts] = await Promise.all([
            supabase.from("users")
                .select("*")
                .eq("id", user.id)
                .maybeSingle(),

            supabase.from("accounts")
                .select("balance, currency, updated_at, account_number")
                .eq("user_id", user.id),
        ])

        return NextResponse.json({
            email: user.email,
            created_at: user.created_at,
            profile: profile?.data ?? {},
            accounts: {
                count: accounts.data?.length ?? 0,
                list: accounts.data ?? [],
            },
        })
    } catch (err) {
        console.error("Error en GET /api/profile:", err)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}