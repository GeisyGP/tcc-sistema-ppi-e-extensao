import { GetAllSubjectsReq, SubjectRes } from "@/types/subject.types"
import { backendApi } from "./api"
import { PaginationResDto } from "@/types/pagination.type"
import { getSession } from "next-auth/react"

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

export async function getSubjectById(id: string): Promise<SubjectRes> {
    const response = await backendApi.get(`/subjects/${id}`)
    return response.data
}