import { User } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { UserResDto } from "src/modules/users/types/dtos/responses/user-res.dto"
import { UserRole } from "src/common/enums/user-role.enum"

const user = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    registration: faker.string.numeric(),
    courseId: [faker.string.uuid()],
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const userResponseMock = (role: UserRole = "STUDENT"): UserResDto => ({
    ...user,
    role,
})

export const userMock: User = {
    ...user,
    role: "STUDENT",
    password: faker.internet.password(),
    deletedAt: new Date(),
}
