import { BadRequestException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class ProjectIsFinishedException extends BadRequestException {
    constructor() {
        super("Project is finished", ApiStatus.PROJECT_IS_FINISHED)
    }
}
