import { DeliverableContent } from "@prisma/client"
import { CreateContentReqDto } from "../types/dtos/requests/create-content-req.dto"
import { UpdateContentReqDto } from "../types/dtos/requests/update-content-req.dto"

export interface DeliverableContentRepositoryInterface {
    create(dto: CreateContentReqDto, currentCourseId: string, currentUserId: string): Promise<DeliverableContent>
    getById(id: string, currentCourseId: string): Promise<DeliverableContent | null>
    getAllByDeliverableId(
        currentCourseId: string,
        deliverableId: string,
        groupId?: string,
    ): Promise<{ deliverableContents: DeliverableContent[]; totalItems: number }>
    updateById(
        id: string,
        dto: UpdateContentReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<DeliverableContent>
    deleteById(id: string, currentCourseId: string): Promise<void>
}
