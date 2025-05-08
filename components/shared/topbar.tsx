"use client"

import { useEffect, useState } from "react"
import { User, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function Topbar() {
    const [username, setUsername] = useState("")

    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await fetch("/api/topbar")
                const data = await res.json()
                if (data?.name) {
                    setUsername(data.name)
                }
            } catch (err) {
                console.error("Error fetching topbar user:", err)
            }
        }

        getUserData()
    }, [])

    return (
        <header className="h-16 px-6 flex items-center justify-between bg-card border-b">
            <h1 className="text-xl font-bold text-primary">WIBA</h1>
            <Link href="/profile" className="flex items-center gap-2 text-sm text-primarytext font-medium">
                <User className="w-4 h-4" />
                <span>{username}</span>
                <ChevronRight className="w-3 h-3" />
            </Link>
        </header>
    )
}