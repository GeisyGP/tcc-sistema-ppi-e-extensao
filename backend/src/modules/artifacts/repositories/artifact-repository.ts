import { GetAllArtifactReqDto } from "../types/dtos/requests/get-all-req.dto"
import {
    ArtifactRepositoryInterface,
    ArtifactWithVisibleToAll,
    CreateArtifactInput,
    UpdateArtifactFileInput,
} from "./artifact.repository.interface"
import { PrismaService } from "src/config/prisma.service"
import { Injectable } from "@nestjs/common"
import { Artifact } from "@prisma/client"

@Injectable()
export class ArtifactRepository implements ArtifactRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateArtifactInput, currentCourseId: string, currentUserId: string): Promise<Artifact> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.artifact.create({
            data: {
                name: dto.name,
                fileName: dto.fileName,
                mimeType: dto.mimeType,
                path: dto.path,
                size: dto.size,
                projectId: dto.projectId,
                groupId: dto.groupId,
                deliverableId: dto.deliverableId,
                createdBy: currentUserId,
                updatedBy: currentUserId,
                courseId: currentCourseId,
            },
        })
    }

    async getById(
        id: string,
        currentCourseId: string,
        studentId?: string,
        visibleToAll?: boolean,
    ): Promise<ArtifactWithVisibleToAll | null> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const filter = {
            id,
            OR: [
                {
                    groupId: null,
                },
                {
                    group: {
                        users: { some: { id: studentId } },
                    },
                },
                {
                    deliverable: { project: { visibleToAll } },
                },
            ],
        }
        const artifact = await this.prisma.artifact.findFirst({
            where: visibleToAll ? filter : { id },
            include: {
                project: {
                    where: { deletedAt: null },
                    select: { visibleToAll: true },
                },
            },
        })

        if (!artifact) return null

        return artifact
    }

    async getAllByProjectIdOrGroupId(
        dto: GetAllArtifactReqDto,
        currentCourseId: string,
        id: {
            projectId?: string
            groupId?: string
        },
    ): Promise<{ artifacts: Artifact[]; totalItems: number }> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        const filter = {
            projectId: id.projectId,
            groupId: id.groupId,
        }
        const artifacts = await this.prisma.artifact.findMany({
            where: filter,
            take: dto.limit,
            skip: dto.limit * (dto.page - 1),
            orderBy: [{ name: "asc" }],
        })

        if (!artifacts) {
            return {
                artifacts: [],
                totalItems: 0,
            }
        }

        const totalItems = await this.prisma.artifact.count({
            where: filter,
        })

        return { artifacts, totalItems }
    }

    async updateFileById(
        id: string,
        dto: UpdateArtifactFileInput,
        currentCourseId: string,
        currentUserId: string,
    ): Promise<Artifact> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        return await this.prisma.artifact.update({
            where: { id },
            data: {
                name: dto.name,
                fileName: dto.fileName,
                mimeType: dto.mimeType,
                path: dto.path,
                size: dto.size,
                updatedBy: currentUserId,
            },
        })
    }

    async deleteById(id: string, currentCourseId: string): Promise<void> {
        await this.prisma.$executeRawUnsafe(`SET app.current_course_id = '${currentCourseId}'`)
        await this.prisma.artifact.delete({ where: { id } })
    }
}
