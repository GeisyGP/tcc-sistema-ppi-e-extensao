"use client"

import { signIn, useSession } from "next-auth/react"
import { selectCourse } from "@/services/auth.service"
import toast from "react-hot-toast"
import { AcademicCapIcon } from "@heroicons/react/20/solid"

export function CourseSelector() {
    const { data: session } = useSession()

    const handleChange = async (courseId: string) => {
        try {
            const response = await selectCourse(courseId)
            await signIn("credentials", {
                redirect: false,
                accessToken: response.accessToken,
            })
            window.location.reload()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className="flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded border border-gray-200 shadow-sm opacity-80 w-48">
            <AcademicCapIcon className="w-5 h-5 text-gray-600 mr-1 flex-shrink-0" />
            <select
                value={session?.user.mainCourseId}
                onChange={e => handleChange(e.target.value)}
                className="bg-gray-200 text-gray-800 text-sm border-none focus:ring-2 focus:ring-gray-200 rounded-md px-2 py-1 truncate w-full"
            >
                {session?.user?.courses?.map(c => (
                    <option key={c.courseId} value={c.courseId}>
                        {c.name}
                    </option>
                ))}
            </select>
        </div>

    )
}
