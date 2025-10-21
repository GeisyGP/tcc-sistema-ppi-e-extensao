import { Module } from "@nestjs/common"
import { PrismaModule } from "src/config/prisma.module"
import { CaslAbilityFactory } from "../casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { DeliverableController } from "./controllers/deliverable.controller"
import { DeliverableService } from "./services/deliverable.service"
import { DeliverableRepository } from "./repositories/deliverable-repository"
import { ProjectModule } from "../projects/project.module"

@Module({
    imports: [PrismaModule, ProjectModule],
    controllers: [DeliverableController],
    exports: [DeliverableService],
    providers: [DeliverableService, DeliverableRepository, CaslAbilityFactory, CustomLoggerService],
})
export class DeliverableModule {}
