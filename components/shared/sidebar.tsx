'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CreditCard, LineChart, List } from "lucide-react"
import clsx from "clsx"

const navItems = [
    { href: "/dashboard", label: "Inicio", icon: Home },
    { href: "/dashboard/transacciones", label: "Transacciones", icon: List },
    { href: "/dashboard/tarjetas", label: "Tarjetas", icon: CreditCard },
    { href: "/dashboard/inversiones", label: "Inversiones", icon: LineChart },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen border-r px-6 py-8 bg-white flex flex-col justify-between">
            <div>
                <h1 className="text-2xl font-bold text-primary mb-8">WIBA</h1>
                <nav className="flex flex-col gap-4">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "flex items-center gap-3 text-sm font-medium",
                                pathname === href ? "text-primary" : "text-gray-600"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    )
}