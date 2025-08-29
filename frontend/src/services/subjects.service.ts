import { GetAllSubjectsReq, SubjectInput, SubjectRes } from "@/types/subject.types"
import { backendApi } from "./api"
import { PaginationResDto } from "@/types/pagination.type"
import { getSession } from "next-auth/react"

export async function createSubjectById(id: string, body: SubjectInput): Promise<SubjectRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.post(`/subjects`, {
        body,
        headers: {
            "Authorization": `Bearer ${session.accessToken}`
        }
    })
    return response.data?.data
}

export async function getAllSubjects(payload: GetAllSubjectsReq): Promise<PaginationResDto<SubjectRes[]> | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get("/subjects", {
        params: payload,
        headers: {
            "Authorization": `Bearer ${session.accessToken}`
        }
    })
    return response.data?.data
}

export async function getSubjectById(id: string): Promise<SubjectRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/subjects/${id}`, {
        headers: {
            "Authorization": `Bearer ${session.accessToken}`
        }
    })
    return response.data?.data
}

export async function updateSubjectById(id: string, body: SubjectInput): Promise<SubjectRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.put(`/subjects/${id}`, {
        body,
        headers: {
            "Authorization": `Bearer ${session.accessToken}`
        }
    })
    return response.data?.data
}

export async function deleteSubjectById(id: string): Promise<void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    await backendApi.delete(`/subjects/${id}`, {
        headers: {
            "Authorization": `Bearer ${session.accessToken}`
        }
    })
    return
}