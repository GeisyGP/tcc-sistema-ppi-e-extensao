import { Module } from "@nestjs/common"
import { PrismaModule } from "src/config/prisma.module"
import { CaslAbilityFactory } from "../casl/casl-ability.factory"
import { SubjectController } from "./controllers/subject.controller"
import { SubjectService } from "./services/subject.service"
import { SubjectRepository } from "./repositories/subject.repository"
import { UserModule } from "../users/user.module"
import { CustomLoggerService } from "src/common/logger"

@Module({
    imports: [PrismaModule, UserModule],
    controllers: [SubjectController],
    providers: [SubjectService, SubjectRepository, CaslAbilityFactory, CustomLoggerService],
    exports: [SubjectService],
})
export class SubjectModule {}
