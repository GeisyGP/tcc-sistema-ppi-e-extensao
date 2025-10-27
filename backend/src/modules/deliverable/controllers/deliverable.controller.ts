import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common"
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { CustomLoggerService } from "src/common/logger"
import { RequestDto } from "src/modules/authentication/types/dtos/requests/request.dto"
import { DeliverableService } from "../services/deliverable.service"
import { DeliverableResDto } from "../types/dtos/responses/deliverable-res.dto"
import { CreateDeliverableReqDto } from "../types/dtos/requests/create-deliverable-req.dto"
import { GetAllByProjectParamsReqDto, GetAllDeliverableReqDto } from "../types/dtos/requests/get-all-req.dto"
import { UpdateDeliverableReqDto } from "../types/dtos/requests/update-deliverable-req.dto"
import { GetByIdDeliverableReqDto } from "../types/dtos/requests/get-by-id-deliverable-req.dto"
import { DeleteDeliverableReqDto } from "../types/dtos/requests/delete-deliverable-req.dto"

@ApiTags("deliverables")
@Controller("deliverables")
export class DeliverableController {
    constructor(
        private readonly deliverableService: DeliverableService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    @Post("")
    @ApiOkResponse({
        type: DeliverableResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "DELIVERABLE"))
    async create(
        @Body() dto: CreateDeliverableReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<DeliverableResDto>> {
        this.loggerService.info(this.constructor.name, this.create.name, `user: ${request.user.sub}`)

        const response = await this.deliverableService.create(
            dto,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        return {
            message: "Deliverable created successfully",
            data: response,
        }
    }

    @Get(":id")
    @ApiOkResponse({
        type: DeliverableResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.ReadFull, "DELIVERABLE"))
    async getById(
        @Param() param: GetByIdDeliverableReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<DeliverableResDto>> {
        this.loggerService.info(this.constructor.name, this.getById.name, `user: ${request.user.sub}`)

        const response = await this.deliverableService.getById(param.id, request.user.mainCourseId)

        return {
            message: "Deliverable found successfully",
            data: response,
        }
    }

    @Get(":id/group/:groupId")
    @ApiOkResponse({
        type: DeliverableResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "DELIVERABLE"))
    async getByIdAndGroupId(
        @Param() param: GetByIdDeliverableReqDto,
        @Param("groupId") groupId: string,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<DeliverableResDto>> {
        this.loggerService.info(this.constructor.name, this.getByIdAndGroupId.name, `user: ${request.user.sub}`)

        const response = await this.deliverableService.getByIdAndGroupId(param.id, request.user.mainCourseId, groupId)

        return {
            message: "Deliverable found successfully",
            data: response,
        }
    }

    @Get("/project/:projectId")
    @ApiOkResponse({
        type: PaginationResDto<DeliverableResDto[]>,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "DELIVERABLE"))
    async getAllByProjectId(
        @Param() param: GetAllByProjectParamsReqDto,
        @Query() queryParams: GetAllDeliverableReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PaginationResDto<DeliverableResDto[]>>> {
        this.loggerService.info(this.constructor.name, this.getAllByProjectId.name, `user: ${request.user.sub}`)

        const response = await this.deliverableService.getAllByProjectId(
            param.projectId,
            queryParams,
            request.user.mainCourseId,
            request.user.mainRole,
        )
        return {
            message: "Deliverables found successfully",
            data: response,
        }
    }

    @Put(":id")
    @ApiOkResponse({
        type: DeliverableResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "DELIVERABLE"))
    async update(
        @Param() param: GetByIdDeliverableReqDto,
        @Body() dto: UpdateDeliverableReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<DeliverableResDto>> {
        this.loggerService.info(this.constructor.name, this.update.name, `user: ${request.user.sub}`)

        const response = await this.deliverableService.updateById(
            param.id,
            dto,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        return {
            message: "Deliverable updated successfully",
            data: response,
        }
    }

    @Delete(":id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "DELIVERABLE"))
    async delete(@Param() param: DeleteDeliverableReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.delete.name, `user: ${request.user.sub}`)

        await this.deliverableService.deleteById(
            param.id,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )
    }
}
