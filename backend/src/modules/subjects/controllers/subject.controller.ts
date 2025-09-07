import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { SubjectService } from "../services/subject.service"
import { CreateSubjectReqDto } from "../types/dtos/requests/create-subject-req.dto"
import { SubjectWithTeacherResDto } from "../types/dtos/responses/subject-with-teacher-res.dto"
import { GetByIdSubjectReqDto } from "../types/dtos/requests/get-by-id-subject.dto"
import { GetAllSubjectsReqDto } from "../types/dtos/requests/get-all-subjects-req.dto"
import { UpdateSubjectParamsReqDto, UpdateSubjectReqDto } from "../types/dtos/requests/update-subject-req.dto"
import { DeleteSubjectReqDto } from "../types/dtos/requests/delete-subject-req.dto"
import { SubjectEntity } from "../types/entities/subject.entity"
import { CustomLoggerService } from "src/common/logger"
import { RequestDto } from "src/modules/authentication/dtos/requests/request.dto"

@ApiTags("subjects")
@Controller("subjects")
export class SubjectController {
    constructor(
        private readonly subjectService: SubjectService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    @Post()
    @ApiCreatedResponse({
        type: SubjectWithTeacherResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, SubjectEntity))
    async create(
        @Body() dto: CreateSubjectReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<SubjectWithTeacherResDto>> {
        this.loggerService.info(this.constructor.name, this.create.name, `user: ${request.user.sub}`)

        const subject = await this.subjectService.create(dto, request.user.courseId)

        return {
            message: "Subject created successfully",
            data: subject,
        }
    }

    @Get(":id")
    @ApiOkResponse({
        type: SubjectWithTeacherResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, SubjectEntity))
    async getById(
        @Param() param: GetByIdSubjectReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<SubjectWithTeacherResDto>> {
        this.loggerService.info(this.constructor.name, this.getById.name, `user: ${request.user.sub}`)

        const subject = await this.subjectService.getById(param.id)

        return {
            message: "Subject found successfully",
            data: subject,
        }
    }

    @Get()
    @ApiOkResponse({
        type: PaginationResDto<SubjectWithTeacherResDto[]>,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, SubjectEntity))
    async getAll(
        @Query() queryParams: GetAllSubjectsReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PaginationResDto<SubjectWithTeacherResDto[]>>> {
        this.loggerService.info(this.constructor.name, this.getAll.name, `user: ${request.user.sub}`)

        const response = await this.subjectService.getAll(queryParams)
        return {
            message: "Subjects found successfully",
            data: response,
        }
    }

    @Put(":id")
    @ApiOkResponse({
        type: SubjectWithTeacherResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, SubjectEntity))
    async update(
        @Param() param: UpdateSubjectParamsReqDto,
        @Body() dto: UpdateSubjectReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<SubjectWithTeacherResDto>> {
        this.loggerService.info(this.constructor.name, this.update.name, `user: ${request.user.sub}`)

        const subject = await this.subjectService.updateById(param.id, dto)

        return {
            message: "Subject updated successfully",
            data: subject,
        }
    }

    @Delete(":id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, SubjectEntity))
    async delete(@Param() param: DeleteSubjectReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.delete.name, `user: ${request.user.sub}`)

        await this.subjectService.delete(param.id)
    }
}
