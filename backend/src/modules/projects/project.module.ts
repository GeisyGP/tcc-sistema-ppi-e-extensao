import { Module } from "@nestjs/common"
import { PrismaModule } from "src/config/prisma.module"
import { CaslAbilityFactory } from "../casl/casl-ability.factory"
import { ProjectController } from "./controllers/project.controller"
import { CustomLoggerService } from "src/common/logger"
import { SubjectModule } from "../subjects/subject.module"
import { ProjectService } from "./services/project.service"
import { ProjectRepository } from "./repositories/project.repository"
import { PPIModule } from "../ppis/ppi.module"

@Module({
    imports: [PrismaModule, SubjectModule, PPIModule],
    controllers: [ProjectController],
    providers: [ProjectService, ProjectRepository, CaslAbilityFactory, CustomLoggerService],
})
export class ProjectModule {}
