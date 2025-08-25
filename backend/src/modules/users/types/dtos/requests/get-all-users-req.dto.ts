import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { UserRole } from "src/common/enums/user-role.enum"
import { PaginationReqDto } from "src/common/types/dtos/pagination-req.dto"

export class GetAllUsersReqDto extends PaginationReqDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name: string

    @ApiPropertyOptional({ enum: UserRole })
    @IsEnum(UserRole)
    @IsOptional()
    role: UserRole
}
