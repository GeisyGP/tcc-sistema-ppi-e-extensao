import { BadRequestException } from "@nestjs/common"

export class InvalidInputException extends BadRequestException {
    constructor(error: string[]) {
        super("Invalid input", error[0])
    }
}
