import * as readline from "readline"
import * as stream from "stream"

export async function validateCsvContent(file: Express.Multer.File): Promise<{
    valid: boolean
    message?: string
    data?: Record<string, string>[]
}> {
    const readable = new stream.Readable()
    readable.push(file.buffer)
    readable.push(null)

    const rl = readline.createInterface({
        input: readable,
        crlfDelay: Infinity,
    })

    let header: string[] | null = null
    const data: Record<string, string>[] = []
    const requiredColumns = ["name", "registration", "password"]
    let delimiter = ","

    for await (const line of rl) {
        const trimmed = line.trim()

        if (!header) {
            delimiter = trimmed.includes(";") ? ";" : ","
            const currentHeader = trimmed.split(delimiter).map((h) => h.trim())

            const missing = requiredColumns.filter((col) => !currentHeader.includes(col))
            if (missing.length > 0) {
                return {
                    valid: false,
                    message: `File does not contain required columns: ${missing.join(", ")}`,
                }
            }

            header = currentHeader
            continue
        }

        const values = trimmed.split(delimiter).map((v) => v.trim())
        const record: Record<string, string> = {}
        header.forEach((key, i) => {
            record[key] = values[i] || ""
        })
        data.push(record)
    }

    if (!header || data.length === 0) {
        return { valid: false, message: "Invalid file" }
    }

    return { valid: true, data }
}
