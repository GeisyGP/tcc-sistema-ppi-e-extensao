import z from "zod"

const today = new Date()
today.setHours(0, 0, 0, 0)

const toLocalDate = (value: string) => {
    const [date, time] = value.split("T")
    const [year, month, day] = date.split("-").map(Number)
    const [hour, minute] = time.split(":").map(Number)
    return new Date(year, month - 1, day, hour, minute)
}

export const createDeliverableSchema = z
    .object({
        name: z.string().min(1, "Nome é obrigatório").max(50, "Máximo 50 caracteres").trim(),
        description: z.string().min(1, "Descrição é obrigatória").trim(),
        startDate: z
            .string({ error: "Data inicial é obrigatória" })
            .transform(toLocalDate)
            .refine((d) => d >= today, {
                message: "A data inicial não pode ser anterior a data atual",
            }),
        endDate: z.string({ error: "Data final é obrigatória" }).transform(toLocalDate),
        subjectId: z.string().optional(),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: "A data final deve ser maior que a inicial",
        path: ["endDate"],
    })

export const updateDeliverableSchema = z
    .object({
        name: z.string().min(1, "Nome é obrigatório").max(50, "Máximo 50 caracteres").trim(),
        description: z.string().min(1, "Descrição é obrigatória").trim(),
        startDate: z.string({ error: "Data inicial é obrigatória" }).transform(toLocalDate),
        endDate: z.string({ error: "Data final é obrigatória" }).transform(toLocalDate),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: "A data final deve ser maior que a inicial",
        path: ["endDate"],
    })
