import { z } from "zod"

export const createPPISchema = z.object({
    classPeriod: z.string().min(1, "Ano/Semestre da turma é obrigatório").max(25, "Máximo 25 caracteres").trim(),
    workload: z.number().min(1, "Carga horária deve ser no mínimo 1 (um)"),
    subjects: z.array(z.object()).min(1, "Selecione pelo menos uma disciplina"),
})
