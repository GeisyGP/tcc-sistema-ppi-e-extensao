import { getSession } from "next-auth/react"
import backendApi from "./api"

interface LoginPayload {
    registration: string
    password: string
}

export async function login(payload: LoginPayload) {
    const response = await backendApi.post("/login", payload)
    return response.data
}

export async function selectCourse(courseId: string) {
    const session = await getSession()
    if (!session?.accessToken) {
        return
    }
    const response = await backendApi.patch("/select-course", { courseId }, {
        headers: {
            "Authorization": `Bearer ${session.accessToken}`
        }
    })
    return response.data
}