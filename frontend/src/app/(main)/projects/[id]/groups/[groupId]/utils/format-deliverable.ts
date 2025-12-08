import { Deliverable, DeliverableWithContentAndArtifactRes } from "@/types/deliverable.type"

export function formatDeliverable(res: DeliverableWithContentAndArtifactRes): Deliverable {
    return {
        id: res.id,
        name: res.name,
        description: res.description,
        startDate: toLocalInputValue(res.startDate),
        endDate: toLocalInputValue(res.endDate),
        startDateFormatted: new Date(toLocalInputValue(res.startDate)).toLocaleString(),
        endDateFormatted: new Date(toLocalInputValue(res.endDate)).toLocaleString(),
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

function toLocalInputValue(dateString: Date): string {
    const date = new Date(dateString)
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
}
