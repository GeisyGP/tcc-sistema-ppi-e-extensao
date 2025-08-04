import { User } from "@prisma/client"
import { CreateUserReqDto } from "../types/dtos/requests/create-user-req.dto"
import { GetAllUsersReqDto } from "../types/dtos/requests/get-all-users-req.dto"

export interface UserRepositoryInterface {
    create(dto: CreateUserReqDto): Promise<User>
    getById(id: string): Promise<User | null>
    getByRegistration(registration: string): Promise<User | null>
    getAll(
        dto: GetAllUsersReqDto,
    ): Promise<{ users: User[]; totalItems: number }>
    delete(id: string): Promise<void>
}
