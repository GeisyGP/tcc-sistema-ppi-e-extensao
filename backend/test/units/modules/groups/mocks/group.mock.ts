import { faker } from "@faker-js/faker/."
import { GroupWithUsers } from "src/modules/groups/repositories/group.repository.interface"

const userGroupMock = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    registration: "123",
}

export const groupMock: GroupWithUsers = {
    id: faker.string.uuid(),
    name: "Group",
    projectId: faker.string.uuid(),
    courseId: faker.string.uuid(),
    users: [userGroupMock],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
}

export const groupResMock = {
    id: groupMock.id,
    name: groupMock.name,
    projectId: groupMock.projectId,
    users: groupMock.users,
    createdAt: groupMock.createdAt,
    updatedAt: groupMock.updatedAt,
}
