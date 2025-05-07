import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

interface EmailInputProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string
}

export default function EmailInput({ value, onChange, error }: EmailInputProps) {
    const [localError, setLocalError] = useState("")

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (value.length > 0 && !emailRegex.test(value)) {
            setLocalError("Ingresá un email válido.")
        } else {
            setLocalError("")
        }
    }, [value])

    return (
        <div className="mb-4">

            <Label htmlFor="email" className="block text-sm font-medium text-label mb-1">
                Email
            </Label>
            <Input
                id="email"
                type="email"
                value={value}
                onChange={onChange}
                placeholder="nombre@ejemplo.com"
                className={`w-full border border-input-border focus:outline-1 focus:ring-1 focus:ring-primary ${localError ? "border-error-text" : ""}`}
                autoComplete="email"
            />
            {(error || localError) && (
                <p className="mt-1 text-sm text-error-text">{error || localError}</p>
            )}
        </div>
    )
}
