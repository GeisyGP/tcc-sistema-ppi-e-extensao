import { User, UserRole } from "@prisma/client"
import { CreateUserReqDto } from "../types/dtos/requests/create-user-req.dto"
import { GetAllUsersReqDto } from "../types/dtos/requests/get-all-users-req.dto"
import { UpdateByIdBodyReqDto } from "../types/dtos/requests/update-by-id-req.dto"

export type UserWithCourses = User & { UserCourse: { courseId: string; role: UserRole; course?: { name: string } }[] }

export interface UserRepositoryInterface {
    create(dto: CreateUserReqDto, role: UserRole, currentCourseId: string): Promise<User>
    getById(id: string, currentCourseId: string): Promise<UserWithCourses | null>
    getByRegistration(registration: string, currentCourseId: string): Promise<UserWithCourses | null>
    getAll(dto: GetAllUsersReqDto, currentCourseId: string): Promise<{ users: UserWithCourses[]; totalItems: number }>
    delete(id: string, currentCourseId: string): Promise<void>
    changePassword(id: string, newPassword: string, currentCourseId: string): Promise<User | null>
    updateById(userId: string, dto: UpdateByIdBodyReqDto, currentCourseId: string): Promise<UserWithCourses>
    createMany(dto: CreateUserReqDto[], role: UserRole, currentCourseId: string): Promise<void>
}
