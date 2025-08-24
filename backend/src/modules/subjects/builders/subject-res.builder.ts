import { Subject } from "@prisma/client"
import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { SubjectResDto } from "../types/dtos/responses/subject-res.dto"
import { SubjectWithTeacherResDto } from "../types/dtos/responses/subject-with-teacher-res.dto"

export class SubjectResBuilder {
    static build(
        subject: Subject & { teachers: { id: string; name: string }[] },
    ): SubjectWithTeacherResDto {
        return {
            id: subject.id,
            name: subject.name,
            teachers: subject.teachers.map((teacher) => ({
                id: teacher.id,
                name: teacher.name,
            })),
            createdAt: subject.createdAt,
            updatedAt: subject.updatedAt,
        }
    }

    static buildMany(
        subjects: Subject[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<SubjectResDto[]> {
        return {
            items: subjects.map((subject) => ({
                id: subject.id,
                name: subject.name,
                createdAt: subject.createdAt,
                updatedAt: subject.updatedAt,
            })),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
