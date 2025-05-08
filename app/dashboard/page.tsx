"use client"

import { useEffect, useState, useRef } from "react"
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
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
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
    const carouselContentRef = useRef<HTMLDivElement>(null);
    const [carouselFullWidth, setCarouselFullWidth] = useState(false);

    useEffect(() => {
        fetch("/api/dashboard")
            .then(res => res.json())
            .then(data => {
                setData(data)
            })
    }, [])

    useEffect(() => {
        if (!data) return;
        function handleResize() {
            if (!carouselContentRef.current) return;
            const visibleContainer = carouselContentRef.current.parentElement?.parentElement;
            if (!visibleContainer) return;
            const contentWidth = carouselContentRef.current.scrollWidth;
            const visibleWidth = visibleContainer.offsetWidth;
            setCarouselFullWidth(contentWidth > visibleWidth);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [data]);

    if (!data) return <div className="p-6 text-center">Cargando...</div>

    const { account, transactions, investments, breakdown, contacts, bills } = data;

    console.log("Dashboard data:", data)

    return (
        <div className="flex min-h-screen bg-surfaces text-primarytext">
            <Sidebar />

            <main className="flex-1 p-8 space-y-8">

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
                    <div className="space-y-6">
                        <div className="rounded-xl w-full bg-surfaces self-start">
                            <div>
                                <div className="text-muted-foreground font-semibold text-xl mb-2">Saldo</div>
                                <div className="text-3xl font-bold">
                                    {account.balance.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Button className="flex items-center gap-1 rounded-full w-40 h-10 justify-center" variant="default"><ArrowDown className="w-4 h-4" /> Depositar</Button>
                                <Button className="flex items-center gap-1 rounded-full w-40 h-10 justify-center" variant="default"><ArrowRight className="w-4 h-4" /> Transferir</Button>
                                <Button className="flex items-center gap-1 rounded-full w-40 h-10 justify-center" variant="default"><Wallet className="w-4 h-4" /> Cobrar</Button>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center text-muted-foreground font-medium text-lg">
                                <span className="text-muted-foreground font-semibold text-xl mb-2">Movimientos Recientes</span>
                                <a href="#" className="text-xs text-primary flex items-center gap-1 no-underline">
                                    Ver todo <ChevronRight className="w-3 h-3" />
                                </a>
                            </div>
                            <ul className="mt-2 divide-y divide-separator pl-4">
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
                    </div>

                    <div className="space-y-6">
                        <div className="w-full shadow rounded-2xl overflow-hidden  mt-0">
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
                            <div className="bg-card p-6 rounded-b-2xl h-full flex items-center justify-between gap-6">
                                <div className="w-32 h-32 flex-shrink-0">
                                    <svg viewBox="0 0 36 36" className="w-full h-full">
                                        <circle cx="18" cy="18" r="16" fill="none" stroke="#9CA3AF" strokeWidth="2" />
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
                                                    strokeWidth="2"
                                                    strokeDasharray={dashArray}
                                                    strokeDashoffset="25"
                                                    transform={`rotate(${rotation} 18 18)`}
                                                />
                                            );
                                        })}
                                    </svg>
                                </div>
                                <div className="text-sm font-medium space-y-1 flex-1">
                                    {breakdown.map((b, i) => (
                                        <div key={i} className="flex items-center gap-3">
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
                        
                        <div className="w-full space-y-6">
                            <div>
                                <div className="text-muted-foreground font-semibold text-xl mb-2">Contactos</div>
                                <ul className="space-y-2">
                                    {contacts.map((c, i) => (
                                        <li key={i} className="flex items-center gap-2 border-b border-separator pb-2">
                                            <div className="bg-icon-muted text-xs font-medium text-primarytext rounded-full w-9 h-9 flex items-center justify-center">
                                                {c.initials}
                                            </div>
                                            <span className="text-base font-medium">{c.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="text-muted-foreground font-semibold text-lg mb-2">Pago de Servicios</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Carousel opts={{ align: "start" }} className="" style={{ width: 'calc(2.2 * 260px)', minWidth: 0 }}>
                            <CarouselContent
                                ref={carouselContentRef}
                                className={"-ml-4 overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground inline-flex"}
                                style={{ minWidth: 0, width: 'auto', maxWidth: 'none' }}
                            >
                                {bills.map((bill, i) => (
                                    <CarouselItem key={i} className="pl-4 basis-[260px] flex-shrink-0">
                                        <div className="rounded-2xl overflow-hidden shadow-sm">
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
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        <Link href="/pagos">
                            <Button className="rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0" variant="default">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}