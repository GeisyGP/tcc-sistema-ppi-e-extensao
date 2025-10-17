import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { getProjectFullById, updateProjectContentById } from "@/services/projects.service"
import { ProjectContentUpdateInput, ProjectFullRes } from "@/types/project.type"

export function useContentProject() {
    const [rawData, setRawData] = useState<ProjectFullRes>()
    const [loading, setLoading] = useState(false)

    const fetchProject = useCallback(async (projectId: string) => {
        setLoading(true)
        try {
            const response = await getProjectFullById(projectId)
            if (response) {
                setRawData(response)
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleUpdate = useCallback(async (projectId: string, req: ProjectContentUpdateInput) => {
        try {
            console.log(req)
            const updated = await updateProjectContentById(projectId, req)
            if (updated) {
                setRawData(updated)
            }
            toast.success("Projeto atualizado com sucesso")
        } catch (error: any) {
            console.log(error)
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    return {
        rawData,
        loading,
        handleUpdate,
        fetchProject,
    }
}
