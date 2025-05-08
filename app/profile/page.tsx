'use server'

import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, Calendar, CreditCard, User, Home } from "lucide-react"
import LogoutButton from '@/components/shared/LogoutButton'

export default async function ProfilePage() {
    const res = await fetch('http://localhost:3000/api/profile', {
        headers: {
            cookie: cookies().toString()
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="bg-card p-8 rounded-md shadow-md w-full max-w-md text-center">
                    <h1 className="text-2xl font-semibold text-primarytext mb-4">No hay usuario autenticado</h1>
                    <p className="text-secondarytext">Por favor, inicia sesión para ver tu perfil.</p>
                </div>
            </div>
        )
    }

    const { email, created_at, profile, accounts } = await res.json()

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-card p-8 rounded-md shadow-md w-full max-w-md">
                <h1 className="text-3xl font-semibold text-primarytext mb-6 text-center">Perfil de Usuario</h1>

                <div className="mb-4">
                    <h2 className="font-semibold text-primarytext mb-1 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nombre y apellido
                    </h2>
                    <p className="text-secondarytext">
                        {profile?.first_name} {profile?.last_name}
                    </p>
                </div>

                <div className="mb-4 border-b border-separator pb-4">
                    <h2 className="font-semibold text-primarytext mb-1 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                    </h2>
                    <p className="text-secondarytext">{email}</p>
                </div>

                <div className="mb-4 border-b border-separator pb-4">
                    <h2 className="font-semibold text-primarytext mb-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Fecha de creación de la cuenta
                    </h2>
                    <p className="text-secondarytext">
                        {new Date(created_at).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>

                <div>
                    <h2 className="font-semibold text-primarytext mb-1 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Número(s) de cuenta
                    </h2>
                    {Array.isArray(accounts?.list) && accounts.list.length > 0 ? (
                        <ul className="text-secondarytext list-disc list-inside">
                            {accounts.list.map((account: any) => (
                                <li key={account.account_number}>{account.account_number}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-secondarytext">-</p>
                    )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
                    <LogoutButton />
                    <Button asChild className="primary-btn w-full sm:w-auto flex items-center gap-2">
                        <Link href="/dashboard">
                            <Home className="w-4 h-4" />
                            Ir al inicio
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}