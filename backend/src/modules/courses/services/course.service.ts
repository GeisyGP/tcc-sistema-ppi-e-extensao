import { Injectable } from "@nestjs/common"
import { CourseRepository } from "../repositories/course-repository"
import { CreateCourseReqDto } from "../types/dtos/requests/create-course-req.dto"
import { CourseResDto } from "../types/dtos/responses/course-res.dto"
import { CourseNotFoundException } from "src/common/exceptions/course-not-found.exception"
import { GetAllCoursesReqDto } from "../types/dtos/requests/get-all-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { CourseResBuilder } from "../builders/course-res.builder"
import { UpdateCourseReqDto } from "../types/dtos/requests/update-course-req.dto"

@Injectable()
export class CourseService {
    constructor(
        private readonly courseRepository: CourseRepository,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async create(dto: CreateCourseReqDto): Promise<CourseResDto> {
        try {
            const course = await this.courseRepository.create(dto)

            return CourseResBuilder.build(course)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.create.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getById(id: string): Promise<CourseResDto> {
        try {
            const course = await this.courseRepository.getById(id)
            if (!course) {
                throw new CourseNotFoundException()
            }

            return CourseResBuilder.build(course)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getById.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getAll(
        dto: GetAllCoursesReqDto,
        userCourses?: Array<{ courseId: string; role: string }>,
    ): Promise<PaginationResDto<CourseResDto[]>> {
        try {
            const { courses, totalItems } = await this.courseRepository.getAll(
                dto,
                userCourses?.map((uc) => uc.courseId),
            )

            return CourseResBuilder.buildMany(courses, dto.page, dto.limit, totalItems)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getAll.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async updateById(id: string, dto: UpdateCourseReqDto): Promise<CourseResDto> {
        try {
            await this.getById(id)

            const course = await this.courseRepository.updateById(id, dto)

            return CourseResBuilder.build(course)
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

    async deleteById(id: string): Promise<void> {
        try {
            await this.getById(id)

            await this.courseRepository.deleteById(id)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.deleteById.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }
}
