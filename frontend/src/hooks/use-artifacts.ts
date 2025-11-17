import {
    createArtifactDeliverable,
    createArtifactProject,
    updateArtifactById,
    getArtifactByIdView,
    downloadArtifactById,
    getAllArtifactsByProjectId,
    getAllArtifactsByGroupId,
    deleteArtifactById,
} from "@/services/artifact.service"
import {
    ArtifactRes,
    Artifact,
    ArtifactProjectCreateInput,
    ArtifactDeliverableCreateInput,
} from "@/types/artifact.type"
import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { formatArtifact } from "@/app/(main)/projects/[id]/utils/format-artifact"

export function useArtifacts() {
    const [rawDataProject, setRawDataProject] = useState<ArtifactRes[]>([])
    const [formattedDataProject, setFormattedDataProject] = useState<Artifact[]>([])
    const [loadingProject, setLoadingProject] = useState(false)
    const [metadataProject, setMetadataProject] = useState({
        page: 1,
        itemsPerPage: 1,
        totalPages: 1,
        totalItems: 1,
    })
    const [rawDataGroup, setRawDataGroup] = useState<ArtifactRes[]>([])
    const [formattedDataGroup, setFormattedDataGroup] = useState<Artifact[]>([])
    const [loadingGroup, setLoadingGroup] = useState(false)
    const [metadataGroup, setMetadataGroup] = useState({
        page: 1,
        itemsPerPage: 1,
        totalPages: 1,
        totalItems: 1,
    })

    const fetchArtifactsGroup = useCallback(async (id: string, params: { page: number }) => {
        setLoadingGroup(true)
        try {
            const response = await getAllArtifactsByGroupId(id, params)
            if (response) {
                setRawDataGroup(response.items)
                setFormattedDataGroup(response.items.map(formatArtifact))
                setMetadataGroup(response.metadata)
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoadingGroup(false)
        }
    }, [])

    const fetchArtifactsProjects = useCallback(async (id: string, params: { page: number }) => {
        setLoadingProject(true)
        try {
            const response = await getAllArtifactsByProjectId(id, params)
            if (response) {
                setRawDataProject(response.items)
                setFormattedDataProject(response.items.map(formatArtifact))
                setMetadataProject(response.metadata)
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoadingProject(false)
        }
    }, [])

    const handleCreateProjectArtifact = useCallback(
        async (projectId: string, body: ArtifactProjectCreateInput, file: File) => {
            setLoadingProject(true)
            try {
                const artifact = await createArtifactProject(projectId, body, file)
                if (artifact) {
                    setRawDataProject((prev) => [...prev, artifact])
                    setFormattedDataProject((prev) => [...prev, formatArtifact(artifact)])
                }
                toast.success("Artefato criado com sucesso")
                return artifact
            } catch (error: any) {
                const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
                toast.error(errorMessage)
            } finally {
                setLoadingProject(false)
            }
        },
        [],
    )

    const handleCreateDeliverableArtifact = useCallback(
        async (deliverableId: string, body: ArtifactDeliverableCreateInput, file: File) => {
            setLoadingProject(true)
            try {
                const artifact = await createArtifactDeliverable(deliverableId, body, file)
                if (artifact) {
                    setRawDataProject((prev) => [...prev, artifact])
                    setFormattedDataProject((prev) => [...prev, formatArtifact(artifact)])
                }
                toast.success("Artefato criado com sucesso")
                return artifact
            } catch (error: any) {
                const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
                toast.error(errorMessage)
            } finally {
                setLoadingProject(false)
            }
        },
        [],
    )

    const handleUpdateArtifact = useCallback(async (id: string, deliverableId: string, file: File) => {
        setLoadingProject(true)
        try {
            const artifact = await updateArtifactById(id, deliverableId, file)
            if (artifact) {
                setRawDataProject((prev) => prev.map((a) => (a.id === id ? artifact : a)))
                setFormattedDataProject((prev) => prev.map((a) => (a.id === id ? formatArtifact(artifact) : a)))
            }
            toast.success("Artefato atualizado com sucesso")
            return artifact
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoadingProject(false)
        }
    }, [])

    const handleViewArtifact = useCallback(async (id: string) => {
        setLoadingProject(true)
        try {
            const artifact = await getArtifactByIdView(id)
            if (!artifact?.url) throw new Error("FILE_CANNOT_BE_VIEWED")
            window.open(artifact.url, "_blank")
            return { artifact }
        } catch (error: any) {
            if (error.message === "FILE_CANNOT_BE_VIEWED") {
                return toast("Este arquivo não possui pré-visualização e deve ser baixado")
            }

            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            return toast.error(errorMessage)
        } finally {
            setLoadingProject(false)
        }
    }, [])

    const handleDownloadArtifact = useCallback(async (id: string) => {
        setLoadingProject(true)
        try {
            await downloadArtifactById(id)
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoadingProject(false)
        }
    }, [])

    const handleDeleteArtifact = useCallback(async (id: string) => {
        try {
            await deleteArtifactById(id)
            setFormattedDataProject((prev) => prev.filter((d) => d.id !== id))
            toast.success("Artefato deletado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    return {
        rawDataProject,
        formattedDataProject,
        loadingProject,
        metadataProject,
        rawDataGroup,
        formattedDataGroup,
        loadingGroup,
        metadataGroup,
        fetchArtifactsGroup,
        fetchArtifactsProjects,
        handleCreateProjectArtifact,
        handleCreateDeliverableArtifact,
        handleUpdateArtifact,
        handleViewArtifact,
        handleDownloadArtifact,
        handleDeleteArtifact,
    }
}
