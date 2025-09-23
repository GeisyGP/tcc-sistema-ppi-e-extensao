import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from "@nestjs/common"
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { CustomLoggerService } from "src/common/logger"
import { RequestDto } from "src/modules/authentication/dtos/requests/request.dto"
import { CourseService } from "../services/course.service"
import { CourseResDto } from "../types/dtos/responses/course-res.dto"
import { CourseEntity } from "../types/entities/course.entity"
import { CreateCourseReqDto } from "../types/dtos/requests/create-course-req.dto"
import { GetAllCoursesReqDto } from "../types/dtos/requests/get-all-req.dto"
import { UpdateCourseParamsReqDto, UpdateCourseReqDto } from "../types/dtos/requests/update-course-req.dto"
import { GetByIdCourseReqDto } from "../types/dtos/requests/get-by-id-course-req.dto"
import { DeleteCourseReqDto } from "../types/dtos/requests/delete-course-req.dto"
import { UserRole } from "src/common/enums/user-role.enum"

@ApiTags("courses")
@Controller("courses")
export class CourseController {
    constructor(
        private readonly courseService: CourseService,
        private readonly loggerService: CustomLoggerService,
    ) {}

    @Post()
    @ApiCreatedResponse({
        type: CourseResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, CourseEntity))
    async create(@Body() dto: CreateCourseReqDto, @Request() request: RequestDto): Promise<BaseResDto<CourseResDto>> {
        this.loggerService.info(this.constructor.name, this.create.name, `user: ${request.user.sub}`)

        const course = await this.courseService.create(dto)

        return {
            message: "Course created successfully",
            data: course,
        }
    }

    @Get(":id")
    @ApiOkResponse({
        type: CourseResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CourseEntity))
    async getById(
        @Param() param: GetByIdCourseReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<CourseResDto>> {
        this.loggerService.info(this.constructor.name, this.getById.name, `user: ${request.user.sub}`)

        const course = await this.courseService.getById(param.id)

        return {
            message: "Course found successfully",
            data: course,
        }
    }

    @Get()
    @ApiOkResponse({
        type: PaginationResDto<CourseResDto[]>,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CourseEntity))
    async getAll(
        @Query() queryParams: GetAllCoursesReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<PaginationResDto<CourseResDto[]>>> {
        this.loggerService.info(this.constructor.name, this.getAll.name, `user: ${request.user.sub}`)

        const userCourses = request.user.mainRole === UserRole.SYSADMIN ? undefined : request.user.courses
        const response = await this.courseService.getAll(queryParams, userCourses)
        return {
            message: "Courses found successfully",
            data: response,
        }
    }

    @Put(":id")
    @ApiOkResponse({
        type: CourseResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, CourseEntity))
    async update(
        @Param() param: UpdateCourseParamsReqDto,
        @Body() dto: UpdateCourseReqDto,
        @Request() request: RequestDto,
    ): Promise<BaseResDto<CourseResDto>> {
        this.loggerService.info(this.constructor.name, this.update.name, `user: ${request.user.sub}`)

        const course = await this.courseService.updateById(param.id, dto)

        return {
            message: "Course updated successfully",
            data: course,
        }
    }

    @Delete(":id")
    @ApiNoContentResponse()
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, CourseEntity))
    async delete(@Param() param: DeleteCourseReqDto, @Request() request: RequestDto): Promise<void> {
        this.loggerService.info(this.constructor.name, this.delete.name, `user: ${request.user.sub}`)

        await this.courseService.deleteById(param.id)
    }
}
