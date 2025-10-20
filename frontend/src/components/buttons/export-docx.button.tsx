"use client"

import { useState } from "react"
import { generateDocx } from "@/app/(main)/projetos/[id]/utils/docx-generator"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
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

            if (!overviewData) throw new Error("Project overview not found")

            const cleanFileName = theme
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "_")
                .slice(0, 50)
                .concat(".docx")

            await generateDocx(overviewData, projectData, cleanFileName)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao exportar DOCX")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            disabled={loading}
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
            {loading ? "Gerando..." : "Exportar DOCX"}
        </button>
    )
}
