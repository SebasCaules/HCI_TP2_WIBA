

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("users")
    .select("first_name, last_name")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  return NextResponse.json({
    name: `${profile.first_name} ${profile.last_name}`,
  })
}