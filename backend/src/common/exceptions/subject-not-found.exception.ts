import { NotFoundException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class SubjectNotFoundException extends NotFoundException {
    constructor() {
        super("Subject not found", ApiStatus.SUBJECT_NOT_FOUND)
    }
}
