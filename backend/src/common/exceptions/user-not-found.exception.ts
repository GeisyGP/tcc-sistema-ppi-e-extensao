import { NotFoundException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class UserNotFoundException extends NotFoundException {
    constructor() {
        super("User not found", ApiStatus.USER_NOT_FOUND)
    }
}
