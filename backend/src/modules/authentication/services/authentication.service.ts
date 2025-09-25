import * as bcrypt from "bcryptjs"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { LoginReqDto } from "../dtos/requests/login-req.dto"
import { LoginResDto } from "../dtos/responses/login-res.dto"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "../../users/services/user.service"
import { jwtConstants, ROOT_COURSE_ID } from "src/common/constants"

@Injectable()
export class AuthenticationService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async login(dto: LoginReqDto): Promise<LoginResDto> {
        const user = await this.userService.getByRegistration({ registration: dto.registration }, ROOT_COURSE_ID)
        if (!user) {
            throw new UnauthorizedException()
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password)
        if (!passwordMatch) {
            throw new UnauthorizedException()
        }

        const payload = {
            sub: user.id,
            name: user.name,
            courses: user.UserCourse.map((uc) => ({
                courseId: uc.courseId,
                role: uc.role,
                name: uc?.course?.name,
            })),
            mainCourseId: user.UserCourse[0].courseId,
            mainRole: user.UserCourse[0].role,
        }
        return {
            accessToken: await this.jwtService.signAsync(payload),
            expiresIn: jwtConstants.expiresTime,
        }
    }

    async selectCourse(courseId: string, userId: string): Promise<LoginResDto> {
        const user = await this.userService.getById(userId, ROOT_COURSE_ID)
        if (!user) {
            throw new UnauthorizedException()
        }

        const course = user.userCourse.find((uc) => uc.courseId == courseId)
        if (!course) {
            throw new UnauthorizedException()
        }

        const payload = {
            sub: user.id,
            name: user.name,
            courses: user.userCourse.map((uc) => ({
                courseId: uc.courseId,
                role: uc.role,
                name: uc?.name,
            })),
            mainCourseId: course.courseId,
            mainRole: course.role,
        }
        return {
            accessToken: await this.jwtService.signAsync(payload),
            expiresIn: jwtConstants.expiresTime,
        }
    }
}
