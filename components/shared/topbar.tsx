"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"
import supabase from "@/lib/supabase/client"

export default function Topbar() {
    const [username, setUsername] = useState("")

    useEffect(() => {
        const getUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // Podés obtener más datos del perfil si usás una tabla `profiles`
                setUsername(user.user_metadata?.full_name || user.email)
            }
        }

        getUserData()
    }, [])

    return (
        <header className="h-16 border-b px-6 flex items-center justify-end bg-white">
            <div className="flex items-center gap-2 text-sm text-text-subtle">
                <User className="w-4 h-4" />
                <span>{username}</span>
            </div>
        </header>
    )
}