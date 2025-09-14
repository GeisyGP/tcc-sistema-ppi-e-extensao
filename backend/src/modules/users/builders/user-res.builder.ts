import { User } from "@prisma/client"
import { UserResDto } from "../types/dtos/responses/user-res.dto"
import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { UserWithCoursesResDto } from "../types/dtos/responses/user-with-courses-res.dto"
import { UserWithCourses } from "../repositories/user.repository.interface"

export class UserResBuilder {
    build(user: User): UserResDto {
        return {
            id: user.id,
            name: user.name,
            registration: user.registration,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    buildWithCourses(user: UserWithCourses): UserWithCoursesResDto {
        return {
            id: user.id,
            name: user.name,
            registration: user.registration,
            userCourse: user.UserCourse.map((uc) => ({
                role: uc.role,
                courseId: uc.courseId,
            })),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    buildMany(
        users: UserWithCourses[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<UserWithCoursesResDto[]> {
        return {
            items: users.map((user) => this.buildWithCourses(user)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
