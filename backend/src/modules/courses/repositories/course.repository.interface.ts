import { Course } from "@prisma/client"
import { CreateCourseReqDto } from "../types/dtos/requests/create-course-req.dto"
import { GetAllCoursesReqDto } from "../types/dtos/requests/get-all-req.dto"
import { UpdateCourseReqDto } from "../types/dtos/requests/update-course-req.dto"

export interface CourseRepositoryInterface {
    create(dto: CreateCourseReqDto): Promise<Course>
    getById(id: string, userCourseIds: Array<string>): Promise<Course | null>
    getAll(dto: GetAllCoursesReqDto, userCourseIds: Array<string>): Promise<{ courses: Course[]; totalItems: number }>
    updateById(id: string, dto: UpdateCourseReqDto, userCourseIds: Array<string>): Promise<Course>
    deleteById(id: string, userCourseIds: Array<string>): Promise<void>
}
