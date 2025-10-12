import { DegreeEnum, EducationLevelEnum, ModalityEnum, ShiftEnum } from "@/types/course.type"
import { z } from "zod"

export const createCourseSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(100, "Máximo 100 caracteres").trim(),
    technologicalAxis: z.string().min(1, "Eixo Tecnológico é obrigatório").max(100, "Máximo 100 caracteres").trim(),
    educationLevel: z.enum(EducationLevelEnum, "Selecione uma forma"),
    degree: z.enum(DegreeEnum, "Selecione um grau"),
    modality: z.enum(ModalityEnum, "Selecione uma modalidade"),
    shift: z.enum(ShiftEnum, "Selecione um turno"),
})
