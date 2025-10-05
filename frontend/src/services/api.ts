import { logout } from "@/actions/logout"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { ApiError } from "@/exceptions/api-error.exception"
import axios from "axios"

const backendApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

let isLoggingOut = false
backendApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !isLoggingOut) {
            isLoggingOut = true
            await logout()
        }

        if (error.response?.status === 403) {
            return Promise.reject(new ApiError("Sem permissão para acessar"))
        }

        console.log(error.message)
        return Promise.reject(new ApiError(GENERIC_ERROR_MESSAGE))
    },
)

export default backendApi
