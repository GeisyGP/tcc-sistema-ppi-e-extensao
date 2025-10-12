import { Module } from "@nestjs/common"
import { PrismaModule } from "src/config/prisma.module"
import { CaslAbilityFactory } from "../casl/casl-ability.factory"
import { CustomLoggerService } from "src/common/logger"
import { GroupController } from "./controllers/group.controller"
import { GroupService } from "./services/group.service"
import { GroupRepository } from "./repositories/group-repository"
import { ProjectModule } from "../projects/project.module"
import { UserModule } from "../users/user.module"

@Module({
    imports: [PrismaModule, ProjectModule, UserModule],
    controllers: [GroupController],
    exports: [GroupService],
    providers: [GroupService, GroupRepository, CaslAbilityFactory, CustomLoggerService],
})
export class GroupModule {}
