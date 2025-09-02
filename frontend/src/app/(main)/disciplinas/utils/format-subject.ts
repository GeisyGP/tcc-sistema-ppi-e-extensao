import { Subject, SubjectRes } from "@/types/subject.types"

export function formatSubject(res: SubjectRes): Subject {
    return {
        id: res.id,
        name: res.name,
        teachers: res.teachers.map(t => t.name).join(', '),
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
    }
}