import { getUserById } from "@/services/users.service"
import { Project } from "@/types/project.type"
import { useState, useEffect, useCallback } from "react"
import { Button } from "../buttons/default.button"

export default function ProjectMetadataPopover({ project }: { project: Project }) {
    const [open, setOpen] = useState(false)
    const [creatorName, setCreatorName] = useState<string | null>(null)
    const [editorName, setEditorName] = useState<string | null>(null)

    const fetchUserNames = useCallback(async () => {
        if (!open || !project || creatorName || editorName) return

        const promises = []

        if (project.createdBy) {
            promises.push(
                getUserById(project.createdBy)
                    .then((user) => setCreatorName(user?.name || null))
                    .catch(() => setCreatorName("")),
            )
        }

        if (project.updatedBy) {
            promises.push(
                getUserById(project.updatedBy)
                    .then((user) => setEditorName(user?.name || null))
                    .catch(() => setEditorName("")),
            )
        }

        await Promise.all(promises)
    }, [creatorName, editorName, open, project])

    useEffect(() => {
        fetchUserNames()
    }, [fetchUserNames])

    return (
        <div className="relative inline-block">
            <Button
                variant="secondary"
                onClick={() => setOpen(!open)}
                className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 transition"
            >
                Registro de Alterações
            </Button>

            {open && (
                <div className="absolute z-50 right-0 mt-2 w-72 bg-white border border-gray-200 shadow-lg rounded p-3 text-sm text-gray-700">
                    <h4 className="font-semibold text-gray-800 mb-2">Registro de alterações</h4>
                    <p>
                        <strong>Criado em:</strong> {project.createdAt}
                    </p>
                    <p>
                        <strong>Criado por:</strong> {creatorName}
                    </p>
                    <p>
                        <strong>Atualizado em:</strong> {project.updatedAt}
                    </p>
                    <p>
                        <strong>Atualizado por:</strong> {editorName}
                    </p>
                </div>
            )}
        </div>
    )
}
