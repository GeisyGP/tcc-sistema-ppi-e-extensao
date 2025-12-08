"use client"

import { Button } from "@/components/buttons/default.button"
import { Card } from "../card"
import { Deliverable } from "@/types/deliverable.type"

type Props = {
    data: Deliverable[]
    page: number
    totalPages: number
    totalItems: number
    generalVision: boolean
    onPageChange: (page: number) => void
    onClick: (item: Deliverable) => void
}

const getEndDateClass = (endDateStr: string) => {
    const endDate = new Date(endDateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const isToday =
        endDate.getDate() === today.getDate() &&
        endDate.getMonth() === today.getMonth() &&
        endDate.getFullYear() === today.getFullYear()

    const isPast = endDate < today && !isToday
    if (isToday) return "bg-gray-100 text-red-600"
    if (isPast) return "bg-gray-100 text-gray-500"
    return "bg-gray-100 text-gray-800"
}

export default function DeliverableListHorizontal({
    data,
    page,
    totalPages,
    totalItems,
    generalVision,
    onPageChange,
    onClick,
}: Props) {
    return (
        <div className="space-y-6">
            <div className="text-sm text-gray-600">{totalItems} resultado(s) encontrado(s)</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((deliverable) => (
                    <Card
                        key={deliverable.id}
                        className="p-4 shadow-sm hover:shadow-md transition rounded-xl border border-gray-200 flex flex-col justify-between"
                    >
                        <div className="cursor-pointer" onClick={() => onClick?.(deliverable)}>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                {deliverable.name}
                            </h3>

                            <div className="text-sm text-gray-500 mt-1">
                                <span className="font-medium">Data Inicial:</span> {deliverable.startDateFormatted}
                            </div>

                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <span className="font-medium">Data Final:</span>
                                <span
                                    className={`ml-1 px-2 py-0.5 rounded-full font-semibold ${getEndDateClass(
                                        deliverable.endDate,
                                    )}`}
                                >
                                    {deliverable.endDateFormatted}
                                </span>
                            </div>

                            {deliverable.subjectName && (
                                <div className="text-sm text-gray-500 mt-1">
                                    <span className="font-medium">Disciplina:</span> {deliverable.subjectName}
                                </div>
                            )}
                        </div>

                        {!generalVision && (
                            <div className="mt-1 self-end">
                                <span
                                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                        deliverable.isSubmitted
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {deliverable.isSubmitted ? "Enviado" : "Pendente"}
                                </span>
                            </div>
                        )}

                        {generalVision && (
                            <div className="mt-1 self-end flex items-center gap-2">
                                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                    {deliverable.artifact.length == 0 && deliverable.content.length == 0
                                        ? "Ainda sem entregas"
                                        : (() => {
                                              const count = new Set([
                                                  ...deliverable.artifact.map((a) => a.groupId),
                                                  ...deliverable.content.map((c) => c.groupId),
                                              ]).size
                                              return `${count} entrega${count > 1 ? "s" : ""}`
                                          })()}
                                </span>
                            </div>
                        )}
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
