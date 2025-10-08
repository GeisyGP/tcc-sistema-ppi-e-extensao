import backendApi from "./api"
import { PaginationResDto } from "@/types/pagination.type"
import { GetAllPPIsReq, PPICreateInput, PPIRes, PPIUpdateInput, PPIUpdateSubjectInput } from "@/types/ppi.type"
import { getSession } from "next-auth/react"

export async function createPPI(body: PPICreateInput): Promise<PPIRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.post(
        `/ppis`,
        {
            classPeriod: body.classPeriod,
            workload: body.workload,
            subjects: body.subjects,
        },
        {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        },
    )
    return response.data?.data
}

export async function getAllPPIs(payload: GetAllPPIsReq): Promise<PaginationResDto<PPIRes[]> | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get("/ppis", {
        params: payload,
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getPPIById(id: string): Promise<PPIRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/ppis/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function updatePPIById(id: string, body: PPIUpdateInput): Promise<PPIRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.put(`/ppis/${id}`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function updatePPISubjectById(id: string, body: PPIUpdateSubjectInput): Promise<PPIRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.patch(`/ppis/${id}`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function deletePPIById(id: string): Promise<void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    await backendApi.delete(`/ppis/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return
}
