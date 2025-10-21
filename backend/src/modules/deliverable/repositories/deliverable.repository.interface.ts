import { GetAllDeliverableReqDto } from "../types/dtos/requests/get-all-req.dto"
import { CreateDeliverableReqDto } from "../types/dtos/requests/create-deliverable-req.dto"
import { UpdateDeliverableReqDto } from "../types/dtos/requests/update-deliverable-req.dto"
import { Deliverable } from "@prisma/client"

export interface DeliverableRepositoryInterface {
    create(dto: CreateDeliverableReqDto, currentCourseId: string, currentUserId: string): Promise<Deliverable>
    getById(id: string, currentCourseId: string): Promise<Deliverable | null>
    getAllByProjectId(
        dto: GetAllDeliverableReqDto,
        currentCourseId: string,
        projectId: string,
    ): Promise<{ deliverables: Deliverable[]; totalItems: number }>
    updateById(
        id: string,
        dto: UpdateDeliverableReqDto,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<Deliverable>
    deleteById(id: string, currentCourseId: string): Promise<void>
}
