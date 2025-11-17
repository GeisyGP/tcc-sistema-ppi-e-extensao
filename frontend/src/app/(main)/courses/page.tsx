"use client"

import SearchBar from "@/components/search-bar"
import List from "@/components/list.layout"
import { useState, useEffect } from "react"
import { ViewModal } from "@/components/view-modal"
import { Button } from "@/components/buttons/default.button"
import { PlusIcon } from "@heroicons/react/16/solid"
import { useCourses } from "./hooks/use-courses"
import { CourseDetails } from "@/components/courses/course-details"
import { Course, CourseRes } from "@/types/course.type"
import { CourseModal } from "@/components/courses/course-modal"
import { RoleGuard } from "@/components/role-guard"
import { UserRole } from "@/types/user.type"

export default function CoursesPage() {
    const { rawData, formattedData, loading, metadata, fetchCourses, handleCreate, handleUpdate, handleDelete } =
        useCourses()
    const [page, setPage] = useState(1)
    const [nameFilter, setNameFilter] = useState<string | undefined>()
    const [selected, setSelected] = useState<Course | null>(null)
    const [selectedForEdit, setSelectedForEdit] = useState<CourseRes | null>(null)
    const [creatingNew, setCreatingNew] = useState(false)

    useEffect(() => {
        fetchCourses({ page, name: nameFilter })
    }, [page, nameFilter, fetchCourses])

    return (
        <RoleGuard roles={[UserRole.SYSADMIN]}>
            <div className="w-full mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Cursos</h1>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Buscar curso..."
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
                        className="flex items-center gap-1 shadow-sm"
                    >
                        <PlusIcon className="h-6 w-5" />
                        Criar
                    </Button>
                </div>

                {loading ? (
                    <p className="text-gray-500">Carregando...</p>
                ) : (
                    <List
                        columns={[
                            { key: "name", label: "Curso" },
                            { key: "educationLevel", label: "Forma" },
                            { key: "degree", label: "Grau" },
                            { key: "shift", label: "Turno" },
                        ]}
                        data={formattedData}
                        page={page}
                        totalPages={metadata.totalPages}
                        totalItems={metadata.totalItems}
                        onPageChange={setPage}
                        showEditAction
                        showDeleteAction
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
                    renderContent={(item) => <CourseDetails course={item} />}
                />

                <CourseModal
                    isOpen={creatingNew}
                    course={null}
                    onClose={() => setCreatingNew(false)}
                    onSave={handleCreate}
                />

                <CourseModal
                    isOpen={!!selectedForEdit}
                    course={selectedForEdit}
                    onClose={() => setSelectedForEdit(null)}
                    onSave={handleUpdate}
                />
            </div>
        </RoleGuard>
    )
}
