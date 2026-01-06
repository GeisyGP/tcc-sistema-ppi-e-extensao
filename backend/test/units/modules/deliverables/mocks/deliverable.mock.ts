import { faker } from "@faker-js/faker/."
import { DeliverableWithContentAndArtifact } from "src/modules/deliverable/repositories/deliverable.repository.interface"
import { DeliverableWithContentAndArtifactResDto } from "src/modules/deliverable/types/dtos/responses/deliverable-res.dto"

export const deliverableMock = {
    id: faker.string.uuid(),
    description: "description",
    startDate: new Date(),
    endDate: new Date(),
    name: "some name",
    projectId: faker.string.uuid(),
    subjectId: faker.string.uuid(),
    createdBy: faker.string.uuid(),
    updatedBy: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
}

export const deliverableWithContentAndArtifactResMock: DeliverableWithContentAndArtifactResDto = {
    ...deliverableMock,
    artifact: [{ id: "123", name: "some-name", groupId: null }],
    content: [{ id: "123", content: "some-content", groupId: "123" }],
    canUserManage: true,
}

export const deliverableWithContentAndArtifactMock: DeliverableWithContentAndArtifact = {
    ...deliverableMock,
    Artifact: [{ id: "123", name: "some-name", groupId: null }],
    DeliverableContent: [{ id: "123", content: "some-content", groupId: "123" }],
    deletedAt: null,
    courseId: "123",
    subject: null,
}
