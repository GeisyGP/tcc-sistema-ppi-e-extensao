import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UseGuards } from "@nestjs/common"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { GetByIdProjectReqDto } from "../types/dtos/requests/get-by-id-project.dto"
import { GetAllProjectsReqDto } from "../types/dtos/requests/get-all-projects-req.dto"
import { UpdateProjectParamsReqDto, UpdateProjectReqDto } from "../types/dtos/requests/update-project-req.dto"
import { DeleteProjectReqDto } from "../types/dtos/requests/delete-project-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { RequestDto } from "src/modules/authentication/types/dtos/requests/request.dto"
import { ProjectFullResDto, ProjectResDto } from "../types/dtos/responses/project-res.dto"
import { ProjectService } from "../services/project.service"
import { CreateProjectReqDto } from "../types/dtos/requests/create-project-req.dto"
import { UpdateProjectContentReqDto } from "../types/dtos/requests/update-project-content-req.dto"
import { ChangeStatusReqDto } from "../types/dtos/requests/change-status-req.dto"
import { ChangeVisibilityReqDto } from "../types/dtos/requests/change-visibility-req.dto"

@ApiTags("projects")
@Controller("projects")
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    @Post()
    @ApiCreatedResponse({
        type: ProjectResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "PROJECT"))
    async create(@Body() dto: CreateProjectReqDto, @Request() request: RequestDto): Promise<BaseResDto<ProjectResDto>> {
        this.loggerService.info(this.constructor.name, this.create.name, `user: ${request.user.sub}`)

        const response = await this.projectService.create(dto, request.user.mainCourseId, request.user.sub)

        return {
            message: "Project created successfully",
            data: response,
        }
    }

    @Get(":id/content")
    @ApiOkResponse({
        type: ProjectFullResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "PROJECT"))
    async getFullById(
        @Param() param: GetByIdProjectReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<ProjectFullResDto>> {
        this.loggerService.info(this.constructor.name, this.getFullById.name, `user: ${request.user.sub}`)

        const response = await this.projectService.getFullById(param.id, request.user.mainCourseId)

        return {
            message: "Project found successfully",
            data: response,
        }
    }

    @Get(":id")
    @ApiOkResponse({
        type: ProjectResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "PROJECT"))
    async getById(
        @Param() param: GetByIdProjectReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<ProjectResDto>> {
        this.loggerService.info(this.constructor.name, this.getById.name, `user: ${request.user.sub}`)

        const response = await this.projectService.getById(
            param.id,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        return {
            message: "Project found successfully",
            data: response,
        }
    }

    @Get()
    @ApiOkResponse({
        type: PaginationResDto<ProjectResDto[]>,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "PROJECT"))
    async getAll(
        @Query() queryParams: GetAllProjectsReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PaginationResDto<ProjectResDto[]>>> {
        this.loggerService.info(this.constructor.name, this.getAll.name, `user: ${request.user.sub}`)

        const response = await this.projectService.getAll(
            queryParams,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )
        return {
            message: "Project found successfully",
            data: response,
        }
    }

    @Put(":id")
    @ApiOkResponse({
        type: ProjectResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "PROJECT"))
    async update(
        @Param() param: UpdateProjectParamsReqDto,
        @Body() dto: UpdateProjectReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<ProjectResDto>> {
        this.loggerService.info(this.constructor.name, this.update.name, `user: ${request.user.sub}`)

        const response = await this.projectService.updateById(
            param.id,
            dto,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        return {
            message: "Project updated successfully",
            data: response,
        }
    }

    @Patch("content/:id")
    @ApiOkResponse({
        type: ProjectFullResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "PROJECT"))
    async updateContentByID(
        @Param() param: UpdateProjectParamsReqDto,
        @Body() dto: UpdateProjectContentReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<ProjectFullResDto>> {
        this.loggerService.info(this.constructor.name, this.updateContentByID.name, `user: ${request.user.sub}`)

        const response = await this.projectService.updateContentById(
            param.id,
            dto,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        return {
            message: "Project updated successfully",
            data: response,
        }
    }

    @Patch("status/:id")
    @ApiOkResponse({
        type: ProjectResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.ChangeStatus, "PROJECT"))
    async changeStatus(
        @Param() param: UpdateProjectParamsReqDto,
        @Body() dto: ChangeStatusReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<ProjectResDto>> {
        this.loggerService.info(this.constructor.name, this.changeStatus.name, `user: ${request.user.sub}`)

        const response = await this.projectService.changeStatus(
            param.id,
            dto,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        return {
            message: "Project updated successfully",
            data: response,
        }
    }

    @Patch("visibility/:id")
    @ApiOkResponse({
        type: ProjectResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.ChangeVisibility, "PROJECT"))
    async changeVisibility(
        @Param() param: UpdateProjectParamsReqDto,
        @Body() dto: ChangeVisibilityReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<ProjectResDto>> {
        this.loggerService.info(this.constructor.name, this.changeVisibility.name, `user: ${request.user.sub}`)

        const response = await this.projectService.changeVisibility(
            param.id,
            dto,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        return {
            message: "Project updated successfully",
            data: response,
        }
    }

    @Delete(":id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "PROJECT"))
    async delete(@Param() param: DeleteProjectReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.delete.name, `user: ${request.user.sub}`)

        await this.projectService.delete(param.id, request.user.mainCourseId, request.user.sub, request.user.mainRole)
    }
}
