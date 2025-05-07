import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"

interface PasswordInputProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    showPassword: boolean
    setShowPassword: (v: boolean) => void
}

export default function PasswordInput({
    value,
    onChange,
    showPassword,
    setShowPassword
}: PasswordInputProps) {
    const [errors, setErrors] = useState<string[]>([])

    useEffect(() => {
        const newErrors: string[] = []
        if (value.length > 0 && value.length < 6) newErrors.push("Al menos 6 caracteres")
        if (value.length > 0 && !/[A-Z]/.test(value)) newErrors.push("Una letra mayúscula")
        if (value.length > 0 && !/\d/.test(value)) newErrors.push("Un número")
        setErrors(newErrors)
    }, [value])

    return (
        <div className="mb-6">
            <Label htmlFor="password" className="block text-sm font-medium text-label mb-1">
                Contraseña
            </Label>
            <div className="relative">
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full rounded-md border border-input-border focus:outline-none focus:ring-1 focus:ring-primary pr-10 ${
                        errors.length > 0 ? "border-error-text" : ""
                    }`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 w-10 flex items-center justify-center cursor-pointer hover:bg-icon-muted/10 rounded"
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-icon-muted" />
                    ) : (
                        <Eye className="h-5 w-5 text-icon-muted" />
                    )}
                </button>
            </div>
            {errors.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-error-text space-y-1">
                    {errors.map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}
