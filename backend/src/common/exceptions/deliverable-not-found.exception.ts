import { NotFoundException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class DeliverableNotFoundException extends NotFoundException {
    constructor() {
        super("Deliverable not found", ApiStatus.DELIVERABLE_NOT_FOUND)
    }
}
