'use client'

import SearchBar from '@/components/search-bar'
import List from '@/components/list.layout'
import { createSubject, deleteSubjectById, getAllSubjects, updateSubjectById } from '@/services/subjects.service'
import { useState, useEffect, useCallback } from 'react'
import { ViewModal } from '@/components/view-modal'
import { Subject, SubjectRes } from '@/types/subject.types'
import { SubjectModal } from '@/components/subject-modal'
import { formatSubject } from './utils/format-subject'
import { Button } from '@/components/buttons/default.button'
import { PlusIcon } from '@heroicons/react/16/solid'
import { FilterButton } from '@/components/buttons/filter.button'
import { getAllUsers } from '@/services/users.service'

export default function SubjectsPage() {
    const [page, setPage] = useState(1)
    const [nameFilter, setNameFilter] = useState<string | undefined>()
    const [rawData, setRawData] = useState<SubjectRes[]>([])
    const [formattedData, setFormattedData] = useState<Subject[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState<Subject | null>(null)
    const [selectedForEdit, setSelectedForEdit] = useState<SubjectRes | null>(null)
    const [creatingNew, setCreatingNew] = useState(false)
    const [teacherIdFilter, setTeacherIdFilter] = useState<string>()

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true)
                const response = await getAllSubjects({ page, name: nameFilter, teacherId: teacherIdFilter })
                if (response) {
                    setRawData(response.items)
                    const formattedData = response.items.map(item => (formatSubject(item)))
                    setFormattedData(formattedData)
                    setTotalPages(response.metadata.totalPages)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchSubjects()
    }, [page, nameFilter, teacherIdFilter])

    const handleDelete = useCallback(async (id: string) => {
        await deleteSubjectById(id)

        setFormattedData((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const handleUpdate = useCallback(async (updated: SubjectRes) => {
        await updateSubjectById(updated.id, {
            name: updated.name,
            teachers: updated.teachers.map(t => t.id),
        })

        setFormattedData(prev =>
            prev.map(d =>
                d.id === updated.id ? formatSubject(updated) : d
            )
        )

        setSelectedForEdit(null)
    }, [])

    const handleCreate = async (newSubject: SubjectRes) => {
        const created = await createSubject({
            name: newSubject.name,
            teachers: newSubject.teachers.map(t => t.id),
        })

        if (created) {
            setFormattedData(prev => [...prev, formatSubject(created)])
            setCreatingNew(false)
        }
    }

    const fetchTeacherOptions = useCallback(async () => {
        const data = await getAllUsers({ role: "TEACHER" })
        return (
            data?.items.map(u => ({
                label: `${u.name} (${u.registration})`,
                value: u.id,
            })) || []
        )
    }, [])

    return (
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
                        { key: 'name', label: 'Disciplina' },
                        { key: 'teachers', label: 'Docentes' },
                    ]}
                    data={formattedData}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    showEditAction
                    showDeleteAction
                    onDelete={(id) => handleDelete(id)}
                    onView={setSelected}
                    onEdit={(row) => {
                        const original = rawData.find(r => r.id === row.id) || null
                        setSelectedForEdit(original)
                    }}
                />
            )}

            <ViewModal
                isOpen={!!selected}
                item={selected}
                onClose={() => setSelected(null)}
                title={(item) => item.name}
                renderContent={(item) => (
                    <>
                        <p><strong>Docente(s):</strong> {item.teachers}</p>
                        <p><strong>Criado em:</strong> {item.createdAt}</p>
                        <p><strong>Atualizado em:</strong> {item.updatedAt}</p>
                    </>
                )}
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
    )
}
