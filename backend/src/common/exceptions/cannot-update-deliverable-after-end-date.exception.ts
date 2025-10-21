import { BadRequestException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class CannotUpdateDeliverableAfterEndDateException extends BadRequestException {
    constructor() {
        super("Cannot update deliverable after end date", ApiStatus.CANNOT_UPDATE_DELIVERABLE)
    }
}
