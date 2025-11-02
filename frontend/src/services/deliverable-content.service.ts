import {
    DeliverableContentCreateInput,
    DeliverableContentRes,
    DeliverableContentUpdateInput,
} from "@/types/deliverable-content.type"
import backendApi from "./api"
import { getSession } from "next-auth/react"

export async function createDeliverable(body: DeliverableContentCreateInput): Promise<DeliverableContentRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }
    const response = await backendApi.post(`/deliverable-contents`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getDeliverableById(id: string): Promise<DeliverableContentRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/deliverable-contents/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function updateDeliverableById(
    id: string,
    body: DeliverableContentUpdateInput,
): Promise<DeliverableContentRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.put(`/deliverable-contents/${id}`, body, {
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

    await backendApi.delete(`/deliverable-contents/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return
}
