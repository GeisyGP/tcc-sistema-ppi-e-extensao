import { faker } from "@faker-js/faker/."
import { UserRole } from "src/common/enums/user-role.enum"
import { RequestDto } from "src/modules/authentication/dtos/requests/request.dto"
import { LoginResDto } from "src/modules/authentication/dtos/responses/login-res.dto"

export const loginResMock: LoginResDto = {
    accessToken: "token",
    expiresIn: "43200s",
}

export const requestMock: RequestDto = {
    user: {
        sub: faker.string.uuid(),
        name: faker.person.fullName(),
        role: UserRole.COORDINATOR,
    },
}
