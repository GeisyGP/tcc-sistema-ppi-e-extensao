import { DocumentIcon, PhotoIcon, VideoCameraIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline"

interface FileIconProps {
    mimeType: string
    className?: string
}

export function FileIcon({ mimeType, className }: FileIconProps) {
    if (mimeType.startsWith("image/")) return <PhotoIcon className={className} />
    if (mimeType.startsWith("video/")) return <VideoCameraIcon className={className} />
    if (mimeType === "application/pdf") return <DocumentIcon className={className} />
    return <QuestionMarkCircleIcon className={className} />
}
