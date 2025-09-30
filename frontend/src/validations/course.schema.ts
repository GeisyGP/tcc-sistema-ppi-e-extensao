import { z } from "zod"

export const createCourseSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    technologicalAxis: z.string().min(1, "Eixo Tecnológico é obrigatório"),
    educationLevel: z.string().min(1, "Forma é obrigatória"),
    degree: z.string().min(1, "Grau é obrigatório"),
    modality: z.string().min(1, "Modalidade é obrigatória"),
    shift: z.string().min(1, "Turno é obrigatório")
})
