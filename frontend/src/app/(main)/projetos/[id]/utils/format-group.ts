import { Group, GroupRes } from "@/types/group.type"

export function formatGroup(res: GroupRes): Group {
    return {
        id: res.id,
        name: res.name,
        projectId: res.projectId,
        users: res.users,
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
    }
}
