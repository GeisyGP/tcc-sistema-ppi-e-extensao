import { Body, Controller, Patch, Post, Request, UseGuards } from "@nestjs/common"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { LoginReqDto } from "../dtos/requests/login-req.dto"
import { LoginResDto } from "../dtos/responses/login-res.dto"
import { AuthenticationService } from "../services/authentication.service"
import { Public } from "src/common/decorators/public.decorator"
import { RequestDto } from "../dtos/requests/request.dto"
import { SelectCourseReqDto } from "../dtos/requests/select-course-req.dto"
import { PoliciesGuard } from "src/common/guards/policies.guard"
import { CheckPolicies } from "src/common/decorators/check-policies.decorator"
import { AppAbility } from "src/modules/casl/casl-ability.factory"
import { Action } from "src/common/enums/action.enum"
import { CourseEntity } from "src/modules/courses/types/entities/course.entity"

@ApiTags()
@Controller()
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) {}

    @Post("/login")
    @ApiOkResponse({
        type: LoginResDto,
    })
    @Public()
    async login(@Body() body: LoginReqDto): Promise<LoginResDto> {
        return await this.authenticationService.login(body)
    }

    @Patch("/select-course")
    @ApiOkResponse({
        type: LoginResDto,
    })
    @UseGuards(PoliciesGuard)
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, CourseEntity))
    async selectCourse(@Request() request: RequestDto, @Body() body: SelectCourseReqDto): Promise<LoginResDto> {
        const userId = request.user.sub

        return await this.authenticationService.selectCourse(body.courseId, userId)
    }
}
