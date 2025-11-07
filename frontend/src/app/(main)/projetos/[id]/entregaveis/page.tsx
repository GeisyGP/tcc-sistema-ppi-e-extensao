"use client"

import { use, useEffect, useState } from "react"
import { Deliverable, DeliverableStatus, DeliverableStatusMapped } from "@/types/deliverable.type"
import SearchBar from "@/components/search-bar"
import DeliverableListHorizontal from "@/components/deliverables/deliverable-group-list"
import { Button } from "@/components/buttons/default.button"
import BackButton from "@/components/buttons/back.button"
import { useGroupDeliverables } from "@/hooks/use-group-deliverable"
import { DeliverableModal } from "@/components/deliverables/deliverable-modal"
import { PlusIcon } from "@heroicons/react/20/solid"
import { UserRole } from "@/types/user.type"
import { RoleGuard } from "@/components/role-guard"

export default function DeliverablesPage({ params }: { params: Promise<{ id: string; groupId: string }> }) {
    const { id: projectId } = use(params)
    const { loading, metadata, rawData, formattedData, fetchDeliverables, handleCreate, handleDelete, handleUpdate } =
        useGroupDeliverables()
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<DeliverableStatus>(DeliverableStatus.ACTIVE)
    const [nameFilter, setNameFilter] = useState<string>()
    const [creatingNew, setCreatingNew] = useState<boolean>(false)
    const [selectedForEdit, setSelectedForEdit] = useState<Deliverable | null>(null)

    const statusOptions = Object.entries(DeliverableStatus).map(([key, value]) => ({
        label: DeliverableStatusMapped[key as keyof typeof DeliverableStatusMapped],
        value,
    }))

    useEffect(() => {
        fetchDeliverables(projectId, {
            page,
            limit: 12,
            status: [statusFilter],
            name: nameFilter,
        })
    }, [page, statusFilter, fetchDeliverables, projectId, nameFilter])

    return (
        <>
            {loading || !rawData ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-lg">Carregando...</p>
                </div>
            ) : metadata.totalItems === 0 || rawData[0]?.canUserManage ? (
                <>
                    <div className="w-full mx-auto p-6">
                        <BackButton />
                        <h1 className="text-2xl font-semibold mt-4 mb-6">{"Gerenciar Entregáveis"}</h1>

                        <div className="flex gap-2 mb-4">
                            {statusOptions.map((status) => (
                                <Button
                                    key={status.value}
                                    variant={statusFilter === status.value ? "primary" : "secondary"}
                                    onClick={() => {
                                        setStatusFilter(status.value)
                                        setPage(1)
                                    }}
                                >
                                    {status.label}
                                </Button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex-1">
                                <SearchBar
                                    placeholder="Buscar entregável..."
                                    onSearch={(value) => {
                                        setNameFilter(value)
                                        setPage(1)
                                    }}
                                />
                            </div>
                            <RoleGuard roles={[UserRole.COORDINATOR, UserRole.TEACHER]}>
                                <Button
                                    onClick={() => {
                                        setCreatingNew(true)
                                    }}
                                    className="flex items-center gap-1 shadow-sm"
                                >
                                    <PlusIcon className="h-6 w-5" />
                                    Criar
                                </Button>
                            </RoleGuard>
                        </div>

                        {loading ? (
                            <p className="text-gray-500">Carregando...</p>
                        ) : (
                            <DeliverableListHorizontal
                                data={formattedData}
                                page={page}
                                totalPages={metadata.totalPages}
                                totalItems={metadata.totalItems}
                                generalVision={true}
                                onPageChange={setPage}
                                onClick={(row) => {
                                    const original = formattedData.find((r) => r.id === row.id) || null
                                    setSelectedForEdit(original)
                                }}
                            />
                        )}

                        <DeliverableModal
                            isOpen={creatingNew}
                            deliverable={null}
                            projectId={projectId}
                            onClose={() => setCreatingNew(false)}
                            onSave={async (updated) => {
                                handleCreate({
                                    name: updated.name,
                                    description: updated.description,
                                    endDate: updated.endDate as unknown as Date,
                                    startDate: updated.startDate as unknown as Date,
                                    projectId,
                                    subjectId: updated?.subjectId ? updated.subjectId : undefined,
                                })
                            }}
                        />

                        <DeliverableModal
                            isOpen={!!selectedForEdit}
                            deliverable={selectedForEdit}
                            projectId={projectId}
                            onClose={() => setSelectedForEdit(null)}
                            onSave={async (updated) => {
                                handleUpdate(updated.id, {
                                    name: updated.name,
                                    description: updated.description,
                                    endDate: updated.endDate as unknown as Date,
                                    startDate: updated.startDate as unknown as Date,
                                })
                            }}
                            onDelete={handleDelete}
                        />
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-lg">Sem permissão para acessar</p>
                </div>
            )}
        </>
    )
}
