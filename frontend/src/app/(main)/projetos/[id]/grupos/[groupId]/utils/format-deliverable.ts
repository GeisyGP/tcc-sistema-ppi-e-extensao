import { Deliverable, DeliverableWithContentAndArtifactRes } from "@/types/deliverable.type"
import { formatDateTimeFriendly } from "./format-date-time"

export function formatDeliverable(res: DeliverableWithContentAndArtifactRes): Deliverable {
    return {
        id: res.id,
        name: res.name,
        description: res.description,
        startDate: formatDateTimeFriendly(res.startDate) || "",
        endDate: formatDateTimeFriendly(res.endDate) || "",
        startDateISO: new Date(res.startDate).toISOString(),
        endDateISO: new Date(res.endDate).toISOString(),
        subjectId: res.subjectId,
        subjectName: res.subjectName,
        artifact: res.artifact,
        content: res.content,
        projectId: res.projectId,
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
        isSubmitted: !!res.artifact?.id || !!res.content?.id,
    }
}
