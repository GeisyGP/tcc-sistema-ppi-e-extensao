'use client'

import SearchBar from '@/components/search-bar'
import List from '@/components/list.layout'
import { useState, useEffect } from 'react'
import { ViewModal } from '@/components/view-modal'
import { Button } from '@/components/buttons/default.button'
import { PlusIcon } from '@heroicons/react/16/solid'
import { RoleGuard } from '@/components/role-guard'
import { User, UserRole } from '@/types/user.type'
import { useUsers } from './hooks/use-users'
import { UserDetails } from '@/components/user-details'
import { UserModal } from '@/components/user-modal'

export default function UsersPage() {
    const { formattedData, loading, totalPages, fetchUsers, handleCreateCoordinator, handleDelete } = useUsers()
    const [page, setPage] = useState(1)
    const [nameFilter, setNameFilter] = useState<string | undefined>()
    const [selected, setSelected] = useState<User | null>(null)
    const [creatingNew, setCreatingNew] = useState(false)

    useEffect(() => { fetchUsers({ page, name: nameFilter }) }, [page, nameFilter, fetchUsers])

    return (
        <RoleGuard roles={[UserRole.SYSADMIN]}>
            <div className="w-full mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Usuários</h1>
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
                        onDelete={(id) => handleDelete(id)}
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

                <UserModal
                    isOpen={creatingNew}
                    onClose={() => setCreatingNew(false)}
                    onSave={handleCreateCoordinator} //TODO: make dynamic
                />
            </div>
        </RoleGuard>
    )
}
