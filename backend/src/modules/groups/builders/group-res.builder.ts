import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { GroupResDto } from "../types/dtos/responses/group-res.dto"
import { GroupWithUsers } from "../repositories/group.repository.interface"

export class GroupResBuilder {
    static build(group: GroupWithUsers): GroupResDto {
        return {
            id: group.id,
            name: group.name,
            projectId: group.projectId,
            users: group.users.map((user) => {
                return { id: user.id, name: user.name, registration: user.registration }
            }),
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
        }
    }

    static buildMany(
        groups: GroupWithUsers[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<GroupResDto[]> {
        return {
            items: groups.map((group) => this.build(group)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
