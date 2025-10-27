import { forwardRef, Module } from "@nestjs/common"
import { PrismaModule } from "src/config/prisma.module"
import { CaslAbilityFactory } from "../casl/casl-ability.factory"
import { ProjectController } from "./controllers/project.controller"
import { CustomLoggerService } from "src/common/logger"
import { SubjectModule } from "../subjects/subject.module"
import { ProjectService } from "./services/project.service"
import { ProjectRepository } from "./repositories/project.repository"
import { PPIModule } from "../ppis/ppi.module"
import { DeliverableModule } from "../deliverable/deliverable.module"

@Module({
    imports: [PrismaModule, SubjectModule, PPIModule, forwardRef(() => DeliverableModule)],
    controllers: [ProjectController],
    exports: [ProjectService],
    providers: [ProjectService, ProjectRepository, CaslAbilityFactory, CustomLoggerService],
})
export class ProjectModule {}
