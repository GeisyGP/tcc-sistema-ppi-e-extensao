import { z } from "zod"

export const createProjectSchema = z.object({
    class: z.string().min(1, "Turma é obrigatória").max(25, "Máximo 25 caracteres").trim(),
    executionPeriod: z.string().min(1, "Período é obrigatório").trim(),
    theme: z.string().min(1, "Tema é obrigatório").max(150, "Máximo 150 caracteres").trim(),
    campusDirector: z.string().min(1, "Diretor(a) Geral é obrigatório").max(100, "Máximo 100 caracteres").trim(),
    academicDirector: z.string().min(1, "Diretor(a) de Ensino é obrigatório").max(100, "Máximo 100 caracteres").trim(),
    ppiId: z.string().min(1, "PPI é obrigatória").trim(),
})
