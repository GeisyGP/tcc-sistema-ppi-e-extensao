import { Course } from "@/types/course.types";

export function CourseDetails({ course }: { course: Course }) {
  return (
    <>
      <p><strong>Eixo Tecnológico:</strong> {course.technologicalAxis}</p>
      <p><strong>Forma:</strong> {course.educationLevel}</p>
      <p><strong>Grau:</strong> {course.degree}</p>
      <p><strong>Modalidade:</strong> {course.modality}</p>
      <p><strong>Turno:</strong> {course.shift}</p>
      <p><strong>Criado em:</strong> {course.createdAt}</p>
      <p><strong>Atualizado em:</strong> {course.updatedAt}</p>
    </>
  )
}
