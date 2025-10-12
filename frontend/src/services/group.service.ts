import { GetAllGroupsReq, GroupCreateInput, GroupRes, GroupUpdateInput } from "@/types/group.type"
import backendApi from "./api"
import { PaginationResDto } from "@/types/pagination.type"
import { getSession } from "next-auth/react"

export async function createGroup(body: GroupCreateInput): Promise<GroupRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }
    const response = await backendApi.post(`/groups`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getAllGroups(
    projectId: string,
    payload: GetAllGroupsReq,
): Promise<PaginationResDto<GroupRes[]> | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/groups/project/${projectId}`, {
        params: payload,
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getGroupById(id: string): Promise<GroupRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/groups/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function updateGroupById(id: string, body: GroupUpdateInput): Promise<GroupRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.put(`/groups/${id}`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function deleteGroupById(id: string): Promise<void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    await backendApi.delete(`/groups/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return
}
