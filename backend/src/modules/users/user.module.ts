import { Module } from "@nestjs/common"
import { UserController } from "./controllers/user.controller"
import { UserService } from "./services/user.service"
import { UserRepository } from "./repositories/user.repository"
import { PrismaModule } from "src/config/prisma.module"
import { CaslAbilityFactory } from "../casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { CourseModule } from "../courses/course.module"

@Module({
    imports: [PrismaModule, CourseModule],
    controllers: [UserController],
    providers: [UserService, UserRepository, CaslAbilityFactory, CustomLoggerService],
    exports: [UserService],
})
export class UserModule {}
