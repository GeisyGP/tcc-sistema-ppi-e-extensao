import { Course } from "@/types/course.types"

export function CourseDetails({ course }: { course: Course }) {
    return (
        <dl className="divide-y divide-gray-200">
            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Eixo Tecnológico</dt>
                <dd className="text-gray-800">{course.technologicalAxis}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Forma</dt>
                <dd className="text-gray-800">{course.educationLevel}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Grau</dt>
                <dd className="text-gray-800">{course.degree}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Modalidade</dt>
                <dd className="text-gray-800">{course.modality}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Turno</dt>
                <dd className="text-gray-800">{course.shift}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Criado em</dt>
                <dd className="text-gray-800">{course.createdAt}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Atualizado em</dt>
                <dd className="text-gray-800">{course.updatedAt}</dd>
            </div>
        </dl>
    )
}
