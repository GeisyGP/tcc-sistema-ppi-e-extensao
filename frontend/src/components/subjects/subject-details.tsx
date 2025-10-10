import { Subject } from "@/types/subject.type"

export function SubjectDetails({ subject }: { subject: Subject }) {
    return (
        <dl className="divide-y divide-gray-200">
            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Docente(s)</dt>
                <dd className="text-gray-800">{subject.teachers || "Não informado"}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Criado em</dt>
                <dd className="text-gray-800">{subject.createdAt}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Atualizado em</dt>
                <dd className="text-gray-800">{subject.updatedAt}</dd>
            </div>
        </dl>
    )
}
