import {
    AbilityBuilder,
    createMongoAbility,
    ExtractSubjectType,
    InferSubjects,
    MongoAbility,
} from "@casl/ability"
import { Injectable } from "@nestjs/common"
import { Action } from "src/common/enums/action.enum"
import { UserRole } from "src/common/enums/user-role.enum"
import { UserEntity } from "../users/types/entities/user.entity"
import { UserRequestDto } from "../authentication/dtos/requests/request.dto"

type Subjects = InferSubjects<typeof UserEntity> | "all"

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: UserRequestDto) {
        const { can, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        )

        switch (user.role) {
            case UserRole.SYSADMIN: {
                can(Action.Update, UserEntity, { id: user.sub })
                can(Action.Manage, UserEntity)
                break
            }
            case UserRole.COORDINATOR: {
                can(Action.Read, "all")
                can(Action.Create, UserEntity)
                can(Action.Delete, UserEntity)
                can(Action.Update, UserEntity, { id: user.sub })
                break
            }
            case UserRole.TEACHER: {
                can(Action.Update, UserEntity, { id: user.sub })
                can(Action.Read, UserEntity)
                break
            }
            case UserRole.STUDENT: {
                can(Action.Update, UserEntity, { id: user.sub })
                can(Action.Read, UserEntity)
                break
            }
            default: {
                break
            }
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        })
    }
}
