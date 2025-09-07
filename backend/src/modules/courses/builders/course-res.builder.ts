import { Course } from "@prisma/client"
import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { CourseResDto } from "../types/dtos/responses/course-res.dto"

export class CourseResBuilder {
    static build(course: Course): CourseResDto {
        return {
            id: course.id,
            name: course.name,
            technologicalAxis: course.technologicalAxis,
            educationLevel: course.educationLevel,
            degree: course.degree,
            modality: course.modality,
            shift: course.shift,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
        }
    }

    static buildMany(
        courses: Course[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<CourseResDto[]> {
        return {
            items: courses.map((course) => this.build(course)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
