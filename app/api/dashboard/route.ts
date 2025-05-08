import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = createServerComponentClient({ cookies });

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 });
        }

        const [
            profile,
            account,
            transactions,
            investmentsData,
            ,
            contacts,
            bills,
        ] = await Promise.all([
            supabase.from("users")
                .select("first_name, last_name")
                .eq("id", user.id)
                .maybeSingle(),

            supabase.from("accounts")
                .select("balance, currency")
                .eq("user_id", user.id)
                .maybeSingle(),

            supabase.from("transactions")
                .select("id, type, amount, description, date, recipient_name")
                .eq("user_id", user.id)
                .order("date", { ascending: false })
                .limit(5),

            supabase.from("investments")
                .select("id, total_value, gain")
                .eq("user_id", user.id),

            // Placeholder for investment_breakdown, will fetch later after investmentsArray is defined
            null,

            supabase.from("contacts")
                .select("name, initials")
                .eq("user_id", user.id),

            supabase.from("bills")
                .select("id, title, provider, amount, due_date")
                .eq("user_id", user.id)
                .eq("status", "pending")
                .order("due_date", { ascending: true })
                .limit(3),
        ]);

        const investmentsArray: { id: string; total_value: number; gain: number }[] = investmentsData.data ?? [];

        const breakdownData = await supabase.from("investment_breakdown")
            .select("investment_id, class, percentage, color")
            .in("investment_id", investmentsArray.map(inv => inv.id));

        // Agregamos los valores de todas las inversiones
        const investmentTotal: {
            total_value: number;
            gain: number;
            gain_pct?: number;
        } = investmentsArray.reduce(
            (acc, inv) => {
                acc.total_value += inv.total_value;
                acc.gain += inv.gain;
                return acc;
            },
            { total_value: 0, gain: 0 }
        );
        investmentTotal.gain_pct =
            investmentTotal.total_value > 0
                ? (investmentTotal.gain / (investmentTotal.total_value - investmentTotal.gain)) * 100
                : 0;

        // Solo devolvemos los breakdowns que correspondan a esas inversiones
        const breakdown = (breakdownData?.data ?? []).filter(b =>
            investmentsArray.some(inv => inv.id === b.investment_id)
        );

        return NextResponse.json({
            user: {
                first_name: profile?.data?.first_name || "Nombre",
                last_name: profile?.data?.last_name || "Apellido",
            },
            account: account?.data ?? { balance: 0, currency: "ARS" },
            transactions: transactions?.data ?? [],
            investments: investmentTotal,
            breakdown,
            contacts: contacts?.data ?? [],
            bills: bills?.data ?? [],
        });
    } catch (error) {
        console.error("Error en GET /api/dashboard:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}