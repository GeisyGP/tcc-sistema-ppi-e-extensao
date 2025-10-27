import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common"
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { CustomLoggerService } from "src/common/logger"
import { RequestDto } from "src/modules/authentication/types/dtos/requests/request.dto"
import { DeliverableContentService } from "../services/deliverable-content.service"
import { DeliverableContentResDto } from "../types/dtos/responses/deliverable-content-res.dto"
import { CreateContentReqDto } from "../types/dtos/requests/create-content-req.dto"
import { UpdateContentReqDto } from "../types/dtos/requests/update-content-req.dto"
import { GetByIdContentReqDto } from "../types/dtos/requests/get-by-id-req.dto"

@ApiTags("deliverable-contents")
@Controller("deliverable-contents")
export class DeliverableContentController {
    constructor(
        private readonly deliverableContent: DeliverableContentService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    @Post()
    @ApiOkResponse({
        type: DeliverableContentResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "DELIVERABLE-CONTENT"))
    async create(
        @Body() dto: CreateContentReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<DeliverableContentResDto>> {
        this.loggerService.info(this.constructor.name, this.create.name, `user: ${request.user.sub}`)

        const response = await this.deliverableContent.create(dto, request.user.mainCourseId, request.user.sub)

        return {
            message: "Deliverable content created successfully",
            data: response,
        }
    }

    @Get(":id")
    @ApiOkResponse({
        type: DeliverableContentResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "DELIVERABLE-CONTENT"))
    async getById(
        @Param() param: GetByIdContentReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<DeliverableContentResDto>> {
        this.loggerService.info(this.constructor.name, this.getById.name, `user: ${request.user.sub}`)

        const response = await this.deliverableContent.getById(
            param.id,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        return {
            message: "Deliverable content found successfully",
            data: response,
        }
    }

    @Put(":id")
    @ApiOkResponse({
        type: DeliverableContentResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "DELIVERABLE-CONTENT"))
    async update(
        @Param() param: GetByIdContentReqDto,
        @Body() dto: UpdateContentReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<DeliverableContentResDto>> {
        this.loggerService.info(this.constructor.name, this.update.name, `user: ${request.user.sub}`)

        const response = await this.deliverableContent.updateById(
            param.id,
            dto,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )

        return {
            message: "Deliverable content updated successfully",
            data: response,
        }
    }

    @Delete(":id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "DELIVERABLE-CONTENT"))
    async delete(@Param() param: GetByIdContentReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.delete.name, `user: ${request.user.sub}`)

        await this.deliverableContent.deleteById(
            param.id,
            request.user.mainCourseId,
            request.user.sub,
            request.user.mainRole,
        )
    }
}
