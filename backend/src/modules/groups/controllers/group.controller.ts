import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { CustomLoggerService } from "src/common/logger"
import { RequestDto } from "src/modules/authentication/types/dtos/requests/request.dto"
import { GroupService } from "../services/group.service"
import { GroupResDto } from "../types/dtos/responses/group-res.dto"
import { CreateGroupReqDto } from "../types/dtos/requests/create-group-req.dto"
import { GetAllGroupsParamsReqDto, GetAllGroupsReqDto } from "../types/dtos/requests/get-all-req.dto"
import { UpdateGroupParamsReqDto, UpdateGroupReqDto } from "../types/dtos/requests/update-group-req.dto"
import { GetByIdGroupReqDto } from "../types/dtos/requests/get-by-id-group-req.dto"
import { DeleteGroupReqDto } from "../types/dtos/requests/delete-group-req.dto"

@ApiTags("groups")
@Controller("groups")
export class GroupController {
    constructor(
        private readonly groupService: GroupService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    @Post()
    @ApiCreatedResponse({
        type: GroupResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "GROUP"))
    async create(@Body() dto: CreateGroupReqDto, @Request() request: RequestDto): Promise<BaseResDto<GroupResDto>> {
        this.loggerService.info(this.constructor.name, this.create.name, `user: ${request.user.sub}`)

        const group = await this.groupService.create(dto, request.user.mainCourseId)

        return {
            message: "Group created successfully",
            data: group,
        }
    }

    @Get(":id")
    @ApiOkResponse({
        type: GroupResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "GROUP"))
    async getById(
        @Param() param: GetByIdGroupReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<GroupResDto>> {
        this.loggerService.info(this.constructor.name, this.getById.name, `user: ${request.user.sub}`)

        const group = await this.groupService.getById(param.id, request.user.mainCourseId)

        return {
            message: "Group found successfully",
            data: group,
        }
    }

    @Get("/project/:projectId")
    @ApiOkResponse({
        type: PaginationResDto<GroupResDto[]>,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "GROUP"))
    async getAllByProjectId(
        @Param() param: GetAllGroupsParamsReqDto,
        @Query() queryParams: GetAllGroupsReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PaginationResDto<GroupResDto[]>>> {
        this.loggerService.info(this.constructor.name, this.getAllByProjectId.name, `user: ${request.user.sub}`)

        const response = await this.groupService.getAllByProjectId(
            param.projectId,
            queryParams,
            request.user.mainCourseId,
        )
        return {
            message: "Groups found successfully",
            data: response,
        }
    }

    @Put(":id")
    @ApiOkResponse({
        type: GroupResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "GROUP"))
    async update(
        @Param() param: UpdateGroupParamsReqDto,
        @Body() dto: UpdateGroupReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<GroupResDto>> {
        this.loggerService.info(this.constructor.name, this.update.name, `user: ${request.user.sub}`)

        const group = await this.groupService.updateById(param.id, dto, request.user.mainCourseId)

        return {
            message: "Group updated successfully",
            data: group,
        }
    }

    @Delete(":id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "GROUP"))
    async delete(@Param() param: DeleteGroupReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.delete.name, `user: ${request.user.sub}`)

        await this.groupService.deleteById(param.id, request.user.mainCourseId)
    }
}
