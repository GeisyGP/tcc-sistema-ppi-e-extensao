import { useCallback, useState } from "react"
import { formatUser, formatUserWithCourses } from "../utils/format-user"
import toast from "react-hot-toast"
import { CreateUserReq, User, UserRole, UserWithCoursesRes } from "@/types/user.type"
import { createUser, deleteUser, getAllUsers } from "@/services/users.service"

export function useUsers() {
    const [rawData, setRawData] = useState<UserWithCoursesRes[]>([])
    const [formattedData, setFormattedData] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)

    const fetchUsers = useCallback(async (params: { page: number, role: UserRole[], name?: string }) => {
        setLoading(true)
        try {
            const response = await getAllUsers(params)
            if (response) {
                setRawData(response.items)
                setFormattedData(response.items.map(formatUserWithCourses))
                setTotalPages(response.metadata.totalPages)
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const handleCreateCoordinator = useCallback(async (newUser: CreateUserReq) => {
        try {
            const created = await createUser(UserRole.COORDINATOR,{
                name: newUser.name,
                password: newUser.password,
                registration: newUser.registration,
                courseId: newUser.courseId,
            })
            if (created) setFormattedData(prev => [...prev, formatUser(created)])
            toast.success("Usuário criado com sucesso")
        } catch (error: any) {
            toast.error(error.message)
        }
    }, [])

     const handleCreate = useCallback(async (newUser: CreateUserReq, userRole: UserRole) => {
        try {
            const created = await createUser(userRole,{
                name: newUser.name,
                password: newUser.password,
                registration: newUser.registration,
            })
            if (created) setFormattedData(prev => [...prev, formatUser(created)])
            toast.success("Usuário criado com sucesso")
        } catch (error: any) {
            toast.error(error.message)
        }
    }, [])

    const handleDelete = useCallback(async (id: string, userRole: UserRole) => {
        try {
            await deleteUser(userRole, id)
            setFormattedData(prev => prev.filter(d => d.id !== id))
            toast.success("Usuário deletado com sucesso")
        } catch (error: any) {
            toast.error(error.message)
        }
    }, [])

    return { rawData, formattedData, loading, totalPages, fetchUsers, handleCreate, handleDelete, handleCreateCoordinator }
}
