// app/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background-muted flex items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-text-default">
          Bienvenido a WIBA
        </h1>
        <p className="text-lg text-text-subtle">
          Tu billetera virtual para ahorrar, invertir y transferir fácil.
        </p>

        <Link href="/auth">
          <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
            Iniciar sesión / Registrarse
          </Button>
        </Link>
      </div>
    </main>
  )
}