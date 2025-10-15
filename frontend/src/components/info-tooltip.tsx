"use client"

import { useState } from "react"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

type InfoTooltipProps = {
    text: string
    position?: "top" | "right" | "bottom" | "left"
}

export function InfoTooltip({ text, position = "right" }: InfoTooltipProps) {
    const [show, setShow] = useState(false)

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
    }

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition" />

            {show && (
                <div
                    className={`absolute ${positionClasses[position]} w-64 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg z-10 transition-opacity duration-200`}
                >
                    {text}
                </div>
            )}
        </div>
    )
}
