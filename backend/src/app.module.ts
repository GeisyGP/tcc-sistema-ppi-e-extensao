import { Module } from "@nestjs/common"
import { UserModule } from "./modules/users/user.module"
import { AuthenticationModule } from "./modules/authentication/authentication.module"
import { PrismaModule } from "./config/prisma.module"
import { APP_GUARD } from "@nestjs/core"
import { AuthGuard } from "./modules/authentication/auth.guard"
import { CaslModule } from "./modules/casl/casl.module"
import { SubjectModule } from "./modules/subjects/subject.module"
import { CourseModule } from "./modules/courses/course.module"
import { PPIModule } from "./modules/ppis/ppi.module"
import { ProjectModule } from "./modules/projects/project.module"

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
        CourseModule,
        PPIModule,
        ProjectModule,
    ],
})
export class AppModule {}
