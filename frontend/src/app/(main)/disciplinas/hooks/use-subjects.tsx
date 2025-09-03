import { createSubject, deleteSubjectById, getAllSubjects, updateSubjectById } from "@/services/subjects.service"
import { Subject, SubjectRes } from "@/types/subject.types"
import { useCallback, useState } from "react"
import { formatSubject } from "../utils/format-subject"

export function useSubjects() {
  const [rawData, setRawData] = useState<SubjectRes[]>([])
  const [formattedData, setFormattedData] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)

  const fetchSubjects = useCallback(async (params: { page: number, name?: string, teacherId?: string }) => {
    setLoading(true)
    try {
      const response = await getAllSubjects(params)
      if (response) {
        setRawData(response.items)
        setFormattedData(response.items.map(formatSubject))
        setTotalPages(response.metadata.totalPages)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleCreate = useCallback(async (newSubject: SubjectRes) => {
    const created = await createSubject({ name: newSubject.name, teachers: newSubject.teachers.map(t => t.id) })
    if (created) setFormattedData(prev => [...prev, formatSubject(created)])
  }, [])

  const handleUpdate = useCallback(async (updated: SubjectRes) => {
    await updateSubjectById(updated.id, { name: updated.name, teachers: updated.teachers.map(t => t.id) })
    setFormattedData(prev => prev.map(d => d.id === updated.id ? formatSubject(updated) : d))
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    await deleteSubjectById(id)
    setFormattedData(prev => prev.filter(d => d.id !== id))
  }, [])

  return { rawData, formattedData, loading, totalPages, fetchSubjects, handleCreate, handleUpdate, handleDelete }
}
