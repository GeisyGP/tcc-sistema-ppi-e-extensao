import { Subject } from "@prisma/client"

export class SubjectEntity implements Subject {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
}
