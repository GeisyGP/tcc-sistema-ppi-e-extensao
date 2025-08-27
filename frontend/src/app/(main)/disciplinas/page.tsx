'use client'

import SearchBar from '@/components/global/search-bar'
import List from '@/components/layout/list.layout'
import { getAllSubjects } from '@/services/subjects.service'
import { useState, useEffect } from 'react'

export default function SubjectsPage() {
    const [page, setPage] = useState(1)
    const [nameFilter, setNameFilter] = useState<string | undefined>()
    const [data, setData] = useState<{ subject: string, teachers: string, createdAt: string, updatedAt: string }[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true)
                const response = await getAllSubjects({ page, name: nameFilter })
                if (response) {
                    console.log(response)
                    const formattedData = response.items.map(item => ({
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
                />
            )}
        </div>
    )
}
