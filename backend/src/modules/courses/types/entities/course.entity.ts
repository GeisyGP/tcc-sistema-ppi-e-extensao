import { Course } from "@prisma/client"

export class CourseEntity implements Course {
    name: string
    id: string
    technologicalAxis: string
    educationLevel: string
    degree: string
    modality: string
    shift: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}
