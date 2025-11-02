export const formatDateTimeLocal = (date?: string | Date) => {
    if (!date) return ""
    const d = typeof date === "string" ? new Date(date) : date
    const pad = (n: number) => String(n).padStart(2, "0")

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const formatDateTimeFriendly = (date?: string | Date): string => {
    if (!date) return ""

    const d = typeof date === "string" ? new Date(date) : date
    const pad = (n: number) => n.toString().padStart(2, "0")

    const day = pad(d.getDate())
    const month = pad(d.getMonth() + 1)
    const year = d.getFullYear()
    const hours = pad(d.getHours())
    const minutes = pad(d.getMinutes())

    return `${day}/${month}/${year} ${hours}:${minutes}`
}
