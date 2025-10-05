import { useCallback, useState } from "react"
import { formatUser, formatUserWithCourses } from "../utils/format-user"
import toast from "react-hot-toast"
import { ChangeRoleReq, CreateUserReq, User, UserRole, UserWithCoursesRes } from "@/types/user.type"
import { changeRole, createUser, deleteUser, getAllUsers } from "@/services/users.service"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"

export function useUsers() {
    const [rawData, setRawData] = useState<UserWithCoursesRes[]>([])
    const [formattedData, setFormattedData] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)

    const fetchUsers = useCallback(
        async (params: { page: number; role: UserRole[]; name?: string; courseId?: string }) => {
            setLoading(true)
            try {
                const response = await getAllUsers(params)
                if (response) {
                    setRawData(response.items)
                    setFormattedData(response.items.map(formatUserWithCourses))
                    setTotalPages(response.metadata.totalPages)
                }
            } catch (error: any) {
                const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
                toast.error(errorMessage)
            } finally {
                setLoading(false)
            }
        },
        [],
    )

    const handleCreateCoordinator = useCallback(async (newUser: CreateUserReq) => {
        try {
            const created = await createUser(UserRole.COORDINATOR, {
                name: newUser.name,
                password: newUser.password,
                registration: newUser.registration,
                courseId: newUser.courseId,
            })
            if (created) setFormattedData((prev) => [...prev, formatUser(created)])
            toast.success("Usuário criado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleCreate = useCallback(async (newUser: CreateUserReq, userRole: UserRole) => {
        try {
            const created = await createUser(userRole, {
                name: newUser.name,
                password: newUser.password,
                registration: newUser.registration,
            })
            if (created) setFormattedData((prev) => [...prev, formatUser(created)])
            toast.success("Usuário criado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleDelete = useCallback(async (id: string, userRole: UserRole): Promise<void> => {
        try {
            await deleteUser(userRole, id)
            setFormattedData((prev) => prev.filter((d) => d.id !== id))
            toast.success("Usuário deletado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    const handleChangeRole = useCallback(async (userId: string, req: ChangeRoleReq) => {
        try {
            const updated = await changeRole(userId, req)
            if (updated) {
                setFormattedData((prev) => prev.map((d) => (d.id === updated.id ? formatUserWithCourses(updated) : d)))
            }
            toast.success("Usuário atualizado com sucesso")
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    return {
        rawData,
        loading,
        totalPages,
        fetchUsers,
        handleCreate,
        handleDelete,
        formattedData,
        handleChangeRole,
        handleCreateCoordinator,
    }
}
