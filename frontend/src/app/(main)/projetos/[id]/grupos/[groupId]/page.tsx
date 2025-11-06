"use client"

import { use, useEffect, useState } from "react"
import { useGroupDeliverables } from "../../../../../../hooks/use-group-deliverable"
import { DeliverableStatus, DeliverableStatusMapped } from "@/types/deliverable.type"
import SearchBar from "@/components/search-bar"
import DeliverableListHorizontal from "@/components/deliverables/deliverable-group-list"
import { Button } from "@/components/buttons/default.button"
import BackButton from "@/components/buttons/back.button"
import { useRouter } from "next/navigation"
import { useRole } from "@/hooks/use-role"
import { UserRole } from "@/types/user.type"

export default function GroupDeliverablesPage({ params }: { params: Promise<{ id: string; groupId: string }> }) {
    const { id: projectId, groupId } = use(params)
    const { userRole } = useRole()
    const { loading, metadata, formattedData, fetchDeliverables, fetchUniqueGroup, formattedDataGroup, loadingGroup } =
        useGroupDeliverables()
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<DeliverableStatus>(DeliverableStatus.ACTIVE)
    const [nameFilter, setNameFilter] = useState<string>()
    const router = useRouter()

    const statusOptions = Object.entries(DeliverableStatus)
        .filter(([key]) => !(userRole === UserRole.STUDENT && key === "UPCOMING"))
        .map(([key, value]) => ({
            label: DeliverableStatusMapped[key as keyof typeof DeliverableStatusMapped],
            value,
        }))

    useEffect(() => {
        fetchUniqueGroup(groupId)
    }, [fetchUniqueGroup, groupId])

    useEffect(() => {
        fetchDeliverables(projectId, {
            page,
            limit: 12,
            status: [statusFilter],
            groupId: groupId,
            name: nameFilter,
        })
    }, [page, statusFilter, fetchDeliverables, groupId, projectId, nameFilter])

    return (
        <div className="w-full mx-auto p-6">
            <BackButton />
            <h1 className="text-2xl font-semibold mt-4 mb-6">
                {loadingGroup ? "Carregando grupo..." : `Entregáveis - ${formattedDataGroup?.name || "Sem nome"}`}
            </h1>

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
            </div>

            {loading ? (
                <p className="text-gray-500">Carregando...</p>
            ) : (
                <DeliverableListHorizontal
                    data={formattedData}
                    page={page}
                    totalPages={metadata.totalPages}
                    totalItems={metadata.totalItems}
                    generalVision={false}
                    onPageChange={setPage}
                    onClick={(item) => router.push(`/projetos/${projectId}/grupos/${groupId}/entregaveis/${item.id}`)}
                />
            )}
        </div>
    )
}
