import { createCourse, deleteCourseById, getAllCourses, updateCourseById } from "@/services/courses.service"
import { Course, CourseRes } from "@/types/course.types"
import { useCallback, useState } from "react"
import { formatCourse } from "../utils/format-course"

export function useCourses() {
    const [rawData, setRawData] = useState<CourseRes[]>([])
    const [formattedData, setFormattedData] = useState<Course[]>([])
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)

    const fetchCourses = useCallback(async (params: { page: number, name?: string }) => {
        setLoading(true)
        try {
            const response = await getAllCourses(params)
            if (response) {
                setRawData(response.items)
                setFormattedData(response.items.map(formatCourse))
                setTotalPages(response.metadata.totalPages)
            }
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreate = useCallback(async (newCourse: CourseRes) => {
        const created = await createCourse({
            name: newCourse.name,
            technologicalAxis: newCourse.technologicalAxis,
            educationLevel: newCourse.educationLevel,
            degree: newCourse.degree,
            modality: newCourse.modality,
            shift: newCourse.shift,
        })
        if (created) setFormattedData(prev => [...prev, formatCourse(created)])
    }, [])

    const handleUpdate = useCallback(async (updated: CourseRes) => {
        await updateCourseById(updated.id, {
            name: updated.name,
            technologicalAxis: updated.technologicalAxis,
            educationLevel: updated.educationLevel,
            degree: updated.degree,
            modality: updated.modality,
            shift: updated.shift,
        })
        setFormattedData(prev => prev.map(d => d.id === updated.id ? formatCourse(updated) : d))
    }, [])

    const handleDelete = useCallback(async (id: string) => {
        await deleteCourseById(id)
        setFormattedData(prev => prev.filter(d => d.id !== id))
    }, [])

    return { rawData, formattedData, loading, totalPages, fetchCourses, handleCreate, handleUpdate, handleDelete }
}
