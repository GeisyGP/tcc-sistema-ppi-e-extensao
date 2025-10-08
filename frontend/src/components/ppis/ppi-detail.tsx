import { PPI } from "@/types/ppi.type"

export function PPIDetails({ ppi }: { ppi: PPI }) {
    return (
        <dl className="divide-y divide-gray-200">
            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Ano/Semestre</dt>
                <dd className="text-gray-800">{ppi.classPeriod}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Carga horária</dt>
                <dd className="text-gray-800">{ppi.workload}h</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Disciplinas</dt>
                <dd className="space-y-1">
                    {ppi.subjects && ppi.subjects.length > 0 ? (
                        ppi.subjects.map((subject) => (
                            <div key={subject.name} className="flex items-center gap-2">
                                <span className="text-gray-800">{subject.name}</span>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                    {subject.workload}h
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Sem vínculos</p>
                    )}
                </dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Criado em</dt>
                <dd className="text-gray-800">{ppi.createdAt}</dd>
            </div>

            <div className="py-2 flex">
                <dt className="w-40 text-sm font-semibold text-gray-700">Atualizado em</dt>
                <dd className="text-gray-800">{ppi.updatedAt}</dd>
            </div>
        </dl>
    )
}
