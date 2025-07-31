import { BadRequestException } from "@nestjs/common"

export class InvalidInputException extends BadRequestException {
    constructor(message: string | string[]) {
        super(message, "Invalid input")
    }
}
