"use client"

import { Button } from "@/components/buttons/default.button"
import { Card } from "../card"
import { Project, ProjectStatusMapped } from "@/types/project.type"
import { useRouter } from "next/navigation"

type Props = {
    data: Project[]
    page: number
    totalPages: number
    totalItems: number
    onPageChange: (page: number) => void
}

export default function ProjectListHorizontal({ data, page, totalPages, totalItems, onPageChange }: Props) {
    const router = useRouter()
    return (
        <div className="space-y-6">
            <div className="text-sm text-gray-600">{totalItems} resultado(s) encontrado(s)</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((project) => (
                    <Card
                        key={project.id}
                        className="p-4 shadow-sm hover:shadow-md transition rounded-xl border border-gray-200 flex flex-col justify-between"
                    >
                        <div
                            className="cursor-pointer flex flex-col"
                            onClick={() => router.push(`/projetos/${project.id}`)}
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                    {project.theme}
                                </h3>

                                <div className="text-sm text-gray-500 mt-1">
                                    <span className="font-medium">PPI:</span> {project.ppiClassPeriod}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span className="font-medium">Turma:</span> {project.class}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span className="font-medium">Período de execução:</span> {project.executionPeriod}
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto pt-2 self-end">
                            <span
                                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                    project.status === ProjectStatusMapped.NOT_STARTED
                                        ? "bg-gray-100 text-gray-700"
                                        : project.status === ProjectStatusMapped.STARTED
                                          ? "bg-blue-100 text-blue-700"
                                          : project.status === ProjectStatusMapped.FINISHED
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {project.status}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <Button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
                        Anterior
                    </Button>
                    <span className="text-sm text-gray-600">
                        Página {page} de {totalPages}
                    </span>
                    <Button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
                        Próxima
                    </Button>
                </div>
            )}
        </div>
    )
}
