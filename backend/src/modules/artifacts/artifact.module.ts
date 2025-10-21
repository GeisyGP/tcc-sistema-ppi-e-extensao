import { Module } from "@nestjs/common"
import { PrismaModule } from "src/config/prisma.module"
import { CaslAbilityFactory } from "../casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { ArtifactController } from "./controllers/artifact.controller"
import { ArtifactService } from "./services/artifact.service"
import { ArtifactRepository } from "./repositories/artifact-repository"
import { ProjectModule } from "../projects/project.module"
import { GroupModule } from "../groups/group.module"
import { DeliverableModule } from "../deliverable/deliverable.module"

@Module({
    imports: [PrismaModule, ProjectModule, GroupModule, DeliverableModule],
    controllers: [ArtifactController],
    providers: [ArtifactService, ArtifactRepository, CaslAbilityFactory, CustomLoggerService],
})
export class ArtifactModule {}
