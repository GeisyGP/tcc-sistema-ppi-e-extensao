import { Module } from "@nestjs/common"
import { PrismaModule } from "src/config/prisma.module"
import { CaslAbilityFactory } from "../casl/casl-ability.factory"
import { PPIController } from "./controllers/ppi.controller"
import { PPIService } from "./services/ppi.service"
import { PPIRepository } from "./repositories/ppi.repository"
import { CustomLoggerService } from "src/common/logger"
import { SubjectModule } from "../subjects/subject.module"

@Module({
    imports: [PrismaModule, SubjectModule],
    controllers: [PPIController],
    providers: [PPIService, PPIRepository, CaslAbilityFactory, CustomLoggerService],
})
export class PPIModule {}
