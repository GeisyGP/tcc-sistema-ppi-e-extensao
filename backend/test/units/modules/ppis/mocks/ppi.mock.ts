import { faker } from "@faker-js/faker/."
import { PPIWithSubjects } from "src/modules/ppi/repositories/ppi.repository.interface"
import { PPIResDto } from "src/modules/ppi/types/dtos/responses/ppi-res.dto"

const ppiSubjectsMock = {
    id: faker.string.uuid(),
    workload: 2,
    name: faker.word.sample(),
}

export const ppiMock: PPIWithSubjects = {
    id: faker.string.uuid(),
    classPeriod: "1º",
    workload: 12,
    SubjectPPI: [
        { subjectId: ppiSubjectsMock.id, workload: ppiSubjectsMock.workload, subject: { name: ppiSubjectsMock.name } },
    ],
    courseId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
}

export const ppiResMock: PPIResDto = {
    id: ppiMock.id,
    classPeriod: ppiMock.classPeriod,
    workload: ppiMock.workload,
    subjects: [ppiSubjectsMock],
    createdAt: ppiMock.createdAt,
    updatedAt: ppiMock.updatedAt,
}
