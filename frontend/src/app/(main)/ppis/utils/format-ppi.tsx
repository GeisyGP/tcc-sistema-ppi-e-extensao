import { PPI, PPIRes } from "@/types/ppi.type"

export function formatPPI(res: PPIRes): PPI {
    return {
        id: res.id,
        classPeriod: res.classPeriod,
        workload: res.workload,
        subjects: res.subjects,
        subjectsNames: res.subjects.map((subject) => subject.name).join(", "),
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
    }
}
