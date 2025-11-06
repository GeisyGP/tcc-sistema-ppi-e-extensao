"use client"

import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { ApiError } from "@/exceptions/api-error.exception"
import { getDeliverableByIdAndGroupId } from "@/services/deliverable.service"
import { Deliverable, DeliverableRes } from "@/types/deliverable.type"
import { useState, useCallback } from "react"
import toast from "react-hot-toast"
import { formatDeliverable } from "../../../utils/format-deliverable"

export function useUniqueDeliverable() {
    const [loading, setLoading] = useState(false)
    const [rawData, setRawData] = useState<DeliverableRes | null>(null)
    const [formattedData, setFormattedData] = useState<Deliverable | null>(null)

    const fetchDeliverableById = useCallback(async (id: string, groupId: string) => {
        setLoading(true)
        try {
            const response = await getDeliverableByIdAndGroupId(id, groupId)
            if (response) {
                setRawData(response)
                setFormattedData(formatDeliverable(response))
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        loading,
        rawData,
        formattedData,
        fetchDeliverableById,
    }
}
