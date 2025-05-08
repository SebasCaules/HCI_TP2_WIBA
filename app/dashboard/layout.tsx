import type { ReactNode } from "react"
import { Sidebar } from "@/components/shared/sidebar";
import Topbar from "@/components/shared/topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <main>
            <Topbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </main>
    )
}