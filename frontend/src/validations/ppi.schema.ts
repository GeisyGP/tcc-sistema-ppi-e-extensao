import { z } from "zod"

export const createPPISchema = z
    .object({
        classPeriod: z.string().min(1, "Ano/Semestre da turma é obrigatório").max(25, "Máximo 25 caracteres").trim(),
        workload: z.number().min(1, "Carga horária deve ser no mínimo 1 (um)"),
        subjects: z
            .array(
                z.object({
                    id: z.string(),
                    name: z.string().optional(),
                    workload: z.number().min(1, "Carga horária da disciplina deve ser no mínimo 1"),
                    isCoordinator: z.boolean().optional(),
                }),
            )
            .min(1, "Selecione pelo menos uma disciplina"),
    })
    .refine(
        (data) => {
            const total = data.subjects.reduce((acc, s) => acc + (s.workload || 0), 0)
            return total === data.workload
        },
        {
            message: "A soma das cargas horárias das disciplinas deve ser igual à carga horária total da PPI",
            path: ["subjects"],
        },
    )
