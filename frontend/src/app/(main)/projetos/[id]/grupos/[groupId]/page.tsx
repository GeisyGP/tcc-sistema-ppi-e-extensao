"use client"

import { use, useEffect, useState } from "react"
import { useGroupDeliverables } from "../../../../../../hooks/use-group-deliverable"
import {
    DeliverableStatus,
    DeliverableStatusMapped,
    DeliverableWithContentAndArtifactRes,
} from "@/types/deliverable.type"
import SearchBar from "@/components/search-bar"
import DeliverableListHorizontal from "@/components/deliverables/deliverable-group-list"
import { Button } from "@/components/buttons/default.button"
import BackButton from "@/components/buttons/back.button"

export default function GroupDeliverablesPage({ params }: { params: Promise<{ id: string; groupId: string }> }) {
    const { id: projectId, groupId } = use(params)
    const {
        loading,
        metadata,
        formattedData,
        rawData,
        fetchDeliverables,
        fetchUniqueGroup,
        formattedDataGroup,
        loadingGroup,
    } = useGroupDeliverables()
    const [page, setPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<DeliverableStatus>(DeliverableStatus.ACTIVE)
    const [nameFilter, setNameFilter] = useState<string>()
    const [selectedForSubmit, setSelectedForSubmit] = useState<DeliverableWithContentAndArtifactRes | null>()

    const statusOptions = Object.entries(DeliverableStatus).map(([key, value]) => ({
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
                    onClick={(row) => {
                        const original = rawData.find((r) => r.id === row.id) || null
                        setSelectedForSubmit(original)
                        console.log(selectedForSubmit) //TODO: remove this
                    }}
                />
            )}
        </div>
    )
}
