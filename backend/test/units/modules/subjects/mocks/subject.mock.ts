import { faker } from "@faker-js/faker/."
import { Subject } from "@prisma/client"

export const subjectResMock = {
    id: faker.string.uuid(),
    name: faker.color.human(),
    teachers: [
        {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
        },
    ],
    courseId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const subjectMock: Subject & {
    teachers: { id: string; name: string }[]
} = {
    ...subjectResMock,
    deletedAt: new Date(),
}
