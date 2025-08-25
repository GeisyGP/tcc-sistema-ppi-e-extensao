import { Injectable } from "@nestjs/common"
import { UserService } from "src/modules/users/services/user.service"
import { CreateSubjectReqDto } from "../types/dtos/requests/create-subject-req.dto"
import { UserNotFoundException } from "src/common/exceptions/user-not-found.exception"
import { TeacherNotFoundException } from "src/common/exceptions/teacher-not-found.exception"
import { UserRole } from "src/common/enums/user-role.enum"
import { SubjectRepository } from "../repositories/subject.repository"
import { SubjectResBuilder } from "../builders/subject-res.builder"
import { SubjectWithTeacherResDto } from "../types/dtos/responses/subject-with-teacher-res.dto"
import { SubjectNotFoundException } from "src/common/exceptions/subject-not-found.exception"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { GetAllSubjectsReqDto } from "../types/dtos/requests/get-all-subjects-req.dto"
import { UpdateSubjectReqDto } from "../types/dtos/requests/update-subject-req.dto"

@Injectable()
export class SubjectService {
    constructor(
        private readonly subjectRepository: SubjectRepository,
        private readonly userService: UserService,
    ) {}

    async create(dto: CreateSubjectReqDto): Promise<SubjectWithTeacherResDto> {
        for (const teacherId of dto.teachers) {
            await this.validateTeacherExistsOrThrow(teacherId)
        }

        const subject = await this.subjectRepository.create(dto)

        return SubjectResBuilder.build(subject)
    }

    async getById(id: string): Promise<SubjectWithTeacherResDto> {
        const subject = await this.subjectRepository.getById(id)
        if (!subject) {
            throw new SubjectNotFoundException()
        }

        return SubjectResBuilder.build(subject)
    }

    async getAll(
        dto: GetAllSubjectsReqDto,
    ): Promise<PaginationResDto<SubjectWithTeacherResDto[]>> {
        const { subjects, totalItems } =
            await this.subjectRepository.getAll(dto)

        return SubjectResBuilder.buildMany(
            subjects,
            dto.page,
            dto.limit,
            totalItems,
        )
    }

    async updateById(
        id: string,
        dto: UpdateSubjectReqDto,
    ): Promise<SubjectWithTeacherResDto> {
        await this.getById(id)

        for (const teacherId of dto.teachers) {
            await this.validateTeacherExistsOrThrow(teacherId)
        }

        const subject = await this.subjectRepository.updateById(id, dto)

        return SubjectResBuilder.build(subject)
    }

    async delete(id: string): Promise<void> {
        await this.getById(id)
        await this.subjectRepository.deleteById(id)
    }

    private async validateTeacherExistsOrThrow(
        teacherId: string,
    ): Promise<void> {
        try {
            const teacher = await this.userService.getById(teacherId)

            const validRoles: UserRole[] = [
                UserRole.COORDINATOR,
                UserRole.TEACHER,
            ]
            if (!validRoles.includes(teacher.role)) {
                throw new TeacherNotFoundException()
            }
        } catch (error) {
            if (error instanceof UserNotFoundException) {
                throw new TeacherNotFoundException()
            }

            throw error
        }
    }
}
