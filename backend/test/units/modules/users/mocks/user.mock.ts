import { User } from "@prisma/client"
import { faker } from "@faker-js/faker"
import { UserRole } from "src/common/enums/user-role.enum"
import { UserWithCoursesResDto } from "src/modules/users/types/dtos/responses/user-with-courses-res.dto"
import { UserWithCourses } from "src/modules/users/repositories/user.repository.interface"

export const userResponseMock = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    registration: faker.string.numeric(),
    createdAt: new Date(),
    updatedAt: new Date(),
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
})

export const userMock: User = {
    ...userResponseMock,
    password: faker.internet.password(),
    deletedAt: new Date(),
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
