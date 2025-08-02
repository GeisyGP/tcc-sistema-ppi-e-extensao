import { Body, Controller, Post } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { LoginReqDto } from "../dtos/requests/login-req.dto"
import { LoginResDto } from "../dtos/responses/login-res.dto"
import { AuthenticationService } from "../services/authentication.service"
import { Public } from "src/common/decorators/public.decorator"

@ApiTags()
@Controller()
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Post("/login")
    @Public()
    async login(@Body() body: LoginReqDto): Promise<LoginResDto> {
        return await this.authenticationService.login(body)
    }
}
