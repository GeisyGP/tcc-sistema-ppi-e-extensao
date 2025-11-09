"use client"

import HomeLayout from "@/components/home.layout"
import { useEffect, useState } from "react"
import { useCurrentUser } from "./hooks/use-current-user"
import { useRole } from "@/hooks/use-role"
import { mapInitialPage } from "./utils/map-initial-page"
import { InitialPage } from "@/types/initial-page.type"
import HomeSkeleton from "@/components/home-skeleton"
import { useProjects } from "../projetos/hooks/use-projects"
import { GetAllProjectsReq, ProjectStatus } from "@/types/project.type"
import { UserRole } from "@/types/user.type"

export default function HomePage() {
    const { userRole, userId } = useRole()
    const [initialPageContent, setInitialPageContent] = useState<InitialPage>()
    const { fecthUser, currentUserFormattedData, currentUserLoading } = useCurrentUser()
    const { formattedData: projectFormattedData, loading: loagindProjects, fetchProjects } = useProjects()

    useEffect(() => {
        setInitialPageContent(mapInitialPage(userRole))
    }, [userRole])

    useEffect(() => {
        if (!currentUserFormattedData) {
            fecthUser()
        }
    }, [currentUserFormattedData, fecthUser])

    useEffect(() => {
        if (!initialPageContent || (initialPageContent && !initialPageContent.projects)) return

        const projectFilter: GetAllProjectsReq = {
            limit: 5,
            page: 1,
            status: ProjectStatus.STARTED,
        }

        if (userRole === UserRole.TEACHER || userRole === UserRole.COORDINATOR) {
            projectFilter.teacherId = userId
        }

        if (userRole === UserRole.STUDENT) {
            projectFilter.studentId = userId
        }

        fetchProjects(projectFilter)
    }, [fetchProjects, userRole, userId, initialPageContent])

    if (currentUserLoading || !currentUserFormattedData || !initialPageContent || loagindProjects) {
        return <HomeSkeleton />
    }

    return (
        <HomeLayout
            user={currentUserFormattedData}
            menuItens={initialPageContent.menuItens}
            shouldShowProjects={initialPageContent.projects}
            projects={projectFormattedData}
        />
    )
}
