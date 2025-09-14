import { User, UserRole } from "@prisma/client"
import { CreateUserReqDto } from "../types/dtos/requests/create-user-req.dto"
import { GetAllUsersReqDto } from "../types/dtos/requests/get-all-users-req.dto"

export type UserWithCourses = User & { UserCourse: { courseId: string; role: UserRole }[] }

export interface UserRepositoryInterface {
    create(dto: CreateUserReqDto, currentCourseId: string): Promise<User>
    getById(id: string, currentCourseId: string): Promise<UserWithCourses | null>
    getByRegistration(registration: string, currentCourseId: string): Promise<UserWithCourses | null>
    getAll(dto: GetAllUsersReqDto, currentCourseId: string): Promise<{ users: UserWithCourses[]; totalItems: number }>
    delete(id: string, currentCourseId: string): Promise<void>
    changePassword(id: string, newPassword: string, currentCourseId: string): Promise<User | null>
}
