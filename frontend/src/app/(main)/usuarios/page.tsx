"use client"

import SearchBar from "@/components/search-bar"
import List from "@/components/list.layout"
import { useState, useEffect, useMemo, useCallback } from "react"
import { ViewModal } from "@/components/view-modal"
import { Button } from "@/components/buttons/default.button"
import { ArrowUpTrayIcon, PlusIcon } from "@heroicons/react/16/solid"
import { RoleGuard } from "@/components/role-guard"
import { User, UserRole, UserWithCoursesRes } from "@/types/user.type"
import { useUsers } from "./hooks/use-users"
import { UserDetails } from "@/components/user-details"
import { UserModal } from "@/components/user-modal"
import { useSession } from "next-auth/react"
import { UserCoordinatorModal } from "@/components/user-coordinator-modal"
import { FilterButton } from "@/components/buttons/filter.button"
import { getAllCourses } from "@/services/courses.service"
import { useRole } from "@/hooks/use-role"
import { UserEditModal } from "@/components/user-edit-modal"
import { UploadCsvModal } from "@/components/user-csv-modal"

const rolePermissions: Record<UserRole, UserRole[]> = {
    SYSADMIN: [UserRole.COORDINATOR, UserRole.TEACHER],
    COORDINATOR: [UserRole.TEACHER, UserRole.STUDENT, UserRole.VIEWER],
    TEACHER: [UserRole.STUDENT],
    STUDENT: [],
    VIEWER: [],
}

const roleLabels: Record<UserRole, string> = {
    SYSADMIN: "Administradores",
    COORDINATOR: "Coordenadores",
    TEACHER: "Docentes",
    STUDENT: "Discentes",
    VIEWER: "Consultores",
}

