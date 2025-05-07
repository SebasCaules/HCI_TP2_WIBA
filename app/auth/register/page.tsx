'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import EmailInput from '@/components/shared/EmailInput'
import PasswordInput from '@/components/shared/PasswordInput'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'

export default function RegisterPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const [nombreError, setNombreError] = useState('')
    const [apellidoError, setApellidoError] = useState('')

    const [loading, setLoading] = useState(false)

    const validateForm = () => {
        let valid = true

        setNombreError('')
        setApellidoError('')

        if (nombre.trim().length === 0) {
            setNombreError('El nombre es obligatorio.')
            valid = false
        }

        if (apellido.trim().length === 0) {
            setApellidoError('El apellido es obligatorio.')
            valid = false
        }

        return valid
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, nombre, apellido }),
        })

        setLoading(false)

        if (!res.ok) {
            // Error handling removed as generalError state was removed
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-lg p-8 bg-card rounded-lg shadow-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-primary">WIBA</CardTitle>
                    <CardDescription className="text-secondarytext">Virtual Wallet Application</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <Label htmlFor="nombre" className="block text-sm font-medium text-label mb-1">
                                Nombre
                            </Label>
                            <Input
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full rounded-md border border-input-border focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Tu nombre"
                            />
                            {nombreError && <p className="mt-1 text-sm text-error-text">{nombreError}</p>}
                        </div>

                        <div>
                            <Label htmlFor="apellido" className="block text-sm font-medium text-label mb-1">
                                Apellido
                            </Label>
                            <Input
                                id="apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                className="w-full rounded-md border border-input-border focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Tu apellido"
                            />
                            {apellidoError && <p className="mt-1 text-sm text-error-text">{apellidoError}</p>}
                        </div>

                        <EmailInput value={email} onChange={(e) => setEmail(e.target.value)} />
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />

                        <Button type="submit" className="w-full bg-primary hover:bg-hover text-white" disabled={loading}>
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-primarytext">
                        ¿Ya tenés una cuenta?{' '}
                        <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                            Iniciar sesión
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
