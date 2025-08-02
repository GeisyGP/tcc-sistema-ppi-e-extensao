import { ApiProperty } from "@nestjs/swagger"
import { randomUUID } from "crypto"

export const UserRole = {
    SYSADMIN: "SYSADMIN",
    COORDINATOR: "COORDINATOR",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export class UserResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    registration: string

    @ApiProperty()
    name: string

    @ApiProperty({ enum: UserRole })
    role: UserRole

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}
