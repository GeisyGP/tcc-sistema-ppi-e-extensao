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
          | "GROUP"
          | "ARTIFACT"
          | "DELIVERABLE"
          | "DELIVERABLE-CONTENT"
      >
    | "all"

export type AppAbility = MongoAbility<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: UserRequestDto) {
        const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

        switch (user.mainRole) {
            case UserRole.SYSADMIN: {
                can(Action.ChangePassword, UserEntity)
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
                can(Action.ChangePassword, UserEntity)
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
                can(Action.Manage, "GROUP")
                can(Action.Create, "DELIVERABLE")
                can(Action.Update, "DELIVERABLE")
                can(Action.Delete, "DELIVERABLE")
                can(Action.ReadFull, "DELIVERABLE")
                can(Action.Create, "ARTIFACT")
                can(Action.UploadFile, "ARTIFACT")
                can(Action.Update, "ARTIFACT")
                can(Action.Delete, "ARTIFACT")
                can(Action.Read, "DELIVERABLE-CONTENT")
                break
            }
            case UserRole.TEACHER: {
                can(Action.ChangePassword, UserEntity, { id: user.sub })
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
                can(Action.Manage, "GROUP")
                can(Action.Create, "DELIVERABLE")
                can(Action.Update, "DELIVERABLE")
                can(Action.Delete, "DELIVERABLE")
                can(Action.ReadFull, "DELIVERABLE")
                can(Action.Read, "DELIVERABLE")
                can(Action.Create, "ARTIFACT")
                can(Action.Read, "ARTIFACT")
                can(Action.UploadFile, "ARTIFACT")
                can(Action.Update, "ARTIFACT")
                can(Action.Delete, "ARTIFACT")
                can(Action.Read, "DELIVERABLE-CONTENT")
                break
            }
            case UserRole.STUDENT: {
                can(Action.ChangePassword, UserEntity, { id: user.sub })
                can(Action.Read, UserEntity)
                can(Action.Read, SubjectEntity)
                can(Action.Read, CourseEntity)
                can(Action.Read, "PROJECT")
                can(Action.Read, "GROUP")
                can(Action.Read, "PPI")
                can(Action.Read, "ARTIFACT")
                can(Action.Read, "DELIVERABLE")
                can(Action.UploadFile, "ARTIFACT")
                can(Action.Manage, "DELIVERABLE-CONTENT")
                break
            }
            case UserRole.VIEWER: {
                can(Action.ChangePassword, UserEntity, { id: user.sub })
                can(Action.Read, UserEntity)
                can(Action.Read, CourseEntity)
                can(Action.Read, SubjectEntity)
                can(Action.Read, "PROJECT")
                can(Action.Read, "GROUP")
                can(Action.Read, "PPI")
                can(Action.Read, "ARTIFACT")
                can(Action.Read, "DELIVERABLE")
                can(Action.Read, "DELIVERABLE-CONTENT")
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
