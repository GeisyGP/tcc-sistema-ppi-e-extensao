import { z } from "zod"

export const createProjectSchema = z.object({
    class: z.string().min(1, "Turma é obrigatória").max(25, "Máximo 25 caracteres").trim(),
    currentYear: z.number().min(1, "Ano atual"),
    topic: z.string().min(1, "Tema é obrigatório").max(150, "Máximo 150 caracteres").trim(),
    ppiId: z.string().min(1, "PPI é obrigatória").trim(),
})
