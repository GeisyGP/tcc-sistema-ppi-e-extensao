import { faker } from "@faker-js/faker/."
import { UserRole } from "src/common/enums/user-role.enum"
import { RequestDto } from "src/modules/authentication/types/dtos/requests/request.dto"
import { LoginResDto } from "src/modules/authentication/types/dtos/responses/login-res.dto"

export const loginResMock: LoginResDto = {
    accessToken: "token",
    expiresIn: "43200s",
    changePasswordIsRequired: false,
}

const courseId = faker.string.uuid()
export const requestMock: RequestDto = {
    user: {
        sub: faker.string.uuid(),
        name: faker.person.fullName(),
        courses: [{ courseId, role: "COORDINATOR" }],
        mainRole: UserRole.COORDINATOR,
        mainCourseId: courseId,
        changePasswordIsRequired: false,
    },
}
