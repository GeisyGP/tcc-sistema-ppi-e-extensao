import { Module } from "@nestjs/common"
import { UserController } from "./controllers/user.controller"
import { UserService } from "./services/user.service"
import { UserRepository } from "./repositories/user.repository"
import { PrismaModule } from "src/config/prisma.module"

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule {}
