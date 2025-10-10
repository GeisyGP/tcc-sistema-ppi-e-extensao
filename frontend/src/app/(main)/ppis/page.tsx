"use client"

import SearchBar from "@/components/search-bar"
import List from "@/components/list.layout"
import { useState, useEffect } from "react"
import { ViewModal } from "@/components/view-modal"
import { Button } from "@/components/buttons/default.button"
import { PlusIcon } from "@heroicons/react/16/solid"
import { RoleGuard } from "@/components/role-guard"
import { UserRole } from "@/types/user.type"
import { usePPIs } from "./hooks/use-ppis"
import { PPI, PPIRes } from "@/types/ppi.type"
import { PPIDetails } from "@/components/ppis/ppi-detail"
import { PPIModal } from "@/components/ppis/ppi-modal"
import { useRole } from "@/hooks/use-role"

export default function PPIsPage() {
    const {
        rawData,
        loading,
        fetchPPIs,
        metadata,
        handleCreate,
        handleUpdate,
        handleDelete,
        formattedData,
        handleUpdatePPISubjects,
    } = usePPIs()
    const [page, setPage] = useState(1)
    const [classPeriodFilter, setClassPeriodFilter] = useState<string | undefined>()
    const [selected, setSelected] = useState<PPI | null>(null)
    const [selectedForEdit, setSelectedForEdit] = useState<PPIRes | null>(null)
    const [creatingNew, setCreatingNew] = useState(false)
    const { can } = useRole()

    useEffect(() => {
        fetchPPIs({ page, classPeriod: classPeriodFilter })
    }, [page, classPeriodFilter, fetchPPIs])

    return (
        <RoleGuard roles={[UserRole.COORDINATOR, UserRole.TEACHER]}>
            <div className="w-full mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">PPIs</h1>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Buscar PPI..."
                            onSearch={(value) => {
                                setClassPeriodFilter(value)
                                setPage(1)
                            }}
                        />
                    </div>

                    <RoleGuard roles={[UserRole.COORDINATOR]}>
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
                    <List
                        columns={[
                            { key: "classPeriod", label: "Ano/Semestre" },
                            { key: "subjectsNames", label: "Disciplinas" },
                        ]}
                        data={formattedData}
                        page={page}
                        totalPages={metadata.totalPages}
                        totalItems={metadata.totalItems}
                        onPageChange={setPage}
                        showEditAction={can(UserRole.COORDINATOR)}
                        showDeleteAction={can(UserRole.COORDINATOR)}
                        onDelete={(id) => handleDelete(id)}
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
                    title="PPI"
                    renderContent={(item) => <PPIDetails ppi={item} />}
                />

                <PPIModal isOpen={creatingNew} PPI={null} onClose={() => setCreatingNew(false)} onSave={handleCreate} />

                <PPIModal
                    isOpen={!!selectedForEdit}
                    PPI={selectedForEdit}
                    onClose={() => setSelectedForEdit(null)}
                    onSave={async (updated, changed) => {
                        if (changed?.workload || changed?.classPeriod) {
                            handleUpdate(selectedForEdit?.id as string, updated)
                        }
                        if (changed?.subjects) {
                            handleUpdatePPISubjects(selectedForEdit?.id as string, updated)
                        }
                    }}
                />
            </div>
        </RoleGuard>
    )
}
