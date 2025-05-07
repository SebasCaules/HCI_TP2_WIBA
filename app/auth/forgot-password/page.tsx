'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        const res = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
            setErrorMsg(data.error || 'Error al enviar el email');
        } else {
            setSuccessMsg('Email de recuperación enviado. Revisá tu casilla.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6 space-y-6">
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-bold" style={{ color: 'var(--primary)' }}>WIBA</h1>
                    <p className="text-sm text-[--secondarytext]">Virtual Wallet Application</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nombre@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white placeholder-[--secondarytext]"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pr-10"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer">
                                👁️
                            </span>
                        </div>
                    </div>

                    {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
                    {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

                    <Button
                        type="submit"
                        className="w-full bg-[--primary] hover:bg-opacity-90 text-white"
                        disabled={loading}
                    >
                        {loading ? 'Enviando...' : 'Enviar link de recuperación'}
                    </Button>
                    <p className="text-center text-sm text-[--secondarytext]">
                        ¿No tienes una cuenta? <a href="/register" className="text-[--primary] font-medium">Regístrate</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
