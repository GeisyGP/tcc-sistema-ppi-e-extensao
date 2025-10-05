import { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary"
    children: ReactNode
}

export function Button({
    variant = "primary",
    className = "",
    "aria-disabled": ariaDisabled,
    children,
    ...props
}: ButtonProps) {
    const base =
        "px-4 py-2 rounded-lg text-mg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
    const styles = {
        primary: "bg-green-700 text-white hover:bg-green-900 disabled:bg-green-200 disabled:cursor-not-allowed",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed",
    }

    const isDisabled = ariaDisabled === true

    return (
        <button
            className={`${base} ${styles[variant]} ${className}`}
            disabled={isDisabled}
            aria-disabled={ariaDisabled}
            {...props}
        >
            {children}
        </button>
    )
}
