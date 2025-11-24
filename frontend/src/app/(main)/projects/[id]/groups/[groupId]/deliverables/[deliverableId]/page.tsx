"use client"

import { use, useEffect, useState } from "react"
import { DeliverableContentSimple } from "@/types/deliverable.type"
import { Button } from "@/components/buttons/default.button"
import { useArtifacts } from "@/hooks/use-artifacts"
import { useUniqueDeliverable } from "./hooks/use-unique-deliverable"
import { FileIcon } from "@/components/file-icon"
import { DeleteButtonModal } from "@/components/buttons/delete.button"
import { ArrowDownTrayIcon, PencilSquareIcon } from "@heroicons/react/20/solid"
import { useUniqueArtifact } from "./hooks/use-unique-artifact"
import { useDeliverableContent } from "./hooks/use-deliverable-content"
import { useRole } from "@/hooks/use-role"
import { UserRole } from "@/types/user.type"
import BackButton from "@/components/buttons/back.button"
import { useGroupDeliverables } from "@/hooks/use-group-deliverable"
import { abbreviateName } from "../../../../utils/format-group"

export default function DeliverableSubmitPage({
    params,
}: {
    params: Promise<{ id: string; groupId: string; deliverableId: string }>
}) {
    const { deliverableId, groupId } = use(params)
    const { userRole, userId } = useRole()
    const [content, setContent] = useState<DeliverableContentSimple | null>(null)
    const [contentDraft, setContentDraft] = useState("")
    const { loading, formattedData, rawData, fetchDeliverableById } = useUniqueDeliverable()
    const { fetchUniqueGroup, loadingGroup, formattedDataGroup } = useGroupDeliverables()
    const [fileInput, setFileInput] = useState<File | null>(null)

    const { handleCreate, handleDelete, handleUpdate } = useDeliverableContent()
    const {
        loadingProject: loadingArtifactProject,
        handleCreateDeliverableArtifact,
        handleUpdateArtifact,
        handleDownloadArtifact,
        handleViewArtifact,
    } = useArtifacts()

    const { formattedDataArtifact, fetchArtifactById, loading: loadingArtifact } = useUniqueArtifact()

    useEffect(() => {
        fetchDeliverableById(deliverableId, groupId)
        fetchUniqueGroup(groupId)
    }, [fetchDeliverableById, deliverableId, groupId, fetchUniqueGroup])

    useEffect(() => {
        if (formattedData) {
            const cnt = formattedData.content?.[0] ?? null
            setContent(cnt)
            setContentDraft(cnt?.content ?? "")
        }
    }, [formattedData])

    useEffect(() => {
        if (formattedData && formattedData?.artifact.length > 0) {
            fetchArtifactById(formattedData.artifact[0].id)
        }
    }, [fetchArtifactById, formattedData, formattedData?.artifact])

    const handleAddArtifact = async () => {
        if (!fileInput) return
        await handleCreateDeliverableArtifact(deliverableId, { groupId }, fileInput)
        await fetchDeliverableById(deliverableId, groupId)
        setFileInput(null)
    }

    const canEdit = () => {
        if (!rawData) return false
        if (new Date(rawData.endDate).getTime() < new Date().getTime()) return false
        if (new Date(rawData.startDate).getTime() > new Date().getTime()) return false

        if (userRole !== UserRole.STUDENT) return false

        if (!formattedDataGroup?.users.find((user) => user.id === userId)) {
            return false
        }

        return true
    }

    return (
        <div className="w-full mx-auto p-6">
            <BackButton />
            <div className="w-full p-8 space-y-6 rounded-xl bg-gray-50 shadow-md mt-4">
                <div className="overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-4">Submissão de Entregáveis</h2>

                    {loading || !formattedData ? (
                        "Carregando..."
                    ) : (
                        <div className="space-y-3">
                            <div className="text-sm text-gray-700">
                                <p>
                                    <strong>Nome:</strong> {formattedData.name}
                                </p>
                                <p>
                                    <strong>Descrição:</strong> {formattedData.description}
                                </p>
                                {formattedData.subjectName && (
                                    <p>
                                        <strong>Disciplina:</strong> {formattedData.subjectName}
                                    </p>
                                )}
                                <p>
                                    <strong>Data inicial:</strong> {new Date(formattedData.startDate).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Data final:</strong> {new Date(formattedData.endDate).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-700 flex flex-wrap gap-x-1 gap-y-1 mb-6">
                                    {loadingGroup ? (
                                        "Carregando grupo..."
                                    ) : (
                                        <>
                                            <strong>Discentes do grupo:</strong>
                                            {formattedDataGroup?.users.map((us, i) => (
                                                <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                                    {abbreviateName(us.name)}
                                                </span>
                                            ))}
                                        </>
                                    )}
                                </p>
                            </div>

                            {canEdit() && (
                                <p className="text-gray-500 italic mt-2 border-l-2 border-green-400 pl-2 text-sm leading-snug">
                                    Você pode enviar um arquivo ou escrever na caixa de texto.
                                </p>
                            )}

                            <hr className="border-gray-200 my-4" />

                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Arquivo</label>

                                {loadingArtifact ? (
                                    <div className="text-gray-500 text-sm">Carregando...</div>
                                ) : formattedDataArtifact ? (
                                    <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <div
                                            key={formattedDataArtifact.id}
                                            onClick={async () => {
                                                await handleViewArtifact(formattedDataArtifact.id)
                                            }}
                                            title={`Nome: ${formattedDataArtifact.name}\nTamanho: ${(Number(formattedDataArtifact.size) / 1024).toFixed(2)} KB\nTipo: ${formattedDataArtifact.mimeType}\nCriado em: ${formattedDataArtifact.createdAt}`}
                                            className="relative cursor-pointer w-24 h-24 flex flex-col items-center justify-center border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                                        >
                                            <FileIcon
                                                mimeType={formattedDataArtifact.mimeType}
                                                className="w-10 h-10 mb-1"
                                            />

                                            <div className="text-center text-xs text-gray-700 truncate w-full px-1">
                                                {formattedDataArtifact.name}
                                            </div>

                                            <div className="absolute top-1 right-1 flex gap-1">
                                                {canEdit() && (
                                                    <>
                                                        <label
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="cursor-pointer bg-white bg-opacity-80 rounded-full p-1 hover:bg-opacity-100"
                                                            title="Editar arquivo"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4 text-gray-700" />

                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                onChange={async (e) => {
                                                                    const newFile = e.target.files?.[0]
                                                                    if (newFile) {
                                                                        await handleUpdateArtifact(
                                                                            formattedDataArtifact.id,
                                                                            deliverableId,
                                                                            newFile,
                                                                        )
                                                                        await fetchDeliverableById(
                                                                            deliverableId,
                                                                            groupId,
                                                                        )
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </>
                                                )}

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDownloadArtifact(formattedDataArtifact.id)
                                                    }}
                                                    className="bg-white bg-opacity-80 rounded-full p-1 hover:bg-opacity-100"
                                                    title="Download"
                                                >
                                                    <ArrowDownTrayIcon className="w-4 h-4 text-gray-700" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {canEdit() ? (
                                            <label className="cursor-pointer w-fit inline-block">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => setFileInput(e.target.files?.[0] || null)}
                                                />
                                                <div className="px-3 py-1 bg-gray-200 text-black rounded-lg text-sm hover:bg-gray-300">
                                                    Adicionar arquivo
                                                </div>
                                            </label>
                                        ) : (
                                            <div className="text-gray-500 text-sm italic">Nenhum arquivo enviado</div>
                                        )}
                                    </>
                                )}

                                {canEdit() && fileInput && (
                                    <div className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer p-1">
                                        <p className="text-xs truncate w-full text-center">{fileInput.name}</p>
                                        {loadingArtifactProject ? (
                                            <div className="flex flex-col items-center">
                                                <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                                                <p className="text-xs mt-1">Enviando...</p>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleAddArtifact}
                                                className="mt-1 px-2 py-1 bg-green-700 text-white rounded hover:bg-green-900 text-xs"
                                            >
                                                Enviar
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <hr className="border-gray-200 my-4" />
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Conteúdo (texto ou link)</label>

                                {canEdit() ? (
                                    <>
                                        <textarea
                                            value={contentDraft}
                                            onChange={(e) => setContentDraft(e.target.value)}
                                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 h-32 text-sm"
                                        />

                                        <div className="flex gap-2 mt-2 items-center">
                                            <Button
                                                variant="primary"
                                                disabled={!contentDraft.trim() || contentDraft === content?.content}
                                                onClick={() => {
                                                    if (content) {
                                                        handleUpdate(content.id, {
                                                            content: contentDraft,
                                                        })
                                                    } else {
                                                        handleCreate({ content: contentDraft, deliverableId, groupId })
                                                    }
                                                }}
                                                className="px-3 py-1 text-sm"
                                            >
                                                Salvar texto
                                            </Button>
                                            {content && <DeleteButtonModal id={content.id} onDelete={handleDelete} />}
                                        </div>
                                    </>
                                ) : content?.content ? (
                                    <div className="mt-1 p-2 border rounded border-gray-200 bg-gray-50 text-sm whitespace-pre-wrap">
                                        {content?.content}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm italic">Nenhum conteúdo enviado</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
