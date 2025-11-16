"use client"

import Link from "next/link"
import { Card } from "@/components/card"
import { Button } from "@/components/buttons/default.button"
import { User } from "@/types/user.type"
import { MenuItens } from "@/types/initial-page.type"
import { Project } from "@/types/project.type"
import {
    AcademicCapIcon,
    BookOpenIcon,
    ClipboardDocumentListIcon,
    Squares2X2Icon,
    UserGroupIcon,
    UserIcon,
} from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChangePasswordModal } from "./users/change-password-modal"
import { useRole } from "@/hooks/use-role"

interface HomeLayoutInput {
    user: User
    menuItens: Array<MenuItens>
    shouldShowProjects: boolean
    projects?: Array<Project>
}

export default function HomeLayout({ user, menuItens, shouldShowProjects, projects }: HomeLayoutInput) {
    const { userId } = useRole()
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const router = useRouter()
    const allMenuItems = [
        { icon: AcademicCapIcon, label: "Cursos", href: "/cursos", type: MenuItens.COURSES },
        { icon: UserGroupIcon, label: "Usuários", href: "/usuarios", type: MenuItens.USERS },
        { icon: BookOpenIcon, label: "Disciplinas", href: "/disciplinas", type: MenuItens.SUBJECTS },
        { icon: ClipboardDocumentListIcon, label: "PPIs", href: "/ppis", type: MenuItens.PPIS },
        { icon: Squares2X2Icon, label: "Projetos", href: "/projetos", type: MenuItens.PROJECTS },
    ]

    const filteredMenu = allMenuItems.filter((item) => menuItens.includes(item.type))

    return (
        <main className="flex flex-col items-center w-full py-10">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Olá {user.name}!</h1>

            <Card className="w-full max-w-full md:max-w-6xl mx-auto p-4 md:p-8 rounded-xl border border-gray-200 shadow-sm space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shadow-sm">
                                    <UserIcon className="w-6 h-6 text-gray-600" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Matrícula / SIAPE
                                </p>
                                <p className="text-sm font-medium text-gray-800">{user.registration}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Vínculos</p>

                                <div className="space-y-1">
                                    {user.courses?.map((c) => (
                                        <div key={c.name} className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-800">{c.name}</span>

                                            <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full truncate">
                                                {c.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end mt-4">
                                <Button
                                    variant="secondary"
                                    className="text-xs text-gray-600 hover:text-gray-800"
                                    onClick={() => setOpenChangePassword(true)}
                                >
                                    Alterar senha
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800">Acesso rápido</h2>

                        <div
                            className={`grid gap-4
    ${filteredMenu.length === 1 ? "grid-cols-1 justify-center" : "grid-cols-2 sm:grid-cols-2"}`}
                        >
                            {filteredMenu.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <Card className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition flex flex-col items-center gap-3 cursor-pointer">
                                        <item.icon className="w-8 h-8 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-800">{item.label}</span>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {shouldShowProjects && projects && projects.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Acesse seus projetos em andamento</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projects.map((project) => (
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
                                                <span className="font-medium">Período de execução:</span>{" "}
                                                {project.executionPeriod}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            <ChangePasswordModal
                open={openChangePassword}
                onClose={() => setOpenChangePassword(false)}
                userId={userId as string}
            />
        </main>
    )
}
