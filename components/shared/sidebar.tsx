

"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, FileText, CreditCard, LineChart } from "lucide-react"
import clsx from "clsx"

const navItems = [
    { label: "Inicio", href: "/dashboard", icon: Home },
    { label: "Transacciones", href: "/transactions", icon: FileText },
    { label: "Tarjetas", href: "/cards", icon: CreditCard },
    { label: "Inversiones", href: "/investments", icon: LineChart },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    return (
        <aside className="w-60 p-6 border-r border-separator">
            <h1 className="text-xl font-bold text-primary mb-10">WIBA</h1>
            <nav className="space-y-2">
                {navItems.map(({ label, href, icon: Icon }) => (
                    <Button
                        key={href}
                        variant="sidebar"
                        className={clsx(
                            "w-full justify-start gap-2",
                            pathname === href && "bg-muted text-primary"
                        )}
                        onClick={() => router.push(href)}
                    >
                        <Icon className="w-4 h-4" />
                        {label}
                    </Button>
                ))}
            </nav>
        </aside>
    )
}