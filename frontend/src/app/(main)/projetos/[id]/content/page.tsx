"use client"

import { use, useEffect, useState } from "react"
import { useRole } from "@/hooks/use-role"
import { Button } from "@/components/buttons/default.button"
import { useContentProject } from "./hooks/use-content-project"
import { Editor } from "@/components/editor/editor"
import { ProjectFullRes } from "@/types/project.type"
import BackButton from "@/components/buttons/back.button"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { UserRole } from "@/types/user.type"

export default function ProjectContentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params)
    const { userRole } = useRole()
    const { rawData, loading, fetchProject, handleUpdate } = useContentProject()
    const [localData, setLocalData] = useState<ProjectFullRes>()
    const [editingField, setEditingField] = useState<string | null>(null)

    const [theme, setTheme] = useState<string>("")
    const [scope, setScope] = useState<string>("")
    const [justification, setJustification] = useState<string>("")
    const [generalObjective, setGeneralObjective] = useState<string>("")
    const [specificObjectives, setSpecificObjectives] = useState<string>("")
    const [subjectsContributions, setSubjectsContributions] = useState<string>("")
    const [methodology, setMethodology] = useState<string>("")
    const [timeline, setTimeline] = useState<string>("")

    const canEdit = () => {
        if (userRole === UserRole.COORDINATOR) return true

        if (userRole === UserRole.TEACHER) {
            return localData?.userHasDefaultAccess
        }

        return false
    }

    useEffect(() => {
        fetchProject(projectId)
    }, [fetchProject, projectId])

    useEffect(() => {
        if (rawData) {
            setLocalData(rawData)
            setTheme(rawData.theme || "")
            setScope(rawData.scope || "")
            setJustification(rawData.justification || "")
            setGeneralObjective(rawData.generalObjective || "")
            setSpecificObjectives(rawData.specificObjectives || "")
            setSubjectsContributions(rawData.subjectsContributions || "")
            setMethodology(rawData.methodology || "")
            setTimeline(rawData.timeline || "")
        }
    }, [rawData])

    const handleSave = async (field: string) => {
        const updateInput: Record<string, string | null> = {}

        switch (field) {
            case "theme":
                updateInput.theme = theme
                break
            case "scope":
                updateInput.scope = scope
                break
            case "justification":
                updateInput.justification = justification
                break
            case "generalObjective":
                updateInput.generalObjective = generalObjective
                break
            case "specificObjectives":
                updateInput.specificObjectives = specificObjectives
                break
            case "subjectsContributions":
                updateInput.subjectsContributions = subjectsContributions
                break
            case "methodology":
                updateInput.methodology = methodology
                break
            case "timeline":
                updateInput.timeline = timeline
                break
        }

        await handleUpdate(projectId, updateInput)
        setEditingField(null)
    }

    const handleCancel = (field: string) => {
        if (!rawData) return

        const originalValue = (rawData as any)[field] || ""

        switch (field) {
            case "theme":
                setTheme(originalValue)
                break
            case "scope":
                setScope(originalValue)
                break
            case "justification":
                setJustification(originalValue)
                break
            case "generalObjective":
                setGeneralObjective(originalValue)
                break
            case "specificObjectives":
                setSpecificObjectives(originalValue)
                break
            case "subjectsContributions":
                setSubjectsContributions(originalValue)
                break
            case "methodology":
                setMethodology(originalValue)
                break
            case "timeline":
                setTimeline(originalValue)
                break
        }

        setEditingField(null)
    }

    if (loading || !localData) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 text-lg">Carregando conteúdo do projeto...</p>
            </div>
        )
    }

    const renderSection = (
        title: string,
        field: string,
        content: string,
        setContent: (value: string) => void,
        isTextOnly = false,
    ) => (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold mb-1">{title}</h1>
                {canEdit() &&
                    (editingField === field ? (
                        <div className="flex gap-2">
                            <Button onClick={() => handleSave(field)}>Salvar</Button>
                            <Button variant="secondary" onClick={() => handleCancel(field)}>
                                Cancelar
                            </Button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setEditingField(field)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-700 transition"
                            title="Editar"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                    ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                {isTextOnly ? (
                    editingField === field ? (
                        <div>
                            <input
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder={`Digite ${title.toLowerCase()}...`}
                            />
                            <p className="text-sm text-gray-500 mt-1">{content.length}/100 caracteres</p>
                        </div>
                    ) : (
                        <p className="text-gray-800">{content}</p>
                    )
                ) : (
                    <Editor initialContent={content} onChange={setContent} editable={editingField === field} />
                )}
            </div>
        </div>
    )

    return (
        <div className="p-6 space-y-8 max-w-3xl mx-auto">
            <BackButton />
            <h1 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                PROJETO DE PRÁTICA PROFISSIONAL INTEGRADA - PPI
            </h1>
            {renderSection("Tema", "theme", theme, setTheme, true)}
            {renderSection("Delimitação do Tema", "scope", scope, setScope)}
            {renderSection("Justificativa", "justification", justification, setJustification)}
            {renderSection("Objetivo Geral", "generalObjective", generalObjective, setGeneralObjective)}
            {renderSection("Objetivos Específicos", "specificObjectives", specificObjectives, setSpecificObjectives)}
            {renderSection(
                "Contribuições das Disciplinas",
                "subjectsContributions",
                subjectsContributions,
                setSubjectsContributions,
            )}
            {renderSection("Metodologia", "methodology", methodology, setMethodology)}
            {renderSection("Cronograma", "timeline", timeline, setTimeline)}
        </div>
    )
}
