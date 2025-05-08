

'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function LogoutButton() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const handleLogout = async () => {
        const res = await fetch('/api/profile/auth/logout', { method: 'POST' })
        const data = await res.json()

        if (data.success) {
            startTransition(() => {
                router.push('/profile/auth/login')
            })
        }
    }

    return (
        <Button
            onClick={handleLogout}
            className="primary-btn"
            disabled={isPending}
        >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
        </Button>
    )
}