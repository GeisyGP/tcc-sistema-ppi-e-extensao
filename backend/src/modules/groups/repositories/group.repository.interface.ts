import { Group } from "@prisma/client"
import { CreateGroupReqDto } from "../types/dtos/requests/create-group-req.dto"
import { GetAllGroupsReqDto } from "../types/dtos/requests/get-all-req.dto"
import { UpdateGroupReqDto } from "../types/dtos/requests/update-group-req.dto"

export type GroupWithUsers = Group & {
    users: { id: string; name: string; registration: string }[]
}

export interface GroupRepositoryInterface {
    create(dto: CreateGroupReqDto, currentCourseId: string): Promise<GroupWithUsers>
    getById(id: string, currentCourseId: string): Promise<GroupWithUsers | null>
    getAllByProjectId(
        projectId: string,
        dto: GetAllGroupsReqDto,
        currentCourseId: string,
    ): Promise<{ groups: GroupWithUsers[]; totalItems: number }>
    updateById(id: string, dto: UpdateGroupReqDto, currentCourseId: string): Promise<GroupWithUsers>
    deleteById(id: string, currentCourseId: string): Promise<void>
}
