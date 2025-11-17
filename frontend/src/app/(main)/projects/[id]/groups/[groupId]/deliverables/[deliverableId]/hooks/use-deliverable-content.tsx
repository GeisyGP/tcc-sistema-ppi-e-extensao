"use client"

import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { ApiError } from "@/exceptions/api-error.exception"
import { useState, useCallback } from "react"
import toast from "react-hot-toast"
import {
    DeliverableContent,
    DeliverableContentCreateInput,
    DeliverableContentRes,
    DeliverableContentUpdateInput,
} from "@/types/deliverable-content.type"
import {
    createDeliverableContent,
    deleteDeliverableContentById,
    getDeliverableContentById,
    updateDeliverableContentById,
} from "@/services/deliverable-content.service"
import { formatDeliverableContent } from "../../../utils/format-deliverable-content"

export function useDeliverableContent() {
    const [loading, setLoading] = useState(false)
    const [rawData, setRawData] = useState<DeliverableContentRes | null>(null)
    const [formattedData, setFormattedData] = useState<DeliverableContent | null>(null)

    const fetchDeliverableContent = useCallback(async (id: string) => {
        setLoading(true)
        try {
            const response = await getDeliverableContentById(id)
            if (response) {
                setRawData(response)
                setFormattedData(formatDeliverableContent(response))
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate = useCallback(async (newContent: DeliverableContentCreateInput) => {
        try {
            const created = await createDeliverableContent(newContent)
            if (created) {
                setFormattedData(formatDeliverableContent(created))
            }
            toast.success("Conteúdo salvo com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleUpdate = useCallback(async (id: string, updated: DeliverableContentUpdateInput) => {
        try {
            const content = await updateDeliverableContentById(id, updated)
            if (content) setFormattedData(formatDeliverableContent(content))
            toast.success("Conteúdo atualizado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteDeliverableContentById(id)
            setFormattedData(null)
            toast.success("Conteúdo deletado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    return {
        loading,
        rawData,
        formattedData,
        fetchDeliverableContent,
        handleCreate,
        handleUpdate,
        handleDelete,
    }
}
