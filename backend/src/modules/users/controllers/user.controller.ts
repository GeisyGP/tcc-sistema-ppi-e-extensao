import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
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
import { ChangePasswordBodyReqDto, ChangePasswordParamReqDto } from "../types/dtos/requests/change-password-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { UserRole } from "src/common/enums/user-role.enum"
import { ROOT_COURSE_ID } from "src/common/constants"

@ApiTags("users")
@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    @Post("/teacher")
    @ApiCreatedResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "TEACHER"))
    async createTeacher(
        @Body() dto: CreateUserReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.createTeacher.name, `user: ${request.user.sub}`)

        const user = await this.userService.create(
            {
                ...dto,
                courseId: request.user.mainCourseId,
            },
            UserRole.TEACHER,
            ROOT_COURSE_ID,
        )

        return {
            message: "User created successfully",
            data: user,
        }
    }

    @Post("/coordinator")
    @ApiCreatedResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "COORDINATOR"))
    async createCoordinator(
        @Body() dto: CreateUserReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.createCoordinator.name, `user: ${request.user.sub}`)

        const user = await this.userService.create(dto, UserRole.COORDINATOR, request.user.mainCourseId)

        return {
            message: "User created successfully",
            data: user,
        }
    }

    @Post("/student")
    @ApiCreatedResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "STUDENT"))
    async createStudent(
        @Body() dto: CreateUserReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.createStudent.name, `user: ${request.user.sub}`)

        const user = await this.userService.create(
            {
                ...dto,
                courseId: request.user.mainCourseId,
            },
            UserRole.STUDENT,
            ROOT_COURSE_ID,
        )

        return {
            message: "User created successfully",
            data: user,
        }
    }

    @Post("/viewer")
    @ApiCreatedResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "VIEWER"))
    async createViewer(@Body() dto: CreateUserReqDto, @Request() request: RequestDto): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.createViewer.name, `user: ${request.user.sub}`)

        const user = await this.userService.create(
            {
                ...dto,
                courseId: request.user.mainCourseId,
            },
            UserRole.VIEWER,
            ROOT_COURSE_ID,
        )

        return {
            message: "User created successfully",
            data: user,
        }
    }

    @Get()
    @ApiOkResponse({
        type: PaginationResDto<UserResDto[]>,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
    async getAll(
        @Query() queryParams: GetAllUsersReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PaginationResDto<UserResDto[]>>> {
        this.loggerService.info(this.constructor.name, this.getAll.name, `user: ${request.user.sub}`)

        const response = await this.userService.getAll(queryParams, request.user.mainCourseId)
        return {
            message: "Users found successfully",
            data: response,
        }
    }

    @Get("/current")
    @ApiOkResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
    async getCurrent(@Request() request: RequestDto): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.getCurrent.name, `user: ${request.user.sub}`)

        const userId = request.user.sub
        const res = await this.userService.getById(userId, request.user.mainCourseId)

        return {
            message: "User found successfully",
            data: res,
        }
    }

    @Get(":id")
    @ApiOkResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
    async getById(@Param() param: GetUserByIdReqDto, @Request() request: RequestDto): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.getById.name, `user: ${request.user.sub}`)

        const user = await this.userService.getById(param.id, request.user.mainCourseId)

        return {
            message: "User found successfully",
            data: user,
        }
    }

    @Delete("/coordinator/:id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "COORDINATOR"))
    async deleteCoordinator(@Param() param: GetUserByIdReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.deleteCoordinator.name, `user: ${request.user.sub}`)

        await this.userService.delete(param.id, request.user.mainCourseId)
    }

    @Delete("/teacher/:id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "TEACHER"))
    async deleteTeacher(@Param() param: GetUserByIdReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.deleteTeacher.name, `user: ${request.user.sub}`)

        await this.userService.removeFromCourse(param.id, request.user.mainCourseId)
    }

    @Delete("/student/:id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "STUDENT"))
    async deleteStudent(@Param() param: GetUserByIdReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.deleteStudent.name, `user: ${request.user.sub}`)

        await this.userService.delete(param.id, request.user.mainCourseId)
    }

    @Delete("/viewer/:id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "VIEWER"))
    async deleteViewer(@Param() param: GetUserByIdReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.deleteViewer.name, `user: ${request.user.sub}`)

        await this.userService.removeFromCourse(param.id, request.user.mainCourseId)
    }

    @Patch(":id")
    @ApiOkResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, UserEntity))
    async update(
        @Request() request: RequestDto,
        @Param() param: ChangePasswordParamReqDto,
        @Body() dto: ChangePasswordBodyReqDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.update.name, `user: ${request.user.sub}`)

        const user = await this.userService.update(param.id, dto, request.user, request.user.mainCourseId)
        return {
            message: "User updated successfully",
            data: user,
        }
    }
}
