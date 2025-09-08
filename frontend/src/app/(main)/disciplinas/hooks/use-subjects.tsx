import { createSubject, deleteSubjectById, getAllSubjects, updateSubjectById } from "@/services/subjects.service"
import { Subject, SubjectRes } from "@/types/subject.types"
import { useCallback, useState } from "react"
import { formatSubject } from "../utils/format-subject"
import toast from "react-hot-toast"

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
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleCreate = useCallback(async (newSubject: SubjectRes) => {
    try {
      const created = await createSubject({ name: newSubject.name, teachers: newSubject.teachers.map(t => t.id), courseId: newSubject.courseId })
      if (created) setFormattedData(prev => [...prev, formatSubject(created)])
      toast.success("Disciplina criada com sucesso")
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [])

  const handleUpdate = useCallback(async (updated: SubjectRes) => {
    try {
      await updateSubjectById(updated.id, { name: updated.name, teachers: updated.teachers.map(t => t.id) })
      setFormattedData(prev => prev.map(d => d.id === updated.id ? formatSubject(updated) : d))
      toast.success("Disciplina atualizada com sucesso")
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteSubjectById(id)
      setFormattedData(prev => prev.filter(d => d.id !== id))
      toast.success("Disciplina deletada com sucesso")
    } catch (error: any) {
      toast.error(error.message)
    }
  }, [])

  return { rawData, formattedData, loading, totalPages, fetchSubjects, handleCreate, handleUpdate, handleDelete }
}
