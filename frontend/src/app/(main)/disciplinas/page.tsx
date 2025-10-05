"use client"

import SearchBar from "@/components/search-bar"
import List from "@/components/list.layout"
import { useState, useEffect, useCallback } from "react"
import { ViewModal } from "@/components/view-modal"
import { Subject, SubjectRes } from "@/types/subject.types"
import { SubjectModal } from "@/components/subject-modal"
import { Button } from "@/components/buttons/default.button"
import { PlusIcon } from "@heroicons/react/16/solid"
import { FilterButton } from "@/components/buttons/filter.button"
import { getAllUsers } from "@/services/users.service"
import { SubjectDetails } from "@/components/subject-details"
import { useSubjects } from "./hooks/use-subjects"
import { RoleGuard } from "@/components/role-guard"
import { UserRole } from "@/types/user.type"
import { useRole } from "@/hooks/use-role"

export default function SubjectsPage() {
    const { rawData, formattedData, loading, totalPages, fetchSubjects, handleCreate, handleUpdate, handleDelete } =
        useSubjects()
    const [page, setPage] = useState(1)
    const [nameFilter, setNameFilter] = useState<string | undefined>()
    const [selected, setSelected] = useState<Subject | null>(null)
    const [selectedForEdit, setSelectedForEdit] = useState<SubjectRes | null>(null)
    const [creatingNew, setCreatingNew] = useState(false)
    const [teacherIdFilter, setTeacherIdFilter] = useState<string>()
    const { can } = useRole()

    useEffect(() => {
        fetchSubjects({ page, name: nameFilter, teacherId: teacherIdFilter })
    }, [page, nameFilter, teacherIdFilter, fetchSubjects])

    const fetchTeacherOptions = useCallback(async () => {
        const data = await getAllUsers({ role: ["TEACHER"] })
        return (
            data?.items.map((u) => ({
                label: `${u.name} (${u.registration})`,
                value: u.id,
            })) || []
        )
    }, [])

    return (
        <RoleGuard roles={[UserRole.TEACHER, UserRole.COORDINATOR]}>
            <div className="w-full mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Disciplinas</h1>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Buscar disciplina..."
                            onSearch={(value) => {
                                setNameFilter(value)
                                setPage(1)
                            }}
                        />
                    </div>

                    <FilterButton
                        filters={[
                            {
                                key: "teacherId",
                                label: "Docente",
                                type: "select",
                                onLoadOptions: fetchTeacherOptions,
                            },
                        ]}
                        onApply={(values) => {
                            setTeacherIdFilter(values.teacherId || undefined)
                            setPage(1)
                        }}
                    />

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
                            { key: "name", label: "Disciplina" },
                            { key: "teachers", label: "Docentes" },
                        ]}
                        data={formattedData}
                        page={page}
                        totalPages={totalPages}
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
                    title={(item) => item.name}
                    renderContent={(item) => <SubjectDetails subject={item} />}
                />

                <SubjectModal
                    isOpen={creatingNew}
                    subject={null}
                    onClose={() => setCreatingNew(false)}
                    onSave={handleCreate}
                />

                <SubjectModal
                    isOpen={!!selectedForEdit}
                    subject={selectedForEdit}
                    onClose={() => setSelectedForEdit(null)}
                    onSave={handleUpdate}
                />
            </div>
        </RoleGuard>
    )
}
