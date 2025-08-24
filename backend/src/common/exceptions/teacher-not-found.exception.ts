import { NotFoundException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class TeacherNotFoundException extends NotFoundException {
    constructor() {
        super("Teacher not found", ApiStatus.TEACHER_NOT_FOUND)
    }
}
