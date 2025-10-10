import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { PPI, PPICreateInput, PPIRes, PPIUpdateInput, PPIUpdateSubjectInput } from "@/types/ppi.type"
import { createPPI, deletePPIById, getAllPPIs, updatePPIById, updatePPISubjectById } from "@/services/ppis.service"
import { formatPPI } from "../utils/format-ppi"

export function usePPIs() {
    const [rawData, setRawData] = useState<PPIRes[]>([])
    const [formattedData, setFormattedData] = useState<PPI[]>([])
    const [loading, setLoading] = useState(false)
    const [metadata, setMetadata] = useState({
        page: 1,
        itemsPerPage: 1,
        totalPages: 1,
        totalItems: 1,
    })

    const fetchPPIs = useCallback(async (params: { page: number; classPeriod?: string; courseId?: string }) => {
        setLoading(true)
        try {
            const response = await getAllPPIs(params)
            if (response) {
                setRawData(response.items)
                setFormattedData(response.items.map(formatPPI))
                setMetadata(response.metadata)
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate = useCallback(async (newPPI: PPICreateInput) => {
        try {
            const created = await createPPI(newPPI)
            if (created) {
                setFormattedData((prev) => [...prev, formatPPI(created)])
                setRawData((prev) => [...prev, created])
            }
            toast.success("PPI criada com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleDelete = useCallback(async (id: string): Promise<void> => {
        try {
            await deletePPIById(id)
            setFormattedData((prev) => prev.filter((d) => d.id !== id))
            toast.success("PPI deletada com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleUpdatePPISubjects = useCallback(async (ppiId: string, req: PPIUpdateSubjectInput) => {
        try {
            const updated = await updatePPISubjectById(ppiId, req)
            if (updated) {
                setFormattedData((prev) => prev.map((d) => (d.id === updated.id ? formatPPI(updated) : d)))
            }
            toast.success("Disciplinas da PPI atualizadas com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleUpdate = useCallback(async (ppiId: string, req: PPIUpdateInput) => {
        try {
            const updated = await updatePPIById(ppiId, req)
            if (updated) {
                setFormattedData((prev) => prev.map((d) => (d.id === updated.id ? formatPPI(updated) : d)))
            }
            toast.success("PPI atualizada com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    return {
        rawData,
        loading,
        metadata,
        fetchPPIs,
        handleCreate,
        handleDelete,
        handleUpdate,
        formattedData,
        handleUpdatePPISubjects,
    }
}
