import { BadRequestException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class CannotUpdateDeliverableBeforeStartDateException extends BadRequestException {
    constructor() {
        super("Cannot update deliverable before start date", ApiStatus.CANNOT_UPDATE_DELIVERABLE)
    }
}
