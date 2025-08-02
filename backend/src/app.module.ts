import { Module } from "@nestjs/common"
import { UserModule } from "./modules/users/user.module"
import { AuthenticationModule } from "./modules/authentication/authentication.module"
import { PrismaModule } from "./config/prisma.module"

@Module({
    imports: [PrismaModule, UserModule, AuthenticationModule],
})
export class AppModule {}
