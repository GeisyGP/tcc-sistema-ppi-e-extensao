import { Subject } from "@prisma/client"
import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { SubjectWithTeacherResDto } from "../types/dtos/responses/subject-with-teacher-res.dto"

type SubjectWithTeacher = Subject & { teachers: { id: string; name: string }[] }

export class SubjectResBuilder {
    static build(subject: SubjectWithTeacher): SubjectWithTeacherResDto {
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
        subjects: SubjectWithTeacher[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<SubjectWithTeacherResDto[]> {
        return {
            items: subjects.map((subject) => this.build(subject)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
