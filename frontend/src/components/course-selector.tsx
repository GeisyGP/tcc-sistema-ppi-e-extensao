"use client"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react"
import { selectCourse } from "@/services/auth.service"
import toast from "react-hot-toast"
import { AcademicCapIcon } from "@heroicons/react/20/solid"
import { ApiError } from "@/exceptions/api-error.exception"
import { GENERIC_ERROR_MESSAGE } from "@/constants"

export function CourseSelector() {
    const { data: session } = useSession()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleChange = async (courseId: string) => {
        try {
            const response = await selectCourse(courseId)
            await signIn("credentials", {
                redirect: false,
                accessToken: response.accessToken,
            })
            window.location.reload()
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }

    return (
        <>
            <div className="hidden sm:flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded border border-gray-200 shadow-sm opacity-80 w-48">
                <AcademicCapIcon className="w-5 h-5 text-gray-600 mr-1 flex-shrink-0" />
                <select
                    value={session?.user.mainCourseId}
                    onChange={(e) => handleChange(e.target.value)}
                    className="bg-gray-200 text-gray-800 text-sm border-none focus:ring-2 focus:ring-gray-200 rounded-md px-2 py-1 truncate w-full"
                >
                    {session?.user?.courses?.map((c) => (
                        <option key={c.courseId} value={c.courseId}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex sm:hidden items-center">
                <button
                    aria-label="Selecionar curso"
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded bg-gray-200/90 hover:bg-gray-200 text-gray-800"
                >
                    <AcademicCapIcon className="w-5 h-5" />
                </button>

                {mobileOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg p-4 w-[92%] max-w-sm">
                            <h3 className="text-sm font-semibold mb-2 text-gray-700">Selecionar curso</h3>
                            <select
                                value={session?.user.mainCourseId}
                                onChange={(e) => {
                                    handleChange(e.target.value)
                                    setMobileOpen(false)
                                }}
                                className="w-full border rounded-md p-2 text-sm"
                            >
                                <option value="">Selecione...</option>
                                {session?.user?.courses?.map((c) => (
                                    <option key={c.courseId} value={c.courseId}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
