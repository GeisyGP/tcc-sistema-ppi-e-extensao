import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { UserService } from "../services/user.service"
import { CreateUserReqDto } from "../types/dtos/requests/create-user-req.dto"
import { UserResDto } from "../types/dtos/responses/user-res.dto"
import { BaseResDto } from "../../../common/types/dtos/base-res.dto"
import { GetByIdReqDto } from "../types/dtos/requests/get-by-id-req.dto"
import { GetAllUsersReqDto } from "../types/dtos/requests/get-all-users-req.dto"
import { PaginationResDto } from "src/common/types/dtos/pagination-res.dto"

@ApiTags("users")
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(
        @Body() dto: CreateUserReqDto,
    ): Promise<BaseResDto<UserResDto>> {
        const user = await this.userService.create(dto)

        return {
            message: "User created successfully",
            data: user,
        }
    }

    @Get()
    async getAll(
        @Query() queryParams: GetAllUsersReqDto,
    ): Promise<BaseResDto<PaginationResDto<UserResDto[]>>> {
        const response = await this.userService.getAll(queryParams)
        return {
            message: "Users found successfully",
            data: response,
        }
    }

    @Get(":id")
    async getById(
        @Param() param: GetByIdReqDto,
    ): Promise<BaseResDto<UserResDto>> {
        const user = await this.userService.getById(param.id)

        return {
            message: "User found successfully",
            data: user,
        }
    }
}
