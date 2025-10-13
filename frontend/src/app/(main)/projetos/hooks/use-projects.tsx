import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { GetAllProjectsReq, Project, ProjectCreateInput, ProjectRes } from "@/types/project.type"
import { createProject, getAllProjects } from "@/services/projects.service"
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

    return {
        rawData,
        loading,
        metadata,
        handleCreate,
        formattedData,
        fetchProjects,
    }
}
