import { NotFoundException } from "@nestjs/common"
import { ApiStatus } from "../enums/api-status.enum"

export class CourseNotFoundException extends NotFoundException {
    constructor() {
        super("Course not found", ApiStatus.COURSE_NOT_FOUND)
    }
}
