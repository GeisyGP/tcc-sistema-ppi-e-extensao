import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { UserService } from "../services/user.service"
import { CreateUserReqDto } from "../types/dtos/requests/create-user-req.dto"
import { UserResDto } from "../types/dtos/responses/user-res.dto"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { GetUserByIdReqDto } from "../types/dtos/requests/get-by-id-req.dto"
import { GetAllUsersReqDto } from "../types/dtos/requests/get-all-users-req.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { RequestDto } from "src/modules/authentication/dtos/requests/request.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { UserEntity } from "../types/entities/user.entity"
import {
    ChangePasswordBodyReqDto,
    ChangePasswordParamReqDto,
} from "../types/dtos/requests/change-password-req.dto"
import { CustomLoggerService } from "src/common/logger"

@ApiTags("users")
@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    @Post()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Create, UserEntity),
    )
    async create(
        @Body() dto: CreateUserReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(
            this.constructor.name,
            this.create.name,
            `user: ${request.user.sub}`,
        )

        const user = await this.userService.create(dto)

        return {
            message: "User created successfully",
            data: user,
        }
    }

    @Get()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Read, UserEntity),
    )
    async getAll(
        @Query() queryParams: GetAllUsersReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PaginationResDto<UserResDto[]>>> {
        this.loggerService.info(
            this.constructor.name,
            this.getAll.name,
            `user: ${request.user.sub}`,
        )

        const response = await this.userService.getAll(queryParams)
        return {
            message: "Users found successfully",
            data: response,
        }
    }

    @Get("/current")
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Read, UserEntity),
    )
    async getCurrent(
        @Request() request: RequestDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(
            this.constructor.name,
            this.getCurrent.name,
            `user: ${request.user.sub}`,
        )

        const userId = request.user.sub
        const res = await this.userService.getById(userId)

        return {
            message: "User found successfully",
            data: res,
        }
    }

    @Get(":id")
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Read, UserEntity),
    )
    async getById(
        @Param() param: GetUserByIdReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(
            this.constructor.name,
            this.getById.name,
            `user: ${request.user.sub}`,
        )

        const user = await this.userService.getById(param.id)

        return {
            message: "User found successfully",
            data: user,
        }
    }

    @Delete(":id")
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Delete, UserEntity),
    )
    async delete(
        @Param() param: GetUserByIdReqDto,
        @Request() request: RequestDto,
    ): Promise<void> {
        this.loggerService.info(
            this.constructor.name,
            this.delete.name,
            `user: ${request.user.sub}`,
        )

        await this.userService.delete(param.id)
    }

    @Patch(":id")
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) =>
        ability.can(Action.Update, UserEntity),
    )
    async update(
        @Request() request: RequestDto,
        @Param() param: ChangePasswordParamReqDto,
        @Body() dto: ChangePasswordBodyReqDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(
            this.constructor.name,
            this.update.name,
            `user: ${request.user.sub}`,
        )

        const user = await this.userService.update(param.id, dto, request.user)
        return {
            message: "User updated successfully",
            data: user,
        }
    }
}
