import { createSubject, deleteSubjectById, getAllSubjects, updateSubjectById } from "@/services/subjects.service"
import { Subject, SubjectRes } from "@/types/subject.type"
import { useCallback, useState } from "react"
import { formatSubject } from "../utils/format-subject"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"

export function useSubjects() {
    const [rawData, setRawData] = useState<SubjectRes[]>([])
    const [formattedData, setFormattedData] = useState<Subject[]>([])
    const [loading, setLoading] = useState(false)
    const [metadata, setMetadata] = useState({
        page: 1,
        itemsPerPage: 1,
        totalPages: 1,
        totalItems: 1,
    })

    const fetchSubjects = useCallback(async (params: { page: number; name?: string; teacherId?: string }) => {
        setLoading(true)
        try {
            const response = await getAllSubjects(params)
            if (response) {
                setRawData(response.items)
                setFormattedData(response.items.map(formatSubject))
                setMetadata(response.metadata)
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate = useCallback(async (newSubject: SubjectRes) => {
        try {
            const created = await createSubject({
                name: newSubject.name,
                teachers: newSubject.teachers.map((t) => t.id),
                courseId: newSubject.courseId,
            })
            if (created) setFormattedData((prev) => [...prev, formatSubject(created)])
            toast.success("Disciplina criada com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleUpdate = useCallback(async (updated: SubjectRes) => {
        try {
            await updateSubjectById(updated.id, { name: updated.name, teachers: updated.teachers.map((t) => t.id) })
            setFormattedData((prev) => prev.map((d) => (d.id === updated.id ? formatSubject(updated) : d)))
            toast.success("Disciplina atualizada com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteSubjectById(id)
            setFormattedData((prev) => prev.filter((d) => d.id !== id))
            toast.success("Disciplina deletada com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    return { rawData, formattedData, loading, metadata, fetchSubjects, handleCreate, handleUpdate, handleDelete }
}
