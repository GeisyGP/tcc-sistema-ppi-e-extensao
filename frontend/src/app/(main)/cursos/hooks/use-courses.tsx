import { createCourse, deleteCourseById, getAllCourses, updateCourseById } from "@/services/courses.service"
import { Course, CourseRes } from "@/types/course.type"
import { useCallback, useState } from "react"
import { formatCourse } from "../utils/format-course"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"

export function useCourses() {
    const [rawData, setRawData] = useState<CourseRes[]>([])
    const [formattedData, setFormattedData] = useState<Course[]>([])
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)

    const fetchCourses = useCallback(async (params: { page: number; name?: string }) => {
        setLoading(true)
        try {
            const response = await getAllCourses(params)
            if (response) {
                setRawData(response.items)
                setFormattedData(response.items.map(formatCourse))
                setTotalPages(response.metadata.totalPages)
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate = useCallback(async (newCourse: CourseRes) => {
        try {
            const created = await createCourse({
                name: newCourse.name,
                technologicalAxis: newCourse.technologicalAxis,
                educationLevel: newCourse.educationLevel,
                degree: newCourse.degree,
                modality: newCourse.modality,
                shift: newCourse.shift,
            })
            if (created) setFormattedData((prev) => [...prev, formatCourse(created)])
            toast.success("Curso criado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleUpdate = useCallback(async (updated: CourseRes) => {
        try {
            await updateCourseById(updated.id, {
                name: updated.name,
                technologicalAxis: updated.technologicalAxis,
                educationLevel: updated.educationLevel,
                degree: updated.degree,
                modality: updated.modality,
                shift: updated.shift,
            })
            setFormattedData((prev) => prev.map((d) => (d.id === updated.id ? formatCourse(updated) : d)))
            toast.success("Curso atualizado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteCourseById(id)
            setFormattedData((prev) => prev.filter((d) => d.id !== id))
            toast.success("Curso deletado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    return { rawData, formattedData, loading, totalPages, fetchCourses, handleCreate, handleUpdate, handleDelete }
}
