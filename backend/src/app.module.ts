import { Module } from "@nestjs/common"
import { UserModule } from "./modules/users/user.module"
import { AuthenticationModule } from "./modules/authentication/authentication.module"
import { PrismaModule } from "./config/prisma.module"
import { APP_GUARD } from "@nestjs/core"
import { AuthGuard } from "./modules/authentication/auth.guard"
import { RolesGuard } from "./common/guards/roles.guard"

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    imports: [PrismaModule, UserModule, AuthenticationModule],
})
export class AppModule {}
