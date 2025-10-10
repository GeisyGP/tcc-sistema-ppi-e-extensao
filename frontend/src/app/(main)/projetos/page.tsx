"use client"

import SearchBar from "@/components/search-bar"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/buttons/default.button"
import { PlusIcon } from "@heroicons/react/16/solid"
import { RoleGuard } from "@/components/role-guard"
import { UserRole } from "@/types/user.type"
import { useProjects } from "./hooks/use-projects"
import { ProjectModal } from "@/components/projects/project-modal"
import ProjectListHorizontal from "@/components/projects/project-grid"
import { FilterButton } from "@/components/buttons/filter.button"
import { ProjectStatus, ProjectStatusMapped } from "@/types/project.type"
import { useRole } from "@/hooks/use-role"
import { getAllPPIs } from "@/services/ppis.service"

export default function ProjectsPage() {
    const { loading, metadata, handleCreate, formattedData, fetchProjects } = useProjects()
    const [page, setPage] = useState(1)
    const [themeFilter, setThemeFilter] = useState<string | undefined>()
    const [creatingNew, setCreatingNew] = useState(false)
    const [statusFilter, setStatusFilter] = useState<ProjectStatus>()
    const [teacherIfFilter, setTeacherIdFilter] = useState<string>()
    const [studentIdFilter, setStudentIdFilter] = useState<string>()
    const [classFilter, setClassFilter] = useState<string>()
    const [executionPeriodFilter, setExecutionPeriodFilter] = useState<string>()
    const [ppiIdFilter, setPPIIdFilter] = useState<string>()
    const { can, userId } = useRole()
    const showMyProjectsFilter = can(UserRole.COORDINATOR, UserRole.TEACHER, UserRole.STUDENT)

    useEffect(() => {
        fetchProjects({
            page,
            theme: themeFilter,
            limit: 12,
            status: statusFilter,
            studentId: studentIdFilter,
            teacherId: teacherIfFilter,
            class: classFilter,
            executionPeriod: executionPeriodFilter,
            ppiId: ppiIdFilter,
        })
    }, [
        page,
        themeFilter,
        classFilter,
        ppiIdFilter,
        statusFilter,
        fetchProjects,
        studentIdFilter,
        teacherIfFilter,
        executionPeriodFilter,
    ])

    const fetchPPIOptions = useCallback(async () => {
        const data = await getAllPPIs({})
        return (
            data?.items.map((u) => ({
                label: u.classPeriod,
                value: u.id,
            })) || []
        )
    }, [])

    return (
        <RoleGuard roles={[UserRole.COORDINATOR, UserRole.TEACHER, UserRole.STUDENT, UserRole.SYSADMIN]}>
            <div className="w-full mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-6">Projetos</h1>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1">
                        <SearchBar
                            placeholder="Buscar projeto..."
                            onSearch={(value) => {
                                setThemeFilter(value)
                                setPage(1)
                            }}
                        />
                    </div>

                    <FilterButton
                        filters={[
                            {
                                key: "status",
                                label: "Status",
                                type: "select",
                                options: Object.entries(ProjectStatus).map(([key, value]) => ({
                                    label: ProjectStatusMapped[key as keyof typeof ProjectStatusMapped],
                                    value,
                                })),
                            },
                            ...(showMyProjectsFilter
                                ? [
                                      {
                                          key: "myProjects",
                                          label: "Meus projetos",
                                          type: "select" as const,
                                          options: [{ label: "Somente os meus", value: "mine" }],
                                      },
                                  ]
                                : []),
                            {
                                key: "ppiId",
                                label: "PPI",
                                type: "select",
                                onLoadOptions: fetchPPIOptions,
                            },
                            {
                                key: "class",
                                label: "Turma",
                                type: "text",
                            },
                            {
                                key: "executionPeriod",
                                label: "Período de execução (ano/semestre)",
                                type: "text",
                            },
                        ]}
                        onApply={(values) => {
                            setStatusFilter((values.status as ProjectStatus) || undefined)
                            setPage(1)

                            if (can(UserRole.TEACHER, UserRole.COORDINATOR)) {
                                setTeacherIdFilter(values.myProjects == "mine" ? userId : undefined)
                            } else if (can(UserRole.STUDENT)) {
                                setStudentIdFilter(values.myProjects == "mine" ? userId : undefined)
                            }

                            setPPIIdFilter(values.ppiId || undefined)
                            setClassFilter(values.class || undefined)
                            setExecutionPeriodFilter(values.executionPeriod || undefined)
                        }}
                    />

                    <RoleGuard roles={[UserRole.COORDINATOR, UserRole.TEACHER]}>
                        <Button
                            onClick={() => {
                                setCreatingNew(true)
                            }}
                            className="flex items-center gap-1 shadow-sm"
                        >
                            <PlusIcon className="h-6 w-5" />
                            Criar
                        </Button>
                    </RoleGuard>
                </div>

                {loading ? (
                    <p className="text-gray-500">Carregando...</p>
                ) : (
                    <ProjectListHorizontal
                        data={formattedData}
                        page={page}
                        totalPages={metadata.totalPages}
                        totalItems={metadata.totalItems}
                        onPageChange={setPage}
                        onView={(p) => console.log("Ver", p)}
                    />
                )}

                <ProjectModal
                    isOpen={creatingNew}
                    project={null}
                    onClose={() => setCreatingNew(false)}
                    onSave={handleCreate}
                />
            </div>
        </RoleGuard>
    )
}
