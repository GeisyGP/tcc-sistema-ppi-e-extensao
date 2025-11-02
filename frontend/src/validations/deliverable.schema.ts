import z from "zod"

const today = new Date()
today.setHours(0, 0, 0, 0)

export const createDeliverableSchema = z
    .object({
        name: z.string().min(1, "Nome é obrigatório").max(25, "Máximo 25 caracteres").trim(),
        description: z.string().min(1, "Descrição é obrigatória").trim(),
        startDate: z.date({ error: "Data inicial é obrigatória" }).refine((d) => d >= today, {
            message: "A data inicial não pode ser anterior a data atual",
        }),
        endDate: z.date({ error: "Data final é obrigatória" }),
        subjectId: z.string().optional(),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: "A data final deve ser maior que a inicial",
        path: ["endDate"],
    })

export const updateDeliverableSchema = z
    .object({
        name: z.string().min(1, "Nome é obrigatório").max(25, "Máximo 25 caracteres").trim(),
        description: z.string().min(1, "Descrição é obrigatória").trim(),
        startDate: z.date({ error: "Data inicial é obrigatória" }),
        endDate: z.date({ error: "Data final é obrigatória" }),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: "A data final deve ser maior que a inicial",
        path: ["endDate"],
    })
