import { User } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { UserResDto } from "src/modules/users/types/dtos/responses/user-res.dto"

export const userResponseMock: UserResDto = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    role: "STUDENT",
    registration: faker.string.numeric(),
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const userMock: User = {
    ...userResponseMock,
    password: faker.internet.password(),
    deletedAt: new Date(),
}
