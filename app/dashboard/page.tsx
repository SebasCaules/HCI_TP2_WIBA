import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowDown, ArrowRight, Wallet } from "lucide-react"

export default async function DashboardPage() {
    const supabase = createServerComponentClient({ cookies })
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return redirect("/auth/login")
    }

    const { data: dashboard } = await supabase.functions.invoke("dashboard", {
        method: "GET",
    })

    if (
        !dashboard ||
        !dashboard.account ||
        !dashboard.transactions ||
        !dashboard.investments ||
        !dashboard.breakdown ||
        !dashboard.contacts ||
        !dashboard.bills
    ) {
        return <p className="p-6">Error al cargar datos.</p>
    }

    const transactions = dashboard.transactions as any[]
    const breakdown = dashboard.breakdown as any[]
    const contacts = dashboard.contacts as any[]
    const bills = dashboard.bills as any[]

    return (
        <div className="grid grid-cols-12 gap-6 p-6">
            <div className="col-span-8">
                <h2 className="text-muted-foreground font-medium text-lg mb-1">Saldo</h2>
                <div className="text-4xl font-bold mb-4">${dashboard.account.balance.toFixed(2)}</div>

                <div className="flex gap-4 mb-8">
                    <Button variant="default" className="bg-primary text-white"><ArrowDown className="mr-2 h-4 w-4" /> Depositar</Button>
                    <Button variant="default" className="bg-primary text-white"><ArrowRight className="mr-2 h-4 w-4" /> Transferir</Button>
                    <Button variant="default" className="bg-primary text-white"><Wallet className="mr-2 h-4 w-4" /> Cobrar</Button>
                </div>

                <h3 className="font-semibold text-lg text-primarytext mb-3">Movimientos Recientes</h3>
                <div className="space-y-3">
                    {transactions.map(tx => (
                        <div key={tx.id} className="flex justify-between text-sm border-b pb-2">
                            <div>
                                <div className="font-semibold">{tx.description}</div>
                                <div className="text-secondarytext">{new Date(tx.date).toLocaleDateString()}</div>
                            </div>
                            <div className="font-medium text-right">
                                {tx.amount >= 0 ? (
                                    <span className="text-success">+${tx.amount.toFixed(2)}</span>
                                ) : (
                                    <span className="text-error">-${Math.abs(tx.amount).toFixed(2)}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-span-4 space-y-6">
                <Card className="p-4">
                    <div className="text-sm font-semibold text-primarytext mb-2">Inversiones</div>
                    <div className="text-2xl font-bold mb-1">${dashboard.investments.total_value.toFixed(2)}</div>
                    <div className="text-success text-sm">+{dashboard.investments.gain.toFixed(2)} ({dashboard.investments.gain_pct.toFixed(2)}%)</div>
                    <div className="mt-4 space-y-1">
                        {breakdown.map((b, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                                    {b.class}
                                </span>
                                <span>{b.percentage.toFixed(2)}%</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-4">
                    <div className="text-sm font-semibold text-primarytext mb-3">Contactos</div>
                    {contacts.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-sm border-b py-2">
                            <span>{c.name}</span>
                            <span className="rounded-full bg-muted text-muted-foreground px-2 py-1 text-xs font-semibold">{c.initials}</span>
                        </div>
                    ))}
                </Card>

                <Card className="p-4">
                    <div className="text-sm font-semibold text-primarytext mb-3">Pago de Servicios</div>
                    {bills.map(bill => (
                        <div key={bill.id} className="mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{bill.title}</span>
                                <Button size="sm" variant="ghost" className="text-primary">Pagar</Button>
                            </div>
                            <div className="text-xs text-secondarytext">{bill.provider}</div>
                            <div className="text-md font-bold mt-1">${bill.amount.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">{new Date(bill.due_date).toLocaleDateString()}</div>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    )
}