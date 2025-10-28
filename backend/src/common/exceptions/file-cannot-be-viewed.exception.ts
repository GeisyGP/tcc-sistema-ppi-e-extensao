import { BadRequestException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class FileCannotBeViewedException extends BadRequestException {
    constructor() {
        super("File cannot be viewed", ApiStatus.FILE_CANNOT_BE_VIEWED)
    }
}
