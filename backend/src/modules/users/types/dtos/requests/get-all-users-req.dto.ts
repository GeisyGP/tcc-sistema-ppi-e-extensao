import { ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator"
import { UserRole } from "src/common/enums/user-role.enum"
import { PaginationReqDto } from "src/common/types/dtos/pagination-req.dto"

export class GetAllUsersReqDto extends PaginationReqDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    courseId: string

    @ApiPropertyOptional({ enum: UserRole, isArray: true })
    @IsArray()
    @IsEnum(UserRole, { each: true })
    @IsOptional()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    role: UserRole[]
}
