import { faker } from "@faker-js/faker/."
import { ProjectStatus } from "src/common/enums/project-status.enum"
import { ProjectWithPPI } from "src/modules/projects/repositories/project.repository.interface"

export const baseProjectMock = {
    id: faker.string.uuid(),
    class: "cc2000",
    executionPeriod: "2025",
    status: ProjectStatus.NOT_STARTED,
    theme: "Intelligent System for Monitoring Computer Lab Resources",
    campusDirector: faker.person.fullName(),
    academicDirector: faker.person.fullName(),
    ppiId: faker.string.uuid(),
    ppi: { classPeriod: "" },
    visibleToAll: true,
    courseId: faker.string.uuid(),
    createdBy: faker.string.uuid(),
    updatedBy: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    scope: "This project proposes the development of an intelligent system to monitor and manage the usage of computer lab resources such as machines, network availability, and peripheral devices.",
    justification:
        "Computer laboratories often face challenges related to equipment misuse, inefficient scheduling, and lack of maintenance tracking. Implementing an automated system can optimize resource allocation and improve the overall user experience.",
    generalObjective:
        "To design and implement a web-based platform capable of collecting, analyzing, and visualizing data about computer lab usage in real time.",
    specificObjectives:
        "1. Collect and process data from lab machines using IoT sensors and software agents.\n2. Implement a backend API for data storage and management.\n3. Develop a dashboard for visualization and analytics.\n4. Apply data analysis techniques to identify usage patterns and predict maintenance needs.",
    methodology:
        "The project will follow an incremental software development approach, using technologies such as Node.js, React, and relational databases. Data will be collected from IoT-enabled devices and processed for visualization through dashboards.",
    subjectsContributions:
        "Software Engineering will define the architecture and development process; Database Systems will handle data modeling and queries; Computer Networks will support IoT communication and real-time data transmission.",
    timeline:
        "Phase 1 - Requirements and data collection planning; Phase 2 - System design and architecture; Phase 3 - Implementation and integration; Phase 4 - Testing, evaluation, and deployment.",
}

export const projectMock: ProjectWithPPI = {
    id: baseProjectMock.id,
    class: baseProjectMock.class,
    executionPeriod: baseProjectMock.executionPeriod,
    status: baseProjectMock.status,
    theme: baseProjectMock.theme,
    campusDirector: baseProjectMock.campusDirector,
    academicDirector: baseProjectMock.academicDirector,
    ppiId: baseProjectMock.ppiId,
    ppi: baseProjectMock.ppi,
    visibleToAll: baseProjectMock.visibleToAll,
    courseId: baseProjectMock.courseId,
    createdBy: baseProjectMock.createdBy,
    updatedBy: baseProjectMock.updatedBy,
    createdAt: baseProjectMock.createdAt,
    updatedAt: baseProjectMock.updatedAt,
    deletedAt: baseProjectMock.deletedAt,
}

export const projectResMock = {
    id: baseProjectMock.id,
    class: baseProjectMock.class,
    executionPeriod: baseProjectMock.executionPeriod,
    status: baseProjectMock.status,
    theme: baseProjectMock.theme,
    campusDirector: baseProjectMock.campusDirector,
    academicDirector: baseProjectMock.academicDirector,
    visibleToAll: baseProjectMock.visibleToAll,
    ppiId: baseProjectMock.ppiId,
    ppiClassPeriod: projectMock.ppi.classPeriod,
    createdBy: baseProjectMock.createdBy,
    updatedBy: baseProjectMock.updatedBy,
    createdAt: baseProjectMock.createdAt,
    updatedAt: baseProjectMock.updatedAt,
}

export const projectFullResMock = {
    id: baseProjectMock.id,
    theme: baseProjectMock.theme,
    scope: baseProjectMock.scope,
    justification: baseProjectMock.justification,
    generalObjective: baseProjectMock.generalObjective,
    specificObjectives: baseProjectMock.specificObjectives,
    methodology: baseProjectMock.methodology,
    subjectsContributions: baseProjectMock.subjectsContributions,
    timeline: baseProjectMock.timeline,
}
