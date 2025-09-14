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
import { CustomLoggerService } from "src/common/logger"

@Injectable()
export class SubjectService {
    constructor(
        private readonly subjectRepository: SubjectRepository,
        private readonly userService: UserService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async create(dto: CreateSubjectReqDto, currentCourseId: string): Promise<SubjectWithTeacherResDto> {
        try {
            for (const teacherId of dto.teachers) {
                await this.validateTeacherExistsOrThrow(teacherId, currentCourseId)
            }

            const subject = await this.subjectRepository.create(dto, currentCourseId)

            return SubjectResBuilder.build(subject)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.create.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getById(id: string, currentCourseId: string): Promise<SubjectWithTeacherResDto> {
        try {
            const subject = await this.subjectRepository.getById(id, currentCourseId)
            if (!subject) {
                throw new SubjectNotFoundException()
            }

            return SubjectResBuilder.build(subject)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getById.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getAll(
        dto: GetAllSubjectsReqDto,
        currentCourseId: string,
    ): Promise<PaginationResDto<SubjectWithTeacherResDto[]>> {
        try {
            const { subjects, totalItems } = await this.subjectRepository.getAll(dto, currentCourseId)

            return SubjectResBuilder.buildMany(subjects, dto.page, dto.limit, totalItems)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getAll.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async updateById(id: string, dto: UpdateSubjectReqDto, currentCourseId: string): Promise<SubjectWithTeacherResDto> {
        try {
            await this.getById(id, currentCourseId)

            for (const teacherId of dto.teachers) {
                await this.validateTeacherExistsOrThrow(teacherId, currentCourseId)
            }

            const subject = await this.subjectRepository.updateById(id, dto, currentCourseId)

            return SubjectResBuilder.build(subject)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.updateById.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async delete(id: string, currentCourseId: string): Promise<void> {
        try {
            await this.getById(id, currentCourseId)
            await this.subjectRepository.deleteById(id, currentCourseId)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.delete.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    private async validateTeacherExistsOrThrow(teacherId: string, currentCourseId: string): Promise<void> {
        try {
            const teacher = await this.userService.getById(teacherId, currentCourseId)

            const validRoles: UserRole[] = [UserRole.COORDINATOR, UserRole.TEACHER]
            if (!teacher.userCourse.some((uc) => validRoles.includes(uc.role))) {
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
