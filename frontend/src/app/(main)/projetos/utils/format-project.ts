import { Project, ProjectRes, ProjectStatus, ProjectStatusMapped } from "@/types/project.type"

export function formatProject(res: ProjectRes): Project {
    return {
        id: res.id,
        status: mapProjectStatus(res.status) || "Desconhecido",
        theme: res.theme,
        class: res.class,
        ppiClassPeriod: res.ppiClassPeriod,
        executionPeriod: res.executionPeriod,
        createdBy: res.createdBy,
        updatedBy: res.updatedBy,
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
    }
}

function mapProjectStatus(status: ProjectStatus): ProjectStatusMapped | void {
    switch (status) {
        case ProjectStatus.NOT_STARTED:
            return ProjectStatusMapped.NOT_STARTED
        case ProjectStatus.STARTED:
            return ProjectStatusMapped.STARTED
        case ProjectStatus.FINISHED:
            return ProjectStatusMapped.FINISHED
        default:
            return
    }
}
