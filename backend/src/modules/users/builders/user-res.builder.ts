import { User } from "@prisma/client"
import { UserResDto } from "../types/dtos/responses/user-res.dto"
import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"

export class UserResBuilder {
    build(user: User): UserResDto {
        return {
            id: user.id,
            name: user.name,
            registration: user.registration,
            role: user.role,
            courseId: user.courseId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    buildMany(
        users: User[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<UserResDto[]> {
        return {
            items: users.map((user) => this.build(user)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
