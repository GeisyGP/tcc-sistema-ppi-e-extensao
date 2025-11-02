"use client"

import { formatDeliverable } from "@/app/(main)/projetos/[id]/grupos/[groupId]/utils/format-deliverable"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { ApiError } from "@/exceptions/api-error.exception"
import { getAllDeliverables } from "@/services/deliverable.service"
import { getGroupById } from "@/services/group.service"
import { Deliverable, DeliverableWithContentAndArtifactRes, GetAllDeliverablesReq } from "@/types/deliverable.type"
import { useState, useCallback } from "react"
import toast from "react-hot-toast"
import { formatGroup } from "../../../utils/format-group"
import { Group, GroupRes } from "@/types/group.type"

export function useGroupDeliverables() {
    const [loadingGroup, setLoadingGroup] = useState(false)
    const [rawDataGroup, setRawDataGroup] = useState<GroupRes>()
    const [formattedDataGroup, setFormattedDataGroup] = useState<Group>()
    const [loading, setLoading] = useState(false)
    const [rawData, setRawData] = useState<DeliverableWithContentAndArtifactRes[]>([])
    const [formattedData, setFormattedData] = useState<Deliverable[]>([])
    const [metadata, setMetadata] = useState({
        page: 1,
        itemsPerPage: 1,
        totalPages: 1,
        totalItems: 0,
    })

    const fetchDeliverables = useCallback(async (projectId: string, params: GetAllDeliverablesReq) => {
        setLoading(true)
        try {
            const response = await getAllDeliverables(projectId, params)
            if (response) {
                setRawData(response.items)
                setFormattedData(response.items.map(formatDeliverable))
                setMetadata(response.metadata)
            }
        } catch (error: any) {
            console.log(error)
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchUniqueGroup = useCallback(async (groupId: string) => {
        setLoadingGroup(true)
        try {
            const response = await getGroupById(groupId)
            if (response) {
                setRawDataGroup(response)
                setFormattedDataGroup(formatGroup(response))
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoadingGroup(false)
        }
    }, [])

    return {
        loading,
        rawData,
        formattedData,
        metadata,
        fetchDeliverables,
        loadingGroup,
        rawDataGroup,
        formattedDataGroup,
        fetchUniqueGroup,
    }
}
