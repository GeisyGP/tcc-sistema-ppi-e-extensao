'use client'

import SearchBar from '@/components/search-bar'
import List from '@/components/list.layout'
import { deleteSubjectById, getAllSubjects } from '@/services/subjects.service'
import { useState, useEffect, useCallback } from 'react'

export default function SubjectsPage() {
    const [page, setPage] = useState(1)
    const [nameFilter, setNameFilter] = useState<string | undefined>()
    const [data, setData] = useState<{ id: string, subject: string, teachers: string, createdAt: string, updatedAt: string }[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true)
                const response = await getAllSubjects({ page, name: nameFilter })
                if (response) {
                    const formattedData = response.items.map(item => ({
                        id: item.id,
                        subject: item.name,
                        teachers: item.teachers.map(t => t.name).join(", "),
                        createdAt: new Date(item.createdAt).toLocaleDateString(),
                        updatedAt: new Date(item.updatedAt).toLocaleDateString()
                    }))
                    setData(formattedData)
                    setTotalPages(response.metadata.totalPages)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchSubjects()
    }, [page, nameFilter])

    const handleDelete = useCallback(async (id: string) => {
        await deleteSubjectById(id)

        setData((prev) => prev.filter((item) => item.id !== id))
    }, [])

    return (
        <div className="w-full mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">Disciplinas</h1>
            <SearchBar
                placeholder="Buscar disciplina..."
                onSearch={(value) => {
                    setNameFilter(value)
                    setPage(1)
                }}
            />

            {loading ? (
                <p className="text-gray-500">Carregando...</p>
            ) : (
                <List
                    columns={[
                        { key: 'subject', label: 'Disciplina' },
                        { key: 'teachers', label: 'Docente(s)' },
                        { key: 'createdAt', label: 'Criado em' },
                        { key: 'updatedAt', label: 'Atualizado em' },
                    ]}
                    data={data}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    showEditAction
                    showDeleteAction
                    // onEdit={(id, row) => console.log("Editar", id, row)}
                    onDelete={(id) => handleDelete(id)}
                />
            )}
        </div>
    )
}
