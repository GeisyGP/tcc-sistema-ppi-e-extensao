import { NotFoundException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class ProjectNotFoundException extends NotFoundException {
    constructor() {
        super("Project not found", ApiStatus.PROJECT_NOT_FOUND)
    }
}
