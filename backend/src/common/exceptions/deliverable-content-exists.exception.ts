import { ConflictException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class DeliverableContentExistsException extends ConflictException {
    constructor() {
        super("Deliverable content exists", ApiStatus.DELIVERABLE_CONTENT_EXISTS)
    }
}
