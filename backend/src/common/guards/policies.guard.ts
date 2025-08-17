import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import {
    AppAbility,
    CaslAbilityFactory,
} from "src/modules/casl/casl-ability.factory"
import { CHECK_POLICIES_KEY } from "../decorators/check-policies.decorator"
import { RequestDto } from "src/modules/authentication/dtos/requests/request.dto"

interface IPolicyHandler {
    handle(ability: AppAbility): boolean
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const policyHandlers =
            this.reflector.get<PolicyHandler[]>(
                CHECK_POLICIES_KEY,
                context.getHandler(),
            ) || []

        const request: RequestDto = context.switchToHttp().getRequest()
        const ability = this.caslAbilityFactory.createForUser(request.user)

        return policyHandlers.every((handler) =>
            this.execPolicyHandler(handler, ability),
        )
    }

    private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
        if (typeof handler === "function") {
            return handler(ability)
        }
        return handler.handle(ability)
    }
}
