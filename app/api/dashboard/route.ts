import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = createServerComponentClient({ cookies })

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.redirect("/auth/login")

    const [account, transactions, investments, breakdown, contacts, bills] = await Promise.all([
        supabase.from("accounts").select("balance, currency").eq("user_id", user.id).single(),
        supabase.from("transactions")
            .select("id, type, amount, description, date, category_icon, recipient_name")
            .eq("user_id", user.id)
            .order("date", { ascending: false }).limit(5),
        supabase.from("investments")
            .select("id, total_value, gain, gain_pct")
            .eq("user_id", user.id).single(),
        supabase.from("investment_breakdown")
            .select("investment_id, class, percentage, color"),
        supabase.from("contacts")
            .select("name, initials")
            .eq("user_id", user.id).limit(3),
        supabase.from("bills")
            .select("id, title, provider, amount, due_date")
            .eq("user_id", user.id)
            .eq("status", "pending")
            .order("due_date", { ascending: true }).limit(2),
    ])

    return NextResponse.json({
        account: account.data,
        transactions: transactions.data,
        investments: investments.data,
        breakdown: breakdown.data?.filter(b => b.investment_id === investments.data?.id),
        contacts: contacts.data,
        bills: bills.data
    })
}