// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const { email, password, name, lastName } = await req.json();
    const supabase = await createClient();

    // 1. Crear usuario en auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                lastName,
            },
        },
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const user = data.user;

    if (user) {
        // 2. Insertar en tabla users (user_number se autogenera por trigger)
        const { error: insertError } = await supabase.from("users").insert({
            id: user.id,
            first_name: name,
            last_name: lastName,
        });

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        // 3. Insertar en accounts (account_number se autogenera por trigger)
        const { error: accountError } = await supabase.from("accounts").insert({
            user_id: user.id,
        });

        if (accountError) {
            return NextResponse.json({ error: accountError.message }, { status: 500 });
        }

        // 4. Obtener datos generados
        const { data: userData } = await supabase
            .from("users")
            .select("user_number")
            .eq("id", user.id)
            .single();

        const { data: accountData } = await supabase
            .from("accounts")
            .select("account_number")
            .eq("user_id", user.id)
            .single();

        return NextResponse.json({
            message: "User registered",
            user_number: userData?.user_number,
            account_number: accountData?.account_number,
        });
    }

    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
}