import backendApi from "./api"

interface LoginPayload {
    registration: string
    password: string
}

export async function login(payload: LoginPayload) {
    const response = await backendApi.post("/login", payload)
    return response.data
}
