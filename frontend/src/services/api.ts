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

        if (error.response?.data instanceof Blob) {
            const text = await error.response.data.text()
            try {
                const json = JSON.parse(text)
                if (json?.error === "FILE_CANNOT_BE_VIEWED") {
                    return Promise.reject(new ApiError("FILE_CANNOT_BE_VIEWED"))
                }
                return Promise.reject(new ApiError(GENERIC_ERROR_MESSAGE))
            } catch {
                return Promise.reject(new ApiError(GENERIC_ERROR_MESSAGE))
            }
        }

        const errorMessage = error?.response?.data?.message || error.message
        if (errorMessage.includes("File does not contain required columns")) {
            const column = errorMessage.split(": ")[1]
            return Promise.reject(new ApiError(`O arquivo não contém a coluna obrigatória: ${column}`))
        } else if (errorMessage.startsWith("Validation failed (current file type")) {
            return Promise.reject(new ApiError("Extensão não permitida. Use um arquivo CSV ou TXT"))
        } else if (errorMessage == "Invalid file") {
            return Promise.reject(new ApiError("Arquivo inválido"))
        }

        return Promise.reject(new ApiError(GENERIC_ERROR_MESSAGE))
    },
)

export default backendApi
