"use client"

import { generateDocx } from "@/app/(main)/projetos/[id]/utils/docx-generator"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"

type Props = {
    projectData: Record<string, string>
}

export const ExportDocxButton = ({ projectData }: Props) => {
    const handleExport = async () => {
        await generateDocx(projectData)
    }

    return (
        <button
            onClick={handleExport}
            className="
                flex items-center gap-2
                text-gray-800 font-semibold text-sm
                px-4 py-2
                border border-transparent
                rounded-lg
                transition-all duration-300
                hover:border-gray-300
                hover:shadow-md
                hover:text-gray-900
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
            "
        >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Exportar DOCX
        </button>
    )
}
