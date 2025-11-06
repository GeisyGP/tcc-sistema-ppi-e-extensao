"use client"

import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { ApiError } from "@/exceptions/api-error.exception"
import { getArtifactById } from "@/services/artifact.service"
import { Artifact, ArtifactRes } from "@/types/artifact.type"
import { useState, useCallback } from "react"
import toast from "react-hot-toast"
import { formatArtifact } from "../../../../../utils/format-artifact"

export function useUniqueArtifact() {
    const [loading, setLoading] = useState(false)
    const [rawData, setRawData] = useState<ArtifactRes | null>(null)
    const [formattedDataArtifact, setFormattedData] = useState<Artifact | null>(null)

    const fetchArtifactById = useCallback(async (id: string) => {
        setLoading(true)
        try {
            const response = await getArtifactById(id)
            if (response) {
                setRawData(response)
                setFormattedData(formatArtifact(response))
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
        formattedDataArtifact,
        fetchArtifactById,
    }
}
