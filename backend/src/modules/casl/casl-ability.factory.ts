import { AbilityBuilder, createMongoAbility, ExtractSubjectType, InferSubjects, MongoAbility } from "@casl/ability"
import { Injectable } from "@nestjs/common"
import { Action } from "src/common/enums/action.enum"
import { UserRole } from "src/common/enums/user-role.enum"
import { UserEntity } from "../users/types/entities/user.entity"
import { UserRequestDto } from "../authentication/types/dtos/requests/request.dto"
import { SubjectEntity } from "../subjects/types/entities/subject.entity"
import { CourseEntity } from "../courses/types/entities/course.entity"

type Subjects =
    | InferSubjects<
          | typeof UserEntity
          | typeof SubjectEntity
          | typeof CourseEntity
          | "TEACHER"
          | "COORDINATOR"
          | "STUDENT"
          | "VIEWER"
          | "PPI"
          | "PROJECT"
      >
    | "all"

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: UserRequestDto) {
        const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

        switch (user.mainRole) {
            case UserRole.SYSADMIN: {
                can(Action.Update, UserEntity, { id: user.sub })
                can(Action.Manage, CourseEntity)
                can(Action.Read, UserEntity)
                can(Action.Create, "COORDINATOR")
                can(Action.Update, "COORDINATOR")
                can(Action.Delete, "COORDINATOR")
                can(Action.Update, "TEACHER")
                can(Action.ChangeRole, UserEntity)
                break
            }
            case UserRole.COORDINATOR: {
                can(Action.Read, "all")
                can(Action.Update, UserEntity, { id: user.sub })
                can(Action.Manage, SubjectEntity)
                can(Action.Create, "TEACHER")
                can(Action.Create, "VIEWER")
                can(Action.Create, "STUDENT")
                can(Action.Delete, "TEACHER")
                can(Action.Delete, "VIEWER")
                can(Action.Delete, "STUDENT")
                can(Action.Update, "TEACHER")
                can(Action.Update, "VIEWER")
                can(Action.Update, "STUDENT")
                can(Action.Update, "COORDINATOR")
                can(Action.Manage, "PPI")
                can(Action.Manage, "PROJECT")
                break
            }
            case UserRole.TEACHER: {
                can(Action.Update, UserEntity, { id: user.sub })
                can(Action.Read, UserEntity)
                can(Action.Read, SubjectEntity)
                can(Action.Read, CourseEntity)
                can(Action.Create, "STUDENT")
                can(Action.Delete, "STUDENT")
                can(Action.Update, "STUDENT")
                can(Action.Read, "PPI")
                can(Action.Create, "PROJECT")
                can(Action.Update, "PROJECT")
                can(Action.Read, "PROJECT")
                can(Action.ChangeStatus, "PROJECT")
                can(Action.Delete, "PROJECT")
                break
            }
            case UserRole.STUDENT: {
                can(Action.Update, UserEntity, { id: user.sub })
                can(Action.Read, UserEntity)
                can(Action.Read, SubjectEntity)
                can(Action.Read, CourseEntity)
                can(Action.Read, "PROJECT")
                break
            }
            case UserRole.VIEWER: {
                can(Action.Read, UserEntity)
                can(Action.Read, CourseEntity)
                can(Action.Read, SubjectEntity)
                can(Action.Read, "PROJECT")
                break
            }
            default: {
                break
            }
        }

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        })
    }
}
