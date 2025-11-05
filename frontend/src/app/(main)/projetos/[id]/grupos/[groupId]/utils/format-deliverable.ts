import { Deliverable, DeliverableWithContentAndArtifactRes } from "@/types/deliverable.type"

export function formatDeliverable(res: DeliverableWithContentAndArtifactRes): Deliverable {
    return {
        id: res.id,
        name: res.name,
        description: res.description,
        startDate: new Date(res.startDate).toISOString().slice(0, 16),
        endDate: new Date(res.endDate).toISOString().slice(0, 16),
        subjectId: res.subjectId,
        subjectName: res.subjectName,
        artifact: res.artifact,
        content: res.content,
        projectId: res.projectId,
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
        isSubmitted: res.artifact.length > 0 || res.content.length > 0,
    }
}
