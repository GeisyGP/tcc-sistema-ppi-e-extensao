"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "@heroicons/react/24/solid"

export default function BackButton() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
            <ArrowLeftIcon className="w-5 h-5" />
            Voltar
        </button>
    )
}
