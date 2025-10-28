import {
    ArtifactDeliverableCreateInput,
    ArtifactProjectCreateInput,
    ArtifactRes,
    GetAllArtifactsReq,
} from "@/types/artifact.type"
import backendApi from "./api"
import { PaginationResDto } from "@/types/pagination.type"
import { getSession } from "next-auth/react"

export async function createArtifactProject(
    projectId: string,
    body: ArtifactProjectCreateInput,
    file: File,
): Promise<ArtifactRes | void> {
    const session = await getSession()
    if (!session?.accessToken) return

    const formData = new FormData()

    Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, value as any)
        }
    })

    formData.append("file", file)
    const response = await backendApi.post(`/artifacts/project/${projectId}`, formData, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })

    return response.data?.data
}

export async function createArtifactDeliverable(
    deliverableId: string,
    body: ArtifactDeliverableCreateInput,
    file: File,
): Promise<ArtifactRes | void> {
    const session = await getSession()
    if (!session?.accessToken) return

    const formData = new FormData()
    Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value as any)
    })
    formData.append("file", file)

    const response = await backendApi.post(`/artifacts/deliverable/${deliverableId}`, formData, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })

    return response.data?.data
}

export async function getAllArtifactsByProjectId(
    projectId: string,
    payload: GetAllArtifactsReq,
): Promise<PaginationResDto<ArtifactRes[]> | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/artifacts/project/${projectId}`, {
        params: payload,
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getAllArtifactsByGroupId(
    groupId: string,
    payload: GetAllArtifactsReq,
): Promise<PaginationResDto<ArtifactRes[]> | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/artifacts/group/${groupId}`, {
        params: payload,
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getArtifactById(id: string) {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/artifacts/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
        responseType: "blob",
    })
    const fileUrl = URL.createObjectURL(response.data)

    const contentDisposition = response.headers["content-disposition"]
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/)
    const fileName = fileNameMatch ? fileNameMatch[1] : "arquivo"

    return {
        url: fileUrl,
        fileName,
        mimeType: response.data.type,
    }
}

export async function downloadArtifactById(id: string) {
    const session = await getSession()
    if (!session?.accessToken) return

    const response = await backendApi.get(`/artifacts/${id}/download`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
        responseType: "blob",
    })

    const contentDisposition = response.headers["content-disposition"]
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/)
    const fileName = fileNameMatch ? fileNameMatch[1] : "arquivo"

    const blobUrl = URL.createObjectURL(response.data)
    const link = document.createElement("a")
    link.href = blobUrl
    link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(blobUrl)
}

export async function updateArtifactById(id: string, deliverableId: string, file: File): Promise<ArtifactRes | void> {
    const session = await getSession()
    if (!session?.accessToken) return

    const formData = new FormData()
    formData.append("file", file)

    const response = await backendApi.put(`/artifacts/${id}/deliverable/${deliverableId}`, formData, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })

    return response.data?.data
}

export async function deleteArtifactById(id: string): Promise<void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    await backendApi.delete(`/artifacts/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return
}
