import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { User, UserRes } from "@/types/user.type"
import { formatUserWithCourses } from "../../usuarios/utils/format-user"
import { getCurrentUser } from "@/services/users.service"

export function useCurrentUser() {
    const [currentUserData, setCurrentUserData] = useState<UserRes>()
    const [currentUserFormattedData, setCurrentUserFormattedData] = useState<User>()
    const [currentUserLoading, setCurrentUserLoading] = useState(false)

    const fecthUser = useCallback(async () => {
        setCurrentUserLoading(true)
        try {
            const response = await getCurrentUser()
            if (response) {
                setCurrentUserData(response)
                setCurrentUserFormattedData(formatUserWithCourses(response))
            }
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        } finally {
            setCurrentUserLoading(false)
        }
    }, [])

    return {
        fecthUser,
        currentUserData,
        currentUserFormattedData,
        currentUserLoading,
    }
}
