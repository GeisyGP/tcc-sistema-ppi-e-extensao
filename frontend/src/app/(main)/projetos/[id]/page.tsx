"use client"

import { use, useEffect, useState } from "react"
import { Button } from "@/components/buttons/default.button"
import { GroupModal } from "@/components/groups/group-modal"
import { useGroups } from "./hooks/use-group"
import { useUniqueProject } from "./hooks/use-unique-project"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { GroupRes } from "@/types/group.type"
import { abbreviateName } from "./utils/format-group"
import { useUniquePPI } from "./hooks/use-unique-ppi"
import { DeleteButtonModal } from "@/components/buttons/delete.button"
import { ProjectStatusMapped } from "@/types/project.type"
import { UserRole } from "@/types/user.type"
import { ProjectModal } from "@/components/projects/project-modal"
import { ProjectStatusModal } from "@/components/projects/project-status-modal"
import ProjectMetadataPopover from "@/components/projects/project-metadata-popover"
import { VisibilityTogglePopover } from "@/components/projects/visibility-toggle-popover"
import { useRole } from "@/hooks/use-role"
import { SubjectRes } from "@/types/subject.type"
import { getAllSubjects } from "@/services/subjects.service"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { userRole, userId } = useRole()
    const { id: projectId } = use(params)
    const [isCreatingGroup, setIsCreatingGroup] = useState(false)
    const [isEditingGroup, setIsEditingGroup] = useState(false)
    const [isEditingProject, setIsEditingProject] = useState(false)
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
    const [groupSelectedForEdit, setGroupSelectedForEdit] = useState<GroupRes | null>(null)
    const [teacherSubjects, setTeacherSubjects] = useState<SubjectRes[]>([])

    const {
        fetchGroups,
        formattedData: groupFormattedData,
        rawData: groupRawData,
        handleCreate,
        handleUpdate: handleUpdateGroup,
        handleDelete: handleDeleteGroup,
    } = useGroups()

    const { fetchProject, formattedData, loading, rawData, handleDelete, handleUpdate, changeStatus } =
        useUniqueProject()
    const { fetchPPI, ppiFormattedData, ppiLoading } = useUniquePPI()

    useEffect(() => {
        fetchProject(projectId)
        fetchGroups(projectId, {})
        if (userRole === UserRole.TEACHER && userId) {
            getAllSubjects({ teacherId: userId })
                .then((subs) => setTeacherSubjects(subs?.items || []))
                .catch(() => setTeacherSubjects([]))
        }
    }, [fetchProject, fetchGroups, projectId, userRole, userId])

    useEffect(() => {
        if (rawData?.ppiId) fetchPPI(rawData.ppiId)
    }, [fetchPPI, rawData])

    const getStatusClass = (status: string) => {
        switch (status) {
            case ProjectStatusMapped.NOT_STARTED:
                return "bg-gray-100 text-gray-700 hover:bg-gray-200"
            case ProjectStatusMapped.STARTED:
                return "bg-blue-100 text-blue-700 hover:bg-blue-200"
            case ProjectStatusMapped.FINISHED:
                return "bg-green-100 text-green-700 hover:bg-green-200"
            default:
                return "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
    }

    const canEdit = (justSubjectCoordinator: boolean = false) => {
        if (userRole === UserRole.COORDINATOR) return true

        if (userRole === UserRole.TEACHER && ppiFormattedData?.subjects) {
            if (justSubjectCoordinator) {
                return ppiFormattedData.subjects.some(
                    (ppiSub) => teacherSubjects.some((tSub) => tSub.id === ppiSub.id) && ppiSub.isCoordinator,
                )
            }
            return ppiFormattedData.subjects.some((ppiSub) => teacherSubjects.some((tSub) => tSub.id === ppiSub.id))
        }

        return false
    }

    return (
        <div className="p-6 min-h-screen">
            {loading || !formattedData || !rawData || ppiLoading ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-lg">Carregando informações do projeto...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 lg:col-span-2">
                        <h1 className="text-xl font-semibold text-gray-800 mb-2">
                            PROJETO DE PRÁTICA PROFISSIONAL INTEGRADA - PPI
                        </h1>
                        <h3 className="text-sm text-gray-500 mb-4">
                            <b>Tema: </b>
                            {formattedData.theme}
                        </h3>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
                            <div>
                                <dt className="font-medium text-gray-900">Ano / Semestre</dt>
                                <dd>{formattedData.executionPeriod}</dd>
                            </div>

                            <div>
                                <dt className="font-medium text-gray-900">Semestre ou ano da turma</dt>
                                <dd>{formattedData.ppiClassPeriod}</dd>
                            </div>

                            <div>
                                <dt className="font-medium text-gray-900">Carga Horária</dt>
                                <dd>{ppiFormattedData?.workload}h</dd>
                            </div>

                            <div>
                                <dt className="font-medium text-gray-900">Turma</dt>
                                <dd>{formattedData.class}</dd>
                            </div>

                            <div>
                                <dt className="font-medium text-gray-900">Diretor(a) Geral do Campus</dt>
                                <dd>{formattedData.campusDirector}</dd>
                            </div>

                            <div>
                                <dt className="font-medium text-gray-900">Diretor(a) de Ensino</dt>
                                <dd>{formattedData.academicDirector}</dd>
                            </div>

                            <div>
                                <dt className="font-medium text-gray-900">Status</dt>
                                <dd>
                                    {canEdit(true) ? (
                                        <button
                                            title="Alterar status"
                                            onClick={() => setIsStatusModalOpen(true)}
                                            className={`mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-200 ${getStatusClass(formattedData.status)}`}
                                        >
                                            <PencilSquareIcon className="w-4 h-4 opacity-70" /> {formattedData.status}
                                        </button>
                                    ) : (
                                        <span
                                            className={`mt-1 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusClass(formattedData.status)}`}
                                        >
                                            {formattedData.status}
                                        </span>
                                    )}
                                </dd>
                            </div>

                            {canEdit(true) && (
                                <div>
                                    <dt className="font-medium text-gray-900">Visível para todos</dt>
                                    <dd className="mt-1 flex items-center gap-2">
                                        <VisibilityTogglePopover
                                            project={formattedData}
                                            onUpdate={async (newValue) => {
                                                //TODO: handleVisibility
                                                formattedData.visibleToAll = newValue
                                            }}
                                        />
                                    </dd>
                                </div>
                            )}
                        </dl>

                        <div className="mt-4 mb-2">
                            <h4 className="font-medium text-gray-800 mb-2">Componentes Curriculares Envolvidos</h4>
                            <ul className="list-none space-y-1 text-sm text-gray-700">
                                {ppiFormattedData?.subjects?.map((sub) => (
                                    <li key={sub.id}>
                                        <span className="font-medium">{sub.name}</span> - {sub.workload}h
                                        {sub.isCoordinator ? " (coordenação)" : ""}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                            <Button variant="primary" className="px-2 py-1 text-sm" onClick={() => {}}>
                                Ver conteúdo
                            </Button>

                            {canEdit() && (
                                <>
                                    <ProjectMetadataPopover project={formattedData} />

                                    <button
                                        onClick={() => {
                                            setIsEditingProject(true)
                                        }}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-700 transition"
                                        title="Editar"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                            {canEdit(true) && (
                                <>
                                    <DeleteButtonModal id={formattedData.id} onDelete={handleDelete} />
                                </>
                            )}
                        </div>

                        <ProjectModal
                            isOpen={isEditingProject}
                            project={rawData}
                            onClose={() => setIsEditingProject(false)}
                            onSave={(data) => {
                                handleUpdate(formattedData.id, data)
                            }}
                        />

                        <ProjectStatusModal
                            isOpen={isStatusModalOpen}
                            currentStatus={rawData.status}
                            onClose={() => setIsStatusModalOpen(false)}
                            onSave={(newStatus) => {
                                changeStatus(formattedData.id, newStatus)
                            }}
                        />
                    </div>

                    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 flex flex-col w-full lg:col-span-1">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-800">Grupos</h2>
                            {canEdit() && (
                                <>
                                    <Button
                                        title="Criar novo grupo"
                                        variant="primary"
                                        onClick={() => setIsCreatingGroup(true)}
                                    >
                                        +
                                    </Button>
                                </>
                            )}
                        </div>

                        {groupFormattedData && groupFormattedData.length > 0 ? (
                            <ul className="space-y-2 overflow-y-auto pr-1 pb-2">
                                {groupFormattedData.map((group) => (
                                    <li
                                        key={group.id}
                                        className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-2">
                                                <h3 className="font-semibold text-gray-800 text-sm">{group.name}</h3>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    {group.users.length} integrante{group.users.length !== 1 ? "s" : ""}
                                                </p>
                                                <p className="text-sm text-gray-700 flex flex-wrap gap-x-1 gap-y-1">
                                                    {group.users.map((us, i) => (
                                                        <span
                                                            key={i}
                                                            className="bg-gray-100 px-1.5 py-0.5 rounded text-xs"
                                                        >
                                                            {abbreviateName(us.name)}
                                                        </span>
                                                    ))}
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-center gap-1">
                                                <button
                                                    onClick={() => {
                                                        const original =
                                                            groupRawData.find((r) => r.id === group.id) || null
                                                        setGroupSelectedForEdit(original)
                                                        setIsEditingGroup(true)
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-700 transition"
                                                    title="Editar"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
                                                </button>

                                                <DeleteButtonModal id={group.id} onDelete={handleDeleteGroup} />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic text-sm">Nenhum grupo cadastrado.</p>
                        )}

                        <GroupModal
                            isOpen={isCreatingGroup}
                            group={null}
                            projectId={projectId}
                            onClose={() => setIsCreatingGroup(false)}
                            onSave={handleCreate}
                        />

                        <GroupModal
                            isOpen={isEditingGroup}
                            group={groupSelectedForEdit}
                            projectId={projectId}
                            onClose={() => setIsEditingGroup(false)}
                            onSave={(data) => {
                                if (groupSelectedForEdit?.id) handleUpdateGroup(groupSelectedForEdit.id, data)
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
