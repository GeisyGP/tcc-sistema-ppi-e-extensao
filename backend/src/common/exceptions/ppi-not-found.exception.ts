import { NotFoundException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class PPINotFoundException extends NotFoundException {
    constructor() {
        super("PPI not found", ApiStatus.PPI_NOT_FOUND)
    }
}
