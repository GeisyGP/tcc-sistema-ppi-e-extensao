import { DeliverableContent, DeliverableContentRes } from "@/types/deliverable-content.type"

export function formatDeliverableContent(res: DeliverableContentRes): DeliverableContent {
    return {
        id: res.id,
        content: res.content,
        deliverableId: res.deliverableId,
        groupId: res.groupId,
        createdBy: res.createdBy,
        updatedBy: res.updatedBy,
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
    }
}
