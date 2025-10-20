import backendApi from "./api"
import { PaginationResDto } from "@/types/pagination.type"
import {
    ChangeProjectStatusInput,
    GetAllProjectsReq,
    ProjectContentUpdateInput,
    ProjectCreateInput,
    ProjectFullRes,
    ProjectOverview,
    ProjectRes,
    ProjectUpdateInput,
} from "@/types/project.type"
import { getSession } from "next-auth/react"

export async function createProject(body: ProjectCreateInput): Promise<ProjectRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.post(`/projects`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getAllProjects(payload: GetAllProjectsReq): Promise<PaginationResDto<ProjectRes[]> | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get("/projects", {
        params: payload,
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getProjectFullById(id: string): Promise<ProjectFullRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/projects/${id}/content`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getProjectOverviewById(id: string): Promise<ProjectOverview | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/projects/${id}/overview`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getProjectById(id: string): Promise<ProjectRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/projects/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function updateProjectById(id: string, body: ProjectUpdateInput): Promise<ProjectRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.put(`/projects/${id}`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function updateProjectContentById(
    id: string,
    body: ProjectContentUpdateInput,
): Promise<ProjectFullRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.patch(`/projects/${id}/content`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function changeProjectStatusById(id: string, body: ChangeProjectStatusInput): Promise<ProjectRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.patch(`/projects/${id}/status`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function changeProjectVisibilityById(id: string, visibleToAll: boolean): Promise<ProjectRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.patch(
        `/projects/${id}/visibility`,
        { visibleToAll },
        {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        },
    )
    return response.data?.data
}

export async function deleteProjectById(id: string): Promise<void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    await backendApi.delete(`/projects/${id}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return
}
