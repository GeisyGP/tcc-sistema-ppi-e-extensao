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

export function abbreviateName(fullName: string) {
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 1) return fullName

    const first = parts[0]
    const last = parts[parts.length - 1]
    const middle = parts
        .slice(1, -1)
        .map((p) => p[0].toUpperCase() + ".")
        .join(" ")

    return `${first}${middle ? " " + middle : ""} ${last}`
}
