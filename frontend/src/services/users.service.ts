import { PaginationResDto } from "@/types/pagination.type"
import { GetAllUsersReq, UserRes } from "@/types/user.type"
import { getSession } from "next-auth/react"
import backendApi from "./api"

export async function getAllUsers(payload: GetAllUsersReq): Promise<PaginationResDto<UserRes[]> | void> {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }

    const response = await backendApi.get("/users", {
        params: payload,
        headers: {
            "Authorization": `Bearer ${session.accessToken}`
        }
    })
    return response.data?.data
}