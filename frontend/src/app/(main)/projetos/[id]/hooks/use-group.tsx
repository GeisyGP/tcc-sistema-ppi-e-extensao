import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { GetAllGroupsReq, Group, GroupCreateInput, GroupRes, GroupUpdateInput } from "@/types/group.type"
import { createGroup, deleteGroupById, getAllGroups, updateGroupById } from "@/services/group.service"
import { formatGroup } from "../utils/format-group"

export function useGroups() {
    const [rawData, setRawData] = useState<GroupRes[]>([])
    const [formattedData, setFormattedData] = useState<Group[]>([])
    const [loading, setLoading] = useState(false)
    const [metadata, setMetadata] = useState({
        page: 1,
        itemsPerPage: 1,
        totalPages: 1,
        totalItems: 1,
    })

    const fetchGroups = useCallback(async (GroupId: string, params: GetAllGroupsReq) => {
        setLoading(true)
        try {
            const response = await getAllGroups(GroupId, params)
            if (response) {
                setRawData(response.items)
                setFormattedData(response.items.map(formatGroup))
                setMetadata(response.metadata)
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate = useCallback(async (newGroup: GroupCreateInput) => {
        try {
            const created = await createGroup(newGroup)
            if (created) {
                setFormattedData((prev) => [...prev, formatGroup(created)])
                setRawData((prev) => [...prev, created])
            }
            toast.success("Grupo criado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleDelete = useCallback(async (id: string): Promise<void> => {
        try {
            await deleteGroupById(id)
            setFormattedData((prev) => prev.filter((d) => d.id !== id))
            toast.success("Grupo deletado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleUpdate = useCallback(async (ppiId: string, req: GroupUpdateInput) => {
        try {
            const updated = await updateGroupById(ppiId, req)
            if (updated) {
                setFormattedData((prev) => prev.map((d) => (d.id === updated.id ? formatGroup(updated) : d)))
            }
            toast.success("Grupo atualizado com sucesso")
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
        formattedData,
        fetchGroups: fetchGroups,
    }
}
