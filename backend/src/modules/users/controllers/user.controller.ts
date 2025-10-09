import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    Patch,
    Post,
    Put,
    Query,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { UserService } from "../services/user.service"
import { CreateUserCoordinatorReqDto, CreateUserReqDto } from "../types/dtos/requests/create-user-req.dto"
import { UserResDto } from "../types/dtos/responses/user-res.dto"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { GetUserByIdReqDto } from "../types/dtos/requests/get-by-id-req.dto"
import { GetAllUsersReqDto } from "../types/dtos/requests/get-all-users-req.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { RequestDto } from "src/modules/authentication/types/dtos/requests/request.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { UserEntity } from "../types/entities/user.entity"
import { ChangePasswordBodyReqDto, ChangePasswordParamReqDto } from "../types/dtos/requests/change-password-req.dto"
import { CustomLoggerService } from "src/common/logger"
import { UserRole } from "src/common/enums/user-role.enum"
import { ONE_MB_IN_BYTES, ROOT_COURSE_ID } from "src/common/constants"
import { ChangeRoleBodyReqDto, ChangeRoleParamReqDto } from "../types/dtos/requests/change-role-req.dto"
import { FileInterceptor } from "@nestjs/platform-express"
import { UpdateByIdBodyReqDto, UpdateByIdParamReqDto } from "../types/dtos/requests/update-by-id-req.dto"

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
        @Body() dto: CreateUserCoordinatorReqDto,
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

    @Put("/coordinator/:id")
    @ApiOkResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "COORDINATOR"))
    async updateCoordinatorById(
        @Request() request: RequestDto,
        @Param() param: UpdateByIdParamReqDto,
        @Body() dto: UpdateByIdBodyReqDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.updateCoordinatorById.name, `user: ${request.user.sub}`)

        const user = await this.userService.updateById(param.id, dto, request.user.mainCourseId)
        return {
            message: "User updated successfully",
            data: user,
        }
    }

    @Put("/teacher/:id")
    @ApiOkResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "TEACHER"))
    async updateTeacherById(
        @Request() request: RequestDto,
        @Param() param: UpdateByIdParamReqDto,
        @Body() dto: UpdateByIdBodyReqDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.updateTeacherById.name, `user: ${request.user.sub}`)

        const user = await this.userService.updateById(param.id, dto, request.user.mainCourseId)
        return {
            message: "User updated successfully",
            data: user,
        }
    }

    @Put("/student/:id")
    @ApiOkResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "STUDENT"))
    async updateStudentById(
        @Request() request: RequestDto,
        @Param() param: UpdateByIdParamReqDto,
        @Body() dto: UpdateByIdBodyReqDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.updateStudentById.name, `user: ${request.user.sub}`)

        const user = await this.userService.updateById(param.id, dto, request.user.mainCourseId)
        return {
            message: "User updated successfully",
            data: user,
        }
    }

    @Put("/viewer/:id")
    @ApiOkResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "VIEWER"))
    async updateViewerById(
        @Request() request: RequestDto,
        @Param() param: UpdateByIdParamReqDto,
        @Body() dto: UpdateByIdBodyReqDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.updateViewerById.name, `user: ${request.user.sub}`)

        const user = await this.userService.updateById(param.id, dto, request.user.mainCourseId)
        return {
            message: "User updated successfully",
            data: user,
        }
    }

    @Patch(":id/password")
    @ApiOkResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, UserEntity))
    async changePassword(
        @Request() request: RequestDto,
        @Param() param: ChangePasswordParamReqDto,
        @Body() dto: ChangePasswordBodyReqDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.changePassword.name, `user: ${request.user.sub}`)

        const user = await this.userService.changePassword(param.id, dto, request.user, request.user.mainCourseId)
        return {
            message: "User updated successfully",
            data: user,
        }
    }

    @Patch(":userId/role")
    @ApiOkResponse({
        type: UserResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.ChangeRole, UserEntity))
    async changeUserRole(
        @Param() param: ChangeRoleParamReqDto,
        @Body() body: ChangeRoleBodyReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<UserResDto>> {
        this.loggerService.info(this.constructor.name, this.changeUserRole.name, `user: ${request.user.sub}`)

        const user = await this.userService.changeUserRole(param.userId, body, request.user.mainCourseId)

        return {
            message: "User updated successfully",
            data: user,
        }
    }

    @Post("/many")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "STUDENT"))
    @UseInterceptors(FileInterceptor("file"))
    async createUserStudentByCsv(
        @Request() request: RequestDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /(text\/csv|text\/plain)/,
                    skipMagicNumbersValidation: true,
                })
                .addMaxSizeValidator({
                    maxSize: ONE_MB_IN_BYTES,
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
        file: Express.Multer.File,
    ) {
        this.loggerService.info(this.constructor.name, this.createUserStudentByCsv.name, `user: ${request.user.sub}`)

        await this.userService.createUserStudentByCsv(file, request.user.mainCourseId)
    }
}
