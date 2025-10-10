import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import {
    GetAllProjectsReq,
    Project,
    ProjectCreateInput,
    ProjectRes,
    ProjectStatus,
    ProjectUpdateInput,
} from "@/types/project.type"
import {
    changeProjectStatusById,
    createProject,
    deleteProjectById,
    getAllProjects,
    updateProjectById,
} from "@/services/projects.service"
import { formatProject } from "../utils/format-project"

export function useProjects() {
    const [rawData, setRawData] = useState<ProjectRes[]>([])
    const [formattedData, setFormattedData] = useState<Project[]>([])
    const [loading, setLoading] = useState(false)
    const [metadata, setMetadata] = useState({
        page: 1,
        itemsPerPage: 1,
        totalPages: 1,
        totalItems: 1,
    })

    const fetchProjects = useCallback(async (params: GetAllProjectsReq) => {
        setLoading(true)
        try {
            const response = await getAllProjects(params)
            if (response) {
                setRawData(response.items)
                setFormattedData(response.items.map(formatProject))
                setMetadata(response.metadata)
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate = useCallback(async (newProject: ProjectCreateInput) => {
        try {
            const created = await createProject(newProject)
            if (created) {
                setFormattedData((prev) => [...prev, formatProject(created)])
                setRawData((prev) => [...prev, created])
            }
            toast.success("Projeto criado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleDelete = useCallback(async (id: string): Promise<void> => {
        try {
            await deleteProjectById(id)
            setFormattedData((prev) => prev.filter((d) => d.id !== id))
            toast.success("Projeto deletado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleUpdate = useCallback(async (ppiId: string, req: ProjectUpdateInput) => {
        try {
            const updated = await updateProjectById(ppiId, req)
            if (updated) {
                setFormattedData((prev) => prev.map((d) => (d.id === updated.id ? formatProject(updated) : d)))
            }
            toast.success("Projeto atualizado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const changeStatus = useCallback(async (ppiId: string, status: ProjectStatus) => {
        try {
            const updated = await changeProjectStatusById(ppiId, { status })
            if (updated) {
                setFormattedData((prev) => prev.map((d) => (d.id === updated.id ? formatProject(updated) : d)))
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
        metadata,
        handleCreate,
        handleDelete,
        handleUpdate,
        changeStatus,
        formattedData,
        fetchProjects,
    }
}
