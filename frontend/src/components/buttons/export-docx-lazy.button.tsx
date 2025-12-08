"use client"

import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { generateDocx } from "@/app/(main)/projects/[id]/utils/docx-generator"
import { getProjectFullById, getProjectOverviewById } from "@/services/projects.service"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid"
import { Button } from "./default.button"

type Props = {
    projectId: string
    theme: string
}

export const ExportDocxLazyButton = ({ projectId, theme }: Props) => {
    const [loading, setLoading] = useState(false)

    const fetchProject = useCallback(async (projectId: string) => {
        try {
            return await getProjectFullById(projectId)
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleExport = async () => {
        try {
            setLoading(true)
            const full = await fetchProject(projectId)
            if (!full) throw new Error("Dados do projeto não encontrados")

            const finalProjectData = {
                "1. Tema": `<p>${theme}</p>`,
                "2. Delimitação do Tema": full.scope || "",
                "3. Justificativa": full.justification || "",
                "4. Objetivo Geral": full.generalObjective || "",
                "5. Objetivos Específicos": full.specificObjectives || "",
                "6. Contribuições das Disciplinas": full.subjectsContributions || "",
                "7. Metodologia": full.methodology || "",
                "8. Cronograma": full.timeline || "",
            }

            const overviewData = await getProjectOverviewById(projectId)
            if (!overviewData) throw new Error("Dados do projeto não encontrados")

            const cleanFileName = theme
                .replace(/[^\w\s]/gi, "")
                .replace(/\s+/g, "_")
                .slice(0, 50)
                .concat(".docx")

            await generateDocx(overviewData, finalProjectData, cleanFileName)
        } catch {
            toast.error("Erro ao exportar DOCX")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            variant="secondary"
            className="flex items-center gap-2 text-sm"
            disabled={loading}
            onClick={handleExport}
        >
            <ArrowDownTrayIcon className="w-4 h-4" />
            {loading ? "Gerando..." : "Exportar"}
        </Button>
    )
}
