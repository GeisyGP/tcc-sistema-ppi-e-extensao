import { Module } from "@nestjs/common"
import { UserModule } from "./modules/users/user.module"
import { AuthenticationModule } from "./modules/authentication/authentication.module"
import { PrismaModule } from "./config/prisma.module"
import { APP_GUARD } from "@nestjs/core"
import { AuthGuard } from "./modules/authentication/auth.guard"
import { CaslModule } from "./modules/casl/casl.module"
import { SubjectModule } from "./modules/subjects/subject.module"

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    imports: [
        PrismaModule,
        UserModule,
        AuthenticationModule,
        CaslModule,
        SubjectModule,
    ],
})
export class AppModule {}
