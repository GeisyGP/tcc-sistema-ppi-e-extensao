import { Module } from "@nestjs/common"
import { PrismaModule } from "src/config/prisma.module"
import { CaslAbilityFactory } from "../casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { CourseController } from "./controllers/course.controller"
import { CourseService } from "./services/course.service"
import { CourseRepository } from "./repositories/course-repository"

@Module({
    imports: [PrismaModule],
    controllers: [CourseController],
    exports: [CourseService],
    providers: [CourseService, CourseRepository, CaslAbilityFactory, CustomLoggerService],
})
export class CourseModule {}
