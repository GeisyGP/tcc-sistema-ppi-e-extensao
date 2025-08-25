import { User } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { UserResDto } from "src/modules/users/types/dtos/responses/user-res.dto"
import { UserRole } from "src/common/enums/user-role.enum"

export const userResponseMock = (role: UserRole = "STUDENT"): UserResDto => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    role,
    registration: faker.string.numeric(),
    createdAt: new Date(),
    updatedAt: new Date(),
})

export const userMock: User = {
    ...userResponseMock(),
    password: faker.internet.password(),
    deletedAt: new Date(),
}
