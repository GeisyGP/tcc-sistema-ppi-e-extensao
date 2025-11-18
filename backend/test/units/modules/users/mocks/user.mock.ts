import { User } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { UserRole } from "src/common/enums/user-role.enum"
import { UserWithCoursesResDto } from "src/modules/users/types/dtos/responses/user-with-courses-res.dto"
import { UserWithCourses } from "src/modules/users/repositories/user.repository.interface"

export const userResponseMock = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: "user@email",
    registration: faker.string.numeric(),
    createdAt: new Date(),
    updatedAt: new Date(),
    changePasswordIsRequired: false,
}

export const userWithCoursesResponseMock = (
    role: UserRole = "STUDENT",
    courseId: string = faker.string.uuid(),
): UserWithCoursesResDto => ({
    ...userResponseMock,
    userCourse: [
        {
            courseId,
            role,
            name: "Course",
        },
    ],
    email: "user@email",
    changePasswordIsRequired: false,
})

export const userMock: User = {
    ...userResponseMock,
    password: faker.internet.password(),
    deletedAt: new Date(),
    changePasswordIsRequired: false,
    email: "user@email",
}

export const userWithCoursesMock: UserWithCourses = {
    ...userMock,
    UserCourse: [
        {
            courseId: faker.string.uuid(),
            role: "STUDENT",
            course: { name: "Course" },
        },
    ],
}

export function makeMockFile(content: string): Express.Multer.File {
    return {
        buffer: Buffer.from(content, "utf-8"),
    } as Express.Multer.File
}
