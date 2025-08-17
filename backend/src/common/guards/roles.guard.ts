import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ROLES_KEY } from "src/common/decorators/role.decorator"
import { UserRole } from "src/common/enums/user-role.enum"
import { RequestDto } from "src/modules/authentication/dtos/requests/request.dto"

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        )
        if (!requiredRoles) {
            return true
        }
        const request: RequestDto = context.switchToHttp().getRequest()
        return requiredRoles.some((role) => request.user.role?.includes(role))
    }
}
