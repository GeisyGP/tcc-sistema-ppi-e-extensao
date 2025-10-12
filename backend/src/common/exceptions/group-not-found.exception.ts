import { NotFoundException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class GroupNotFoundException extends NotFoundException {
    constructor() {
        super("Group not found", ApiStatus.GROUP_NOT_FOUND)
    }
}
