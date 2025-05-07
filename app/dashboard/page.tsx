"use client"

import { useEffect, useState } from "react"
import {
    ArrowDown,
    ArrowRight,
    Wallet,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/shared/sidebar"
import Link from "next/link"
interface DashboardData {
    user: { first_name: string; last_name: string }
    account: { balance: number; currency: string }
    transactions: { description: string; amount: number; date: string; type: string }[]
    investments: { total_value: number; gain: number; gain_pct: number }
    breakdown: { class: string; percentage: number; color: string }[]
    contacts: { name: string; initials: string }[]
    bills: { title: string; provider: string; amount: number; due_date: string }[]
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null)

    useEffect(() => {
        fetch("/api/dashboard")
            .then(res => res.json())
            .then(data => {
                setData(data)
            })
    }, [])

    if (!data) return <div className="p-6 text-center">Cargando...</div>

    const { account, transactions, investments, breakdown, contacts, bills } = data;
    console.log("Dashboard data:", data)

    return (
        <div className="flex min-h-screen bg-surfaces text-primarytext">
            <Sidebar />

            <main className="flex-1 p-8 space-y-8">

                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="rounded-2xl p-6 shadow flex-1 mb-4 lg:mb-0">
                        <div>
                            <div className="text-muted-foreground text-lg font-medium">Saldo</div>
                            <div className="text-3xl font-bold">
                                {account.balance.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                            <Button className="flex items-center gap-1 rounded-full" variant="default"><ArrowDown className="w-4 h-4" /> Depositar</Button>
                            <Button className="flex items-center gap-1 rounded-full" variant="default"><ArrowRight className="w-4 h-4" /> Transferir</Button>
                            <Button className="flex items-center gap-1 rounded-full" variant="default"><Wallet className="w-4 h-4" /> Cobrar</Button>
                        </div>
                    </div>
                    <div className="w-full lg:w-80 shadow rounded-2xl overflow-hidden">
                        <div className="bg-primary text-white px-4 py-2 rounded-t-2xl space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-primarytext text-lg">Inversiones</span>
                                <a href="#" className="text-xs flex items-center gap-1 hover:text-white/80 no-underline">
                                    Ver más <ChevronRight className="w-3 h-3" />
                                </a>
                            </div>
                            <div className="flex justify-between items-end gap-2">
                                <div className="text-2xl font-bold">{investments.total_value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</div>
                                <div className="text-sm text-success">
                                    + {investments.gain.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })} ({investments.gain_pct.toFixed(2)}%)
                                </div>
                            </div>
                        </div>
                        <div className="bg-card p-4 space-y-3 rounded-b-2xl">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 relative">
                                    <svg viewBox="0 0 36 36" className="w-full h-full">
                                        <circle cx="18" cy="18" r="16" fill="none" stroke="#9CA3AF" strokeWidth="4" />
                                        {breakdown.length > 0 && breakdown.map((b, i, arr) => {
                                            const prevPercent = arr.slice(0, i).reduce((sum, x) => sum + x.percentage, 0);
                                            const dashArray = `${(b.percentage / 100) * 100} ${(100 - (b.percentage / 100) * 100)}`;
                                            const rotation = (prevPercent / 100) * 360;
                                            return (
                                                <circle
                                                    key={i}
                                                    cx="18"
                                                    cy="18"
                                                    r="16"
                                                    fill="none"
                                                    stroke={`var(--chart-${(i % 5) + 1})`}
                                                    strokeWidth="4"
                                                    strokeDasharray={dashArray}
                                                    strokeDashoffset="25"
                                                    transform={`rotate(${rotation} 18 18)`}
                                                />
                                            );
                                        })}
                                    </svg>
                                </div>
                                <div className="text-xs space-y-1">
                                    {breakdown.map((b, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: `var(--chart-${(i % 5) + 1})` }}
                                            />
                                            {b.percentage.toFixed(2)}% - {b.class}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">
                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="flex justify-between items-center text-muted-foreground font-medium text-lg">
                                <span>Movimientos Recientes</span>
                                <a href="#" className="text-xs text-primary flex items-center gap-1 no-underline">
                                    Ver todo <ChevronRight className="w-3 h-3" />
                                </a>
                            </div>
                            <ul className="mt-2 divide-y divide-separator">
                                {transactions.map((tx, i) => (
                                    <li key={i} className="py-2 flex justify-between">
                                        <div className="flex gap-2 items-start">
                                            <div className="w-5">
                                                {tx.type === "deposit" && <ArrowDownRight className="w-4 h-4 mt-1 text-primary" />}
                                                {tx.type === "transfer" && <ArrowUpRight className="w-4 h-4 mt-1 text-primary" />}
                                                {tx.type === "withdraw" && <Banknote className="w-4 h-4 mt-1 text-primary" />}
                                            </div>
                                            <div>
                                                <div className="font-semibold">{tx.description}</div>
                                                <div className="text-xs text-secondarytext">{new Date(tx.date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className={`font-medium ${tx.amount < 0 ? "text-error" : "text-success"}`}>
                                            {tx.amount < 0 ? "- " : "+ "}{Math.abs(tx.amount).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="text-muted-foreground font-semibold text-lg mb-2">Pago de Servicios</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {bills.map((bill, i) => (
                                    <div key={i} className="rounded-2xl overflow-hidden shadow-sm w-fit min-w-[250px]">
                                        <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold">{bill.title}</div>
                                                <div className="text-xs">{bill.provider}</div>
                                            </div>
                                            <a href="#" className="text-sm font-medium hover:text-white/80">Pagar</a>
                                        </div>
                                        <div className="bg-card text-primarytext px-4 py-3 space-y-1">
                                            <div className="text-lg font-bold">{bill.amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</div>
                                            <div className="text-xs text-secondarytext">{new Date(bill.due_date).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                ))}
                                <Link href="/pagos">
                                    <Button className="rounded-full w-10 h-10 mt-14 mx-auto flex items-center justify-center" variant="default">
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="w-80 space-y-6">
                        <div>
                            <div className="text-muted-foreground font-medium text-lg mb-2">Contactos</div>
                            <ul className="space-y-2">
                                {contacts.map((c, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <div className="bg-separator text-sm rounded-full w-8 h-8 flex items-center justify-center">
                                            {c.initials}
                                        </div>
                                        {c.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}