export default function UsersPage() {
    const [activeRole, setActiveRole] = useState<UserRole | null>(null)
    const [page, setPage] = useState(1)
    const [nameFilter, setNameFilter] = useState<string | undefined>()
    const [selected, setSelected] = useState<User | null>(null)
    const [creatingNew, setCreatingNew] = useState(false)
    const [courseIdFilter, setCourseIdFilter] = useState<string>()
    const [selectedForEdit, setSelectedForEdit] = useState<UserWithCoursesRes | null>(null)
    const [uploading, setUploading] = useState(false)
    const {
        handleCreateCoordinator,
        handleCreateManyUsers,
        handleChangeRole,
        handleUpdateUser,
        formattedData,
        handleCreate,
        handleDelete,
        metadata,
        fetchUsers,
        loading,
        rawData,
    } = useUsers()
    const { data: session } = useSession()
    const { can } = useRole()

    const fetchCourseOptions = useCallback(async () => {
        const data = await getAllCourses({})
        return (
            data?.items.map((u) => ({
                label: `${u.name}`,
                value: u.id,
            })) || []
        )
    }, [])

    const allowedRoles = useMemo(() => {
        return session?.user.mainRole ? rolePermissions[session.user.mainRole as UserRole] || [] : []
    }, [session?.user.mainRole])

    useEffect(() => {
        if (allowedRoles.length > 0 && !activeRole) {
            setActiveRole(allowedRoles[0])
        }
    }, [allowedRoles, activeRole])

    useEffect(() => {
        if (activeRole) {
            const role = activeRole === UserRole.TEACHER ? [UserRole.COORDINATOR, UserRole.TEACHER] : [activeRole]
            fetchUsers({ page, name: nameFilter, role: role, courseId: courseIdFilter })
        }
    }, [page, nameFilter, activeRole, fetchUsers, courseIdFilter])

    if (!activeRole) {
        return <div className="w-full mx-auto p-6 text-gray-500">Carregando...</div>
    }

    return (
        <RoleGuard roles={[UserRole.SYSADMIN, UserRole.COORDINATOR, UserRole.TEACHER]}>
            <div className="w-full mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Usuários</h1>

                <div className="flex gap-2 mb-4">
                    {allowedRoles.map((r) => (
                        <Button
                            key={r}
                            variant={activeRole === r ? "primary" : "secondary"}
                            onClick={() => {
                                setActiveRole(r)
                                setPage(1)
                            }}
                        >
                            {roleLabels[r]}
                        </Button>
                    ))}
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Buscar usuário..."
                            onSearch={(value) => {
                                setNameFilter(value)
                                setPage(1)
                            }}
                        />
                    </div>

                    <RoleGuard roles={[UserRole.SYSADMIN]}>
                        <FilterButton
                            filters={[
                                {
                                    key: "courseId",
                                    label: "Curso",
                                    type: "select",
                                    onLoadOptions: fetchCourseOptions,
                                },
                            ]}
                            onApply={(values) => {
                                setCourseIdFilter(values.courseId || undefined)
                                setPage(1)
                            }}
                        />
                    </RoleGuard>

                    <Button
                        onClick={() => {
                            setCreatingNew(true)
                        }}
                        className="flex items-center gap-1 shadow-sm"
                    >
                        <PlusIcon className="h-6 w-5" />
                        Criar
                    </Button>

                    {activeRole == UserRole.STUDENT && (
                        <Button
                            onClick={() => setUploading(true)}
                            className="flex items-center gap-1 shadow-sm"
                            variant="secondary"
                        >
                            <ArrowUpTrayIcon className="h-6 w-5" />
                            Importar
                        </Button>
                    )}
                </div>

                {loading ? (
                    <p className="text-gray-500">Carregando...</p>
                ) : (
                    <List
                        columns={[
                            { key: "name", label: "Usuário" },
                            { key: "registration", label: "Matrícula/SIAPE" },
                        ]}
                        data={formattedData}
                        page={page}
                        totalPages={metadata.totalPages}
                        totalItems={metadata.totalItems}
                        onPageChange={setPage}
                        showDeleteAction={can(UserRole.COORDINATOR, UserRole.TEACHER)}
                        showEditAction
                        onDelete={(id) => handleDelete(id, activeRole)}
                        onView={setSelected}
                        onEdit={(row) => {
                            const original = rawData.find((r) => r.id === row.id) || null
                            setSelectedForEdit(original)
                        }}
                    />
                )}

                <ViewModal
                    isOpen={!!selected}
                    item={selected}
                    onClose={() => setSelected(null)}
                    title={(item) => item.name}
                    renderContent={(item) => <UserDetails user={item} />}
                />

                {selectedForEdit && (
                    <UserEditModal
                        isOpen={!!selectedForEdit}
                        onClose={() => setSelectedForEdit(null)}
                        user={selectedForEdit}
                        onChangeRole={(userId, updateReq) => {
                            updateReq.forEach((req) => handleChangeRole(userId, req))
                        }}
                        onUpdate={(userId, updateReq) => handleUpdateUser(userId, updateReq, activeRole)}
                    />
                )}

                {activeRole === UserRole.COORDINATOR ? (
                    <UserCoordinatorModal
                        key={creatingNew ? "new" : "old"}
                        isOpen={creatingNew}
                        onClose={() => setCreatingNew(false)}
                        onSave={(newUser) => handleCreateCoordinator(newUser)}
                    />
                ) : (
                    <UserModal
                        key={creatingNew ? "new" : "old"}
                        isOpen={creatingNew}
                        onClose={() => setCreatingNew(false)}
                        role={activeRole}
                        onSave={(newUser, role) => handleCreate(newUser, role)}
                    />
                )}

                <UploadCsvModal
                    isOpen={uploading}
                    onClose={() => setUploading(false)}
                    onUpload={async (file: File) => {
                        await handleCreateManyUsers(file)
                        setUploading(false)
                    }}
                    role={activeRole}
                />
            </div>
        </RoleGuard>
    )
}
