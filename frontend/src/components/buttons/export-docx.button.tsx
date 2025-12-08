"use client"

import { useState } from "react"
import { generateDocx } from "@/app/(main)/projects/[id]/utils/docx-generator"
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid"
import toast from "react-hot-toast"
import { getProjectOverviewById } from "@/services/projects.service"

type Props = {
    projectData: Record<string, string>
    projectId: string
    theme: string
}

export const ExportDocxButton = ({ projectData, projectId, theme }: Props) => {
    const [loading, setLoading] = useState(false)

    const handleExport = async () => {
        try {
            setLoading(true)

            const overviewData = await getProjectOverviewById(projectId)

            if (!overviewData) throw new Error("Dados do projeto não encontrados")

            const cleanFileName = theme
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "_")
                .slice(0, 50)
                .concat(".docx")

            await generateDocx(overviewData, projectData, cleanFileName)
        } catch {
            toast.error("Erro ao exportar DOCX")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 text-gray-600 font-medium text-sm hover:text-gray-900 transition-colors cursor-pointer"
        >
            <ArrowDownTrayIcon className="w-5 h-5" />
            {loading ? "Gerando..." : "Exportar"}
        </button>
    )
}
