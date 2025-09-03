import { Subject } from "@/types/subject.types"

export function SubjectDetails({ subject }: { subject: Subject }) {
  return (
    <>
      <p><strong>Docente(s):</strong> {subject.teachers}</p>
      <p><strong>Criado em:</strong> {subject.createdAt}</p>
      <p><strong>Atualizado em:</strong> {subject.updatedAt}</p>
    </>
  )
}
