import { z } from "zod"

export const createCourseSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(100, "Máximo 100 caracteres").trim(),
    technologicalAxis: z.string().min(1, "Eixo Tecnológico é obrigatório").max(100, "Máximo 100 caracteres").trim(),
    educationLevel: z.string().min(1, "Forma é obrigatória").max(20, "Máximo 20 caracteres").trim(),
    degree: z.string().min(1, "Grau é obrigatório").max(20, "Máximo 20 caracteres").trim(),
    modality: z.string().min(1, "Modalidade é obrigatória").max(20, "Máximo 20 caracteres").trim(),
    shift: z.string().min(1, "Turno é obrigatório").max(30, "Máximo 30 caracteres").trim(),
})
