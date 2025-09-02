import { logout } from "@/actions/logout"
import axios from "axios"

const backendApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

let isLoggingOut = false
backendApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !isLoggingOut) {
            isLoggingOut = true
            await logout()
        }
        return Promise.reject(error)
    }
)

export default backendApi
