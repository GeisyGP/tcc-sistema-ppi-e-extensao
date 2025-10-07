import { Injectable } from "@nestjs/common"
import { CreatePPIReqDto } from "../types/dtos/requests/create-ppi-req.dto"
import { PPIRepository } from "../repositories/ppi.repository"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { GetAllPPIsReqDto } from "../types/dtos/requests/get-all-ppis-req.dto"
import { UpdatePPIReqDto } from "../types/dtos/requests/update-ppi-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { PPIResDto } from "../types/dtos/responses/ppi-res.dto"
import { SubjectService } from "src/modules/subjects/services/subject.service"
import { PPIResBuilder } from "../builders/ppi-res.builder"
import { PPINotFoundException } from "src/common/exceptions/ppi-not-found.exception"
import { UpdateSubjectPPIReqDto } from "../types/dtos/requests/update-subject-ppi-req.dto"

@Injectable()
export class PPIService {
    constructor(
        private readonly ppiRepository: PPIRepository,
        private readonly subjectService: SubjectService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    async create(dto: CreatePPIReqDto, currentCourseId: string): Promise<PPIResDto> {
        try {
            for (const subject of dto.subjects) {
                await this.subjectService.getById(subject.id, currentCourseId)
            }

            const ppi = await this.ppiRepository.create(dto, currentCourseId)

            return PPIResBuilder.build(ppi)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.create.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getById(id: string, currentCourseId: string): Promise<PPIResDto> {
        try {
            const ppi = await this.ppiRepository.getById(id, currentCourseId)
            if (!ppi) {
                throw new PPINotFoundException()
            }

            return PPIResBuilder.build(ppi)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getById.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async getAll(dto: GetAllPPIsReqDto, currentCourseId: string): Promise<PaginationResDto<PPIResDto[]>> {
        try {
            const { ppis, totalItems } = await this.ppiRepository.getAll(dto, currentCourseId)

            return PPIResBuilder.buildMany(ppis, dto.page, dto.limit, totalItems)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.getAll.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }

    async updateById(id: string, dto: UpdatePPIReqDto, currentCourseId: string): Promise<PPIResDto> {
        try {
            await this.getById(id, currentCourseId)
            const ppi = await this.ppiRepository.updateById(id, dto, currentCourseId)
            return PPIResBuilder.build(ppi)
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

    async updateSubjectPPIById(id: string, dto: UpdateSubjectPPIReqDto, currentCourseId: string): Promise<void> {
        try {
            for (const subject of dto.subjects) {
                await this.subjectService.getById(subject.id, currentCourseId)
            }
            await this.ppiRepository.updateSubjectPPIById(id, dto, currentCourseId)
        } catch (error) {
            this.loggerService.error(
                this.constructor.name,
                this.updateSubjectPPIById.name,
                `error: ${error.message}`,
                error.stack,
            )
            throw error
        }
    }

    async delete(id: string, currentCourseId: string): Promise<void> {
        try {
            await this.getById(id, currentCourseId)
            await this.ppiRepository.deleteById(id, currentCourseId)
        } catch (error) {
            this.loggerService.error(this.constructor.name, this.delete.name, `error: ${error.message}`, error.stack)
            throw error
        }
    }
}
