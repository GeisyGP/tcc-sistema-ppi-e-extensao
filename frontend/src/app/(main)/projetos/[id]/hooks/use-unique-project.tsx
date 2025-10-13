import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import {
    changeProjectStatusById,
    deleteProjectById,
    getProjectById,
    updateProjectById,
} from "@/services/projects.service"
import { Project, ProjectRes, ProjectStatus, ProjectUpdateInput } from "@/types/project.type"
import { formatProject } from "../../utils/format-project"

export function useUniqueProject() {
    const [rawData, setRawData] = useState<ProjectRes>()
    const [formattedData, setFormattedData] = useState<Project>()
    const [loading, setLoading] = useState(false)

    const fetchProject = useCallback(async (projectId: string) => {
        setLoading(true)
        try {
            const response = await getProjectById(projectId)
            if (response) {
                setRawData(response)
                setFormattedData(formatProject(response))
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleDelete = useCallback(async (id: string): Promise<void> => {
        try {
            await deleteProjectById(id)
            toast.success("Projeto deletado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleUpdate = useCallback(async (projectId: string, req: ProjectUpdateInput) => {
        try {
            const updated = await updateProjectById(projectId, req)
            if (updated) {
                setFormattedData(formatProject(updated))
            }
            toast.success("Projeto atualizado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const changeStatus = useCallback(async (projectId: string, status: ProjectStatus) => {
        try {
            const updated = await changeProjectStatusById(projectId, { status })
            if (updated) {
                setFormattedData(formatProject(updated))
            }
            toast.success(`Projeto atualizado com sucesso`)
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    return {
        rawData,
        loading,
        handleDelete,
        handleUpdate,
        changeStatus,
        formattedData,
        fetchProject,
    }
}
