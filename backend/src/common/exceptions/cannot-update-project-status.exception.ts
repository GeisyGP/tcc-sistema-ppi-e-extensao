import { BadRequestException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class CannotUpdateProjectStatusException extends BadRequestException {
    constructor() {
        super("Cannot update project status", ApiStatus.CANNOT_UPDATE_PROJECT)
    }
}
