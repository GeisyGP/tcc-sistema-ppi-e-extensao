import { PaginationResDto } from "@/types/pagination.type"
import {
    ChangePasswordReq,
    ChangeRoleReq,
    CreateUserReq,
    GetAllUsersReq,
    UpdateUserReq,
    UserRes,
    UserRole,
    UserWithCoursesRes,
} from "@/types/user.type"
import { getSession } from "next-auth/react"
import backendApi from "./api"

export async function getAllUsers(payload: GetAllUsersReq): Promise<PaginationResDto<UserWithCoursesRes[]> | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get("/users", {
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

export async function getUserById(userId: string): Promise<UserWithCoursesRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function getCurrentUser(): Promise<UserWithCoursesRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get(`/users/current`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function createUser(userRole: UserRole, body: CreateUserReq): Promise<UserRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.post(`/users/${userRole.toLowerCase()}`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function deleteUser(userRole: UserRole, userId: string): Promise<UserRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.delete(`/users/${userRole.toLowerCase()}/${userId}`, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function changeRole(userId: string, body: ChangeRoleReq): Promise<UserWithCoursesRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.patch(`/users/${userId}/role`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function updateUserById(
    userRole: UserRole,
    body: UpdateUserReq,
    userId: string,
): Promise<UserWithCoursesRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.put(`/users/${userRole.toLowerCase()}/${userId}`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}

export async function createMany(file: File): Promise<void> {
    const session = await getSession()
    if (!session?.accessToken) return

    const formData = new FormData()
    formData.append("file", file)

    const response = await backendApi.post(`/users/many`, formData, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "multipart/form-data",
        },
    })

    return response.data?.data
}

export async function changePassword(body: ChangePasswordReq, userId: string): Promise<UserWithCoursesRes | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.patch(`/users/${userId}/password`, body, {
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
        },
    })
    return response.data?.data
}
