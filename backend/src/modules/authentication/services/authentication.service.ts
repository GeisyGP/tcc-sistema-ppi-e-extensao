import * as bcrypt from "bcryptjs"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { LoginReqDto } from "../dtos/requests/login-req.dto"
import { LoginResDto } from "../dtos/responses/login-res.dto"
import { JwtService } from "@nestjs/jwt"
import { UserService } from "../../users/services/user.service"
import { jwtConstants } from "src/common/constants"

@Injectable()
export class AuthenticationService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async login(dto: LoginReqDto): Promise<LoginResDto> {
        const user = await this.userService.getByRegistration({
            registration: dto.registration,
        })
        if (!user) {
            throw new UnauthorizedException()
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password)
        if (!passwordMatch) {
            throw new UnauthorizedException()
        }

        const payload = {
            sub: user.id,
            role: user.role,
            name: user.name,
            courseId: user.courseId,
        }
        return {
            accessToken: await this.jwtService.signAsync(payload),
            expiresIn: jwtConstants.expiresTime,
        }
    }
}
