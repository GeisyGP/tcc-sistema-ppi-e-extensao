import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { ProjectWithPPI, ProjectWithPPIWithCourse } from "../repositories/project.repository.interface"
import { ProjectOverviewResDto } from "../types/dtos/responses/project-overview.dto"
import { ProjectFullResDto, ProjectResDto } from "../types/dtos/responses/project-res.dto"

export class ProjectResBuilder {
    static build(project: ProjectWithPPI): ProjectResDto {
        return {
            id: project.id,
            class: project.class,
            theme: project.theme,
            executionPeriod: project.executionPeriod,
            campusDirector: project.campusDirector,
            academicDirector: project.academicDirector,
            status: project.status,
            visibleToAll: project.visibleToAll,
            ppiId: project.ppiId,
            ppiClassPeriod: project.ppi.classPeriod,
            createdBy: project.createdBy,
            updatedBy: project.updatedBy,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        }
    }

    static buildFull(
        project: ProjectFullResDto,
        userHasCoordinatorAccess?: boolean,
        userHasDefaultAccess?: boolean,
    ): ProjectFullResDto {
        return {
            id: project.id,
            theme: project.theme,
            scope: project.scope,
            justification: project.justification,
            generalObjective: project.generalObjective,
            specificObjectives: project.specificObjectives,
            subjectsContributions: project.subjectsContributions,
            methodology: project.methodology,
            timeline: project.timeline,
            userHasCoordinatorAccess,
            userHasDefaultAccess,
            ppiId: project.ppiId,
            status: project.status,
        }
    }

    static buildOverview(project: ProjectWithPPIWithCourse): ProjectOverviewResDto {
        return {
            id: project.id,
            technologicalAxis: project.ppi.course.technologicalAxis,
            courseName: project.ppi.course.name,
            educationLevel: project.ppi.course.educationLevel,
            degree: project.ppi.course.degree,
            modality: project.ppi.course.modality,
            executionPeriod: project.executionPeriod,
            ppiClassPeriod: project.ppi.classPeriod,
            workload: project.ppi.workload,
            shift: project.ppi.course.shift,
            class: project.class,
            campusDirector: project.campusDirector,
            academicDirector: project.academicDirector,
            subjects: project.ppi.SubjectPPI.map((subject) => ({
                id: subject.subjectId,
                name: subject.subject?.name,
                workload: subject.workload,
                isCoordinator: subject.isCoordinator,
            })),
        }
    }

    static buildMany(
        ppis: ProjectWithPPI[],
        page: number,
        limit: number,
        totalItems: number,
    ): PaginationResDto<ProjectResDto[]> {
        return {
            items: ppis.map((ppi) => this.build(ppi)),
            metadata: {
                page,
                itemsPerPage: limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
            },
        }
    }
}
