import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UseGuards } from "@nestjs/common"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { PPIService } from "../services/ppi.service"
import { CreatePPIReqDto } from "../types/dtos/requests/create-ppi-req.dto"
import { GetByIdPPIReqDto } from "../types/dtos/requests/get-by-id-ppi.dto"
import { GetAllPPIsReqDto } from "../types/dtos/requests/get-all-ppis-req.dto"
import { UpdatePPIParamsReqDto, UpdatePPIReqDto } from "../types/dtos/requests/update-ppi-req.dto"
import { DeletePPIReqDto } from "../types/dtos/requests/delete-ppi-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { RequestDto } from "src/modules/authentication/dtos/requests/request.dto"
import { UpdateSubjectPPIReqDto } from "../types/dtos/requests/update-subject-ppi-req.dto"
import { PPIResDto } from "../types/dtos/responses/ppi-res.dto"

@ApiTags("ppis")
@Controller("ppis")
export class PPIController {
    constructor(
        private readonly ppiService: PPIService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    @Post()
    @ApiCreatedResponse({
        type: PPIResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "PPI"))
    async create(@Body() dto: CreatePPIReqDto, @Request() request: RequestDto): Promise<BaseResDto<PPIResDto>> {
        this.loggerService.info(this.constructor.name, this.create.name, `user: ${request.user.sub}`)

        const ppi = await this.ppiService.create(dto, request.user.mainCourseId)

        return {
            message: "PPI created successfully",
            data: ppi,
        }
    }

    @Get(":id")
    @ApiOkResponse({
        type: PPIResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "PPI"))
    async getById(@Param() param: GetByIdPPIReqDto, @Request() request: RequestDto): Promise<BaseResDto<PPIResDto>> {
        this.loggerService.info(this.constructor.name, this.getById.name, `user: ${request.user.sub}`)

        const ppi = await this.ppiService.getById(param.id, request.user.mainCourseId)

        return {
            message: "PPI found successfully",
            data: ppi,
        }
    }

    @Get()
    @ApiOkResponse({
        type: PaginationResDto<PPIResDto[]>,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, "PPI"))
    async getAll(
        @Query() queryParams: GetAllPPIsReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PaginationResDto<PPIResDto[]>>> {
        this.loggerService.info(this.constructor.name, this.getAll.name, `user: ${request.user.sub}`)

        const response = await this.ppiService.getAll(queryParams, request.user.mainCourseId)
        return {
            message: "PPI found successfully",
            data: response,
        }
    }

    @Put(":id")
    @ApiOkResponse({
        type: PPIResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "PPI"))
    async update(
        @Param() param: UpdatePPIParamsReqDto,
        @Body() dto: UpdatePPIReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PPIResDto>> {
        this.loggerService.info(this.constructor.name, this.update.name, `user: ${request.user.sub}`)

        const ppi = await this.ppiService.updateById(param.id, dto, request.user.mainCourseId)

        return {
            message: "PPI updated successfully",
            data: ppi,
        }
    }

    @Patch(":id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "PPI"))
    async updateSubjectPPIById(
        @Param() param: UpdatePPIParamsReqDto,
        @Body() dto: UpdateSubjectPPIReqDto,
        @Request() request: RequestDto,
    ): Promise<void> {
        this.loggerService.info(this.constructor.name, this.updateSubjectPPIById.name, `user: ${request.user.sub}`)

        await this.ppiService.updateSubjectPPIById(param.id, dto, request.user.mainCourseId)
    }

    @Delete(":id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "PPI"))
    async delete(@Param() param: DeletePPIReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.delete.name, `user: ${request.user.sub}`)

        await this.ppiService.delete(param.id, request.user.mainCourseId)
    }
}
