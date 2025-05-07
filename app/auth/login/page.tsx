"use client";

import { useState } from 'react';
import EmailInput from '@/components/shared/EmailInput';
import PasswordInput from '@/components/shared/PasswordInput';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Redirección o manejo de sesión exitosa
            window.location.href = '/dashboard';
        } catch (err: any) {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">WIBA</h1>
                    <p className="text-muted-text">Virtual Wallet Application</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <EmailInput
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <PasswordInput
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 primary-btn"
                    >
                        {isLoading ? "Cargando..." : "Iniciar sesión"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-secondarytext">
                        ¿No tienes una cuenta?{" "}
                        <a href="/auth/register" className="text-primary hover:text-hover">
                            Regístrate
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}