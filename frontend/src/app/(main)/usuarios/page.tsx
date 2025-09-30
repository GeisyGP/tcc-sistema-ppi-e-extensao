'use client'

import SearchBar from '@/components/search-bar'
import List from '@/components/list.layout'
import { useState, useEffect, useMemo } from 'react'
import { ViewModal } from '@/components/view-modal'
import { Button } from '@/components/buttons/default.button'
import { PlusIcon } from '@heroicons/react/16/solid'
import { RoleGuard } from '@/components/role-guard'
import { User, UserRole } from '@/types/user.type'
import { useUsers } from './hooks/use-users'
import { UserDetails } from '@/components/user-details'
import { UserModal } from '@/components/user-modal'
import { useSession } from 'next-auth/react'
import { UserCoordinatorModal } from '@/components/user-coordinator-modal'

const rolePermissions: Record<UserRole, UserRole[]> = {
    SYSADMIN: [UserRole.COORDINATOR, UserRole.TEACHER],
    COORDINATOR: [UserRole.TEACHER, UserRole.STUDENT, UserRole.VIEWER],
    TEACHER: [UserRole.STUDENT],
    STUDENT: [],
    VIEWER: [],
}

const roleLabels: Record<UserRole, string> = {
    SYSADMIN: 'Administradores',
    COORDINATOR: 'Coordenadores',
    TEACHER: 'Docentes',
    STUDENT: 'Discentes',
    VIEWER: 'Visualizadores',
}

export default function UsersPage() {
    const [activeRole, setActiveRole] = useState<UserRole | null>(null)
    const [page, setPage] = useState(1)
    const [nameFilter, setNameFilter] = useState<string | undefined>()
    const [selected, setSelected] = useState<User | null>(null)
    const [creatingNew, setCreatingNew] = useState(false)
    const { formattedData, loading, totalPages, fetchUsers, handleCreateCoordinator, handleCreate, handleDelete } = useUsers()
    const { data: session } = useSession()

    const allowedRoles = useMemo(() => {
        return session?.user.mainRole
            ? rolePermissions[session.user.mainRole as UserRole] || []
            : []
    }, [session?.user.mainRole])


    useEffect(() => {
        if (allowedRoles.length > 0 && !activeRole) {
            setActiveRole(allowedRoles[0])
        }
    }, [allowedRoles, activeRole])

    useEffect(() => {
        if (activeRole) {
            const role = activeRole === UserRole.TEACHER ? [UserRole.COORDINATOR, UserRole.TEACHER] : [activeRole]
            fetchUsers({ page, name: nameFilter, role: role })
        }
    }, [page, nameFilter, activeRole, fetchUsers])

    if (!activeRole) {
        return (
            <div className="w-full mx-auto p-6 text-gray-500">
                Carregando...
            </div>
        )
    }

    return (
        <RoleGuard roles={[UserRole.SYSADMIN, UserRole.COORDINATOR, UserRole.TEACHER]}>
            <div className="w-full mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Usuários</h1>

                <div className="flex gap-2 mb-4">
                    {allowedRoles.map((r) => (
                        <Button
                            key={r}
                            variant={activeRole === r ? 'primary' : 'secondary'}
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

                    <Button
                        onClick={() => {
                            setCreatingNew(true)
                        }}
                        className="flex items-center gap-1"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Criar
                    </Button>
                </div>

                {loading ? (
                    <p className="text-gray-500">Carregando...</p>
                ) : (
                    <List
                        columns={[
                            { key: 'name', label: 'Usuário' },
                            { key: 'registration', label: 'Matrícula/SIAPE' },
                        ]}
                        data={formattedData}
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        showDeleteAction
                        onDelete={(id) => handleDelete(id, activeRole)}
                        onView={setSelected}
                    />
                )}

                <ViewModal
                    isOpen={!!selected}
                    item={selected}
                    onClose={() => setSelected(null)}
                    title={(item) => item.name}
                    renderContent={(item) => <UserDetails user={item} />}
                />

                {activeRole === UserRole.COORDINATOR ? (
                    <UserCoordinatorModal
                        isOpen={creatingNew}
                        onClose={() => setCreatingNew(false)}
                        onSave={(newUser) => handleCreateCoordinator(newUser)}
                    />
                ) : (
                    <UserModal
                        isOpen={creatingNew}
                        onClose={() => setCreatingNew(false)}
                        role={activeRole}
                        onSave={(newUser, role) => handleCreate(newUser, role)}
                    />
                )}
            </div>
        </RoleGuard>
    )
}
