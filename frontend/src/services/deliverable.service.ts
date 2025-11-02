import {
    DeliverableCreateInput,
    DeliverableRes,
    DeliverableUpdateInput,
    DeliverableWithContentAndArtifactRes,
    GetAllDeliverablesReq,
} from "@/types/deliverable.type"
import backendApi from "./api"
import { PaginationResDto } from "@/types/pagination.type"
import { getSession } from "next-auth/react"

export async function createDeliverable(body: DeliverableCreateInput): Promise<DeliverableRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }
    const response = await backendApi.post(`/deliverables`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getAllDeliverables(
    projectId: string,
    payload: GetAllDeliverablesReq,
): Promise<PaginationResDto<DeliverableWithContentAndArtifactRes[]> | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/deliverables/project/${projectId}`, {
        params: payload,
        paramsSerializer: (params) => {
            const searchParams = new URLSearchParams()
            Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((v) => searchParams.append(key, String(v)))
                } else if (value !== undefined && value !== null) {
                    searchParams.append(key, String(value))
                }
            })
            return searchParams.toString()
        },
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getDeliverableById(id: string): Promise<DeliverableWithContentAndArtifactRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/deliverables/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function updateDeliverableById(id: string, body: DeliverableUpdateInput): Promise<DeliverableRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.put(`/deliverables/${id}`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function deleteDeliverableById(id: string): Promise<void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    await backendApi.delete(`/deliverables/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return
}
