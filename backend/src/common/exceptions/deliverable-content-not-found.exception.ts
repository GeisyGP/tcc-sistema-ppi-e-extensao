import { NotFoundException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class DeliverableContentNotFoundException extends NotFoundException {
    constructor() {
        super("Deliverable content not found", ApiStatus.DELIVERABLE_CONTENT_NOT_FOUND)
    }
}
