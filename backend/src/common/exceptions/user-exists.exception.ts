import { ConflictException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class UserExistsException extends ConflictException {
    constructor() {
        super("User already exists", ApiStatus.USER_EXISTS)
    }
}
