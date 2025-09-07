import { faker } from "@faker-js/faker/."
import { Course } from "@prisma/client"
import { CourseResDto } from "src/modules/courses/types/dtos/responses/course-res.dto"

export const courseResMock: CourseResDto = {
    id: faker.string.uuid(),
    name: faker.company.name(),
    technologicalAxis: "Tecnologia",
    educationLevel: "Superior",
    degree: "Bacharelado",
    modality: "Presencial",
    shift: "Noturno",
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const courseMock: Course = {
    ...courseResMock,
    deletedAt: new Date(),
}
