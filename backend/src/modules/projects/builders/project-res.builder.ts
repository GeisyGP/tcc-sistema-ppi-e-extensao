import { PaginationResDto } from "../../../common/types/dtos/pagination-res.dto"
import { ProjectWithPPI } from "../repositories/project.repository.interface"
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

    static buildFull(project: ProjectFullResDto): ProjectFullResDto {
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
