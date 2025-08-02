import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { jwtConstants } from "../../common/constants"
import { AuthenticationService } from "./services/authentication.service"
import { AuthenticationController } from "./controllers/authentication.controller"
import { UserModule } from "../users/user.module"

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expiresTime },
        }),
    ],
    providers: [AuthenticationService],
    controllers: [AuthenticationController],
    exports: [],
})
export class AuthenticationModule {}
