import { Course, CourseRes } from "@/types/course.types"

export function formatCourse(res: CourseRes): Course {
    return {
        id: res.id,
        name: res.name,
        technologicalAxis: res.technologicalAxis,
        educationLevel: res.educationLevel,
        degree: res.degree,
        modality: res.modality,
        shift: res.shift,
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
    }
}