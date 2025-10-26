import { Module } from "@nestjs/common"
import { PrismaModule } from "src/config/prisma.module"
import { CaslAbilityFactory } from "../casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { GroupModule } from "../groups/group.module"
import { DeliverableModule } from "../deliverable/deliverable.module"
import { DeliverableContentController } from "./controllers/deliverable-content.controller"
import { DeliverableContentService } from "./services/deliverable-content.service"
import { DeliverableContentRepository } from "./repositories/deliverable-content.repository"

@Module({
    imports: [PrismaModule, GroupModule, DeliverableModule],
    controllers: [DeliverableContentController],
    exports: [DeliverableContentService],
    providers: [DeliverableContentService, DeliverableContentRepository, CaslAbilityFactory, CustomLoggerService],
})
export class DeliverableContentModule {}
