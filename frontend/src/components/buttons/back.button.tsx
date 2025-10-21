import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"

export default function BackButton() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 font-medium text-sm hover:text-gray-900 transition-colors cursor-pointer"
        >
            <ArrowLeftIcon className="w-5 h-5" />
            Voltar
        </button>
    )
}